<?php

namespace App\Providers;

use App\Repositories\AuditLogRepository;
use App\Repositories\AttendanceRepository;
use App\Repositories\Contracts\AuditLogRepositoryInterface;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Repositories\Contracts\DocumentRepositoryInterface;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\Repositories\Contracts\InternshipFeedbackRepositoryInterface;
use App\Repositories\Contracts\InternshipRepositoryInterface;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\Contracts\ReportRepositoryInterface;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\DocumentRepository;
use App\Repositories\EventRepository;
use App\Repositories\InternshipFeedbackRepository;
use App\Repositories\InternshipRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\ReportRepository;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use App\Repositories\PermissionRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(InternshipRepositoryInterface::class, InternshipRepository::class);
        $this->app->bind(AttendanceRepositoryInterface::class, AttendanceRepository::class);
        $this->app->bind(ReportRepositoryInterface::class, ReportRepository::class);
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(DocumentRepositoryInterface::class, DocumentRepository::class);
        $this->app->bind(EventRepositoryInterface::class, EventRepository::class);
        $this->app->bind(AuditLogRepositoryInterface::class, AuditLogRepository::class);
        $this->app->bind(InternshipFeedbackRepositoryInterface::class, InternshipFeedbackRepository::class);
        $this->app->bind(PermissionRepositoryInterface::class, PermissionRepository::class);
    }
}