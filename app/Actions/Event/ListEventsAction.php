<?php

namespace App\Actions\Event;

use App\Models\User;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListEventsAction
{
    public function __construct(
        private EventRepositoryInterface $events,
    ) {
    }

    public function execute(User $requester, int $perPage = 15): LengthAwarePaginator
    {
        return $this->events->paginateForRole($requester->role, $perPage);
    }
}