<?php

namespace App\Repositories;

use App\Enums\EventAudience;
use App\Enums\UserRole;
use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EventRepository implements EventRepositoryInterface
{
    public function find(string $id): ?Event
    {
        return Event::with('author')->find($id);
    }

    public function create(array $data): Event
    {
        return Event::create($data);
    }

    public function update(Event $event, array $data): Event
    {
        $event->update($data);

        return $event->fresh();
    }

    public function delete(Event $event): bool
    {
        return $event->delete();
    }

    public function paginateForRole(UserRole $role, int $perPage = 15): LengthAwarePaginator
    {
        $audiences = match ($role) {
            UserRole::Intern => [EventAudience::All->value, EventAudience::Interns->value],
            UserRole::Mentor => [EventAudience::All->value, EventAudience::Mentors->value],
            UserRole::Admin => [EventAudience::All->value, EventAudience::Interns->value, EventAudience::Mentors->value],
        };

        return Event::whereIn('audience', $audiences)
            ->whereNotNull('published_at')
            ->with('author')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }
}