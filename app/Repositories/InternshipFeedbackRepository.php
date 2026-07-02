<?php

namespace App\Repositories;

use App\Models\InternshipFeedback;
use App\Repositories\Contracts\InternshipFeedbackRepositoryInterface;

class InternshipFeedbackRepository implements InternshipFeedbackRepositoryInterface
{
    public function create(array $data): InternshipFeedback
    {
        return InternshipFeedback::create($data);
    }
}
