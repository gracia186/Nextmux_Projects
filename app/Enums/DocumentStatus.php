<?php

namespace App\Enums;

enum DocumentStatus: string
{
    case Pending = 'pending';
    case MentorApproved = 'mentor_approved';
    case MentorRejected = 'mentor_rejected';
    case AdminRejected = 'admin_rejected';
    case Completed = 'completed';
}