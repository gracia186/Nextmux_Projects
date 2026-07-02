<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_intern', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignUuid('intern_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('assigned_at')->useCurrent();
            $table->unsignedTinyInteger('evaluation_score')->nullable();
            $table->text('evaluation_comment')->nullable();
            $table->timestamp('evaluated_at')->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'intern_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_intern');
    }
};