<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Pending = 'pending';
    case Validated = 'validated';
    case Rejected = 'rejected';
}