<?php

namespace App\Enums;

enum UserRole: string
{
    case Intern = 'intern';
    case Mentor = 'mentor';
    case Admin = 'admin';
}