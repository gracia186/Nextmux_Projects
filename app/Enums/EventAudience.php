<?php

namespace App\Enums;

enum EventAudience: string
{
    case All = 'all';
    case Interns = 'interns';
    case Mentors = 'mentors';
}