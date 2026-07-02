<?php

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('intern_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('internship_id')->constrained('internships')->cascadeOnDelete();
            $table->string('type')->default(ReportType::Weekly->value);
            $table->date('period_start');
            $table->date('period_end');
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedInteger('file_size');
            $table->string('status')->default(ReportStatus::Pending->value);
            $table->text('mentor_comment')->nullable();
            $table->foreignUuid('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();

            $table->index(['intern_id', 'status']);
            $table->index(['internship_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};