<?php

namespace App\Repositories\Contracts;

use App\Models\Internship;
use Illuminate\Support\Collection;

interface InternshipRepositoryInterface
{
    public function find(string $id): ?Internship;

    public function findActiveByIntern(string $internId): ?Internship;

    public function create(array $data): Internship;

    public function update(Internship $internship, array $data): Internship;

    public function internsByMentor(string $mentorId): Collection;
}