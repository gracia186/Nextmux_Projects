<?php

namespace App\Enums;

enum InternshipStatus: string
{
    case Active = 'active';
    case Completed = 'completed';
    case Terminated = 'terminated';
}