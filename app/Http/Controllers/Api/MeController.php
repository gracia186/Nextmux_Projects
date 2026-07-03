<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\Auth\EnableMfaRequest;
use App\Http\Requests\Auth\UpdateMfaSecretRequest;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\FileStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $users,
        private FileStorageService $fileStorage,
    ) {
    }

    public function show(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource(auth()->user()),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
        ]);

        $user = $this->users->update(auth()->user(), $validated);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $path = $this->fileStorage->store($request->file('avatar'), 'avatars');

        $user = $this->users->update(auth()->user(), ['avatar_path' => $path]);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    public function notifications(): JsonResponse
    {
        $notifications = auth()->user()
            ->notifications()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function markNotificationsRead(): JsonResponse
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Notifications marquées comme lues.'],
        ]);
    }

    public function dataExport(): JsonResponse
    {
        $user = auth()->user()->load([
            'internshipAsIntern',
            'attendances',
            'reports',
            'documents',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
                'internships' => $user->internshipAsIntern,
                'attendances' => $user->attendances,
                'reports' => $user->reports,
                'documents' => $user->documents,
            ],
        ]);
    }

    public function enableMfa(EnableMfaRequest $request): JsonResponse
    {
        $user = auth()->user();

        $updated = $this->users->update($user, [
            'mfa_enabled' => $request->validated('mfa_enabled'),
        ]);

        return response()->json([
            'success' => true,
            'data' => new UserResource($updated),
        ]);
    }

    public function updateMfaSecret(UpdateMfaSecretRequest $request): JsonResponse
    {
        $user = auth()->user();

        $updated = $this->users->update($user, [
            'mfa_secret' => $request->validated('mfa_secret'),
        ]);

        return response()->json([
            'success' => true,
            'data' => new UserResource($updated),
        ]);
    }
}
