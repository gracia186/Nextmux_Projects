<?php

namespace App\Repositories\Contracts;

use App\Models\InternshipFeedback;

interface InternshipFeedbackRepositoryInterface
{
    public function create(array $data): InternshipFeedback;
}
