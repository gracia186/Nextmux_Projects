<?php

use App\Enums\AttendanceStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('intern_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('internship_id')->constrained('internships')->cascadeOnDelete();
            $table->date('date');
            $table->string('status')->default(AttendanceStatus::Present->value);
            $table->text('note')->nullable();
            $table->foreignUuid('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['intern_id', 'date']);
            $table->index(['internship_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};