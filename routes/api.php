<?php

use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [\App\Http\Controllers\Api\Auth\ForgotPasswordController::class, 'store']);
        Route::post('reset-password', [\App\Http\Controllers\Api\Auth\ResetPasswordController::class, 'store']);
        Route::get('invitation/{token}', [AuthController::class, 'checkInvitation']);
        Route::post('invitation/accept', [AuthController::class, 'acceptInvitation']);
    });

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::prefix('me')->controller(MeController::class)->group(function () {
            Route::get('/', 'show');
            Route::patch('/', 'update');
            Route::post('avatar', 'uploadAvatar');
            Route::get('notifications', 'notifications');
            Route::post('notifications/read', 'markNotificationsRead');
            Route::get('data-export', 'dataExport');
        });

        Route::prefix('attendance')->controller(AttendanceController::class)->group(function () {
            Route::post('/', 'store');
            Route::get('/', 'history');
            Route::get('dashboard', 'dashboard');
            Route::get('{internId}', 'byIntern');
            Route::patch('{id}', 'correct');
        });

        Route::prefix('reports')->controller(ReportController::class)->group(function () {
            Route::post('/', 'store');
            Route::get('/', 'index');
            Route::get('pending', 'pending');
            Route::get('{id}', 'show');
            Route::post('{id}/validate', 'validateReport'); // ← RENOMMÉ
            Route::get('{id}/download', 'download');
        });

        Route::prefix('projects')->controller(ProjectController::class)->group(function () {
            Route::post('/', 'store');
            Route::get('/', 'index');
            Route::get('{id}', 'show');
            Route::patch('{id}', 'update');
            Route::post('{id}/assign', 'assign');
            Route::delete('{id}/assign/{internId}', 'unassign');
            Route::patch('{id}/progress', 'updateProgress');
            Route::post('{id}/evaluate/{internId}', 'evaluate');
        });

        Route::prefix('projects/{projectId}/tasks')->controller(TaskController::class)->group(function () {
            Route::post('/', 'store');
            Route::get('/', 'byProject');
        });

        Route::prefix('tasks')->controller(TaskController::class)->group(function () {
            Route::get('{id}', 'show');
            Route::patch('{id}', 'update');
            Route::patch('{id}/status', 'updateStatus');
            Route::delete('{id}', 'destroy');
        });

        Route::prefix('documents')->controller(DocumentController::class)->group(function () {
            Route::post('request', 'store'); // ← AJOUTÉ store
            Route::get('/', 'index');
            Route::get('pending', 'pending');
            Route::post('{id}/approve', 'approve');
            Route::post('{id}/reject', 'reject');
            Route::get('{id}/download', 'download');
        });

        Route::prefix('events')->controller(EventController::class)->group(function () {
            Route::post('/', 'store');
            Route::get('/', 'index');
            Route::get('{id}', 'show');
            Route::patch('{id}', 'update');
            Route::delete('{id}', 'destroy');
        });

        Route::prefix('admin')->group(function () {
            Route::prefix('users')->controller(AdminUserController::class)->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store');
                Route::get('{id}', 'show');
                Route::patch('{id}', 'update');
                Route::delete('{id}', 'destroy');
                Route::post('{id}/assign-mentor', 'assignMentor');
                Route::post('{id}/terminate', 'terminate');
                Route::delete('{id}/purge', 'purge');
                Route::post('{id}/resend-invitation', 'resendInvitation');
            });

            Route::prefix('stats')->controller(AdminStatsController::class)->group(function () {
                Route::get('overview', 'overview');
                Route::get('attendance', 'attendance');
                Route::get('reports', 'reports');
                Route::get('documents', 'documents');
            });
        });
    });
});