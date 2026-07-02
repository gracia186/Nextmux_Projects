<?php

use App\Enums\InternshipStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('intern_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('mentor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedInteger('duration_days')->nullable();
            $table->string('status')->default(InternshipStatus::Active->value);
            $table->text('termination_reason')->nullable();
            $table->timestamps();

            $table->index(['intern_id', 'status']);
            $table->index(['mentor_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internships');
    }
};