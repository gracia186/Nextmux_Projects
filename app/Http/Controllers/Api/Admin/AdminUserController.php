<?php

namespace App\Http\Controllers\Api\Admin;

use App\Actions\Intern\AssignMentorAction;
use App\Actions\Intern\CreateInternAction;
use App\Actions\Intern\TerminateInternshipAction;
use App\DTOs\CreateInternData;
use App\DTOs\CreateUserData;
use App\DTOs\TerminateInternshipData;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Jobs\SendEmailNotificationJob;
use App\Notifications\InvitationNotification;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $users,
        private InternshipRepositoryInterface $internships,
        private CreateInternAction $createInternAction,
        private AssignMentorAction $assignMentorAction,
        private TerminateInternshipAction $terminateInternshipAction,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $users = $this->users->paginate(15, $request->only(['role', 'status', 'search']));

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
            'meta' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', \Illuminate\Validation\Rule::enum(UserRole::class)],
            'start_date' => ['required_if:role,intern', 'date'],
            'end_date' => ['required_if:role,intern', 'date', 'after:start_date'],
            'mentor_id' => ['nullable', 'uuid', 'exists:users,id'],
        ]);

        $role = UserRole::from($validated['role']);

        if ($role === UserRole::Intern) {
            $result = $this->createInternAction->execute(
                CreateInternData::fromArray($validated)
            );

            $user = $result['user'];
            $rawToken = $result['raw_invitation_token'];
        } else {
            $user = $this->users->create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $role->value,
                'status' => UserStatus::Pending->value,
                'invitation_token' => hash('sha256', $rawToken = \Illuminate\Support\Str::random(64)),
                'invitation_token_expires_at' => now()->addHours(72),
            ]);
        }

        $user->notify(new InvitationNotification($rawToken));

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $user = $this->users->find($id);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $user = $this->users->find($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', \Illuminate\Validation\Rule::enum(UserStatus::class)],
        ]);

        $updated = $this->users->update($user, $validated);

        return response()->json([
            'success' => true,
            'data' => new UserResource($updated),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $user = $this->users->find($id);

        $this->users->update($user, ['status' => UserStatus::Inactive->value]);
        $user->delete();

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Compte désactivé avec succès.'],
        ]);
    }

    public function assignMentor(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $validated = $request->validate([
            'mentor_id' => ['required', 'uuid', 'exists:users,id'],
        ]);

        $internship = $this->internships->findActiveByIntern($id);

        $updated = $this->assignMentorAction->execute($internship, $validated['mentor_id']);

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Mentor affecté avec succès.'],
        ]);
    }

    public function terminate(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $internship = $this->internships->findActiveByIntern($id);

        $this->terminateInternshipAction->execute(
            $internship,
            TerminateInternshipData::fromArray([
                'internship_id' => $internship->id,
                'reason' => $validated['reason'],
            ])
        );

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Stage clôturé avec succès.'],
        ]);
    }

    public function purge(string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $user = $this->users->find($id);

        $this->users->update($user, [
            'name' => 'Utilisateur supprimé',
            'email' => 'deleted_'.hash('sha256', $user->email).'@nextmux.deleted',
            'avatar_path' => null,
            'status' => UserStatus::Inactive->value,
        ]);

        $user->delete();

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Données anonymisées avec succès.'],
        ]);
    }

    public function resendInvitation(string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\User::class);

        $user = $this->users->find($id);

        $rawToken = \Illuminate\Support\Str::random(64);

        $this->users->update($user, [
            'invitation_token' => hash('sha256', $rawToken),
            'invitation_token_expires_at' => now()->addHours(72),
        ]);

        $user->notify(new InvitationNotification($rawToken));

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Invitation renvoyée avec succès.'],
        ]);
    }
}