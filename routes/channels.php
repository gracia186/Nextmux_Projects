<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('intern.{internId}', function ($user, $internId) {
    return $user->id === $internId || $user->isAdmin();
});

Broadcast::channel('mentor.{mentorId}', function ($user, $mentorId) {
    return $user->id === $mentorId || $user->isAdmin();
});

Broadcast::channel('admin', function ($user) {
    return $user->isAdmin();
});