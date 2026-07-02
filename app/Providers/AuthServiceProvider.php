<?php

namespace App\Providers;

use App\Models\Attendance;
use App\Models\Document;
use App\Models\Event;
use App\Models\Project;
use App\Models\Report;
use App\Models\Task;
use App\Models\User;
use App\Policies\AttendancePolicy;
use App\Policies\DocumentPolicy;
use App\Policies\EventPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ReportPolicy;
use App\Policies\TaskPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Attendance::class => AttendancePolicy::class,
        Document::class => DocumentPolicy::class,
        Event::class => EventPolicy::class,
        Project::class => ProjectPolicy::class,
        Report::class => ReportPolicy::class,
        Task::class => TaskPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}