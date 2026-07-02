<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internship_feedbacks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('intern_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('internship_id')->constrained('internships')->cascadeOnDelete();
            $table->unsignedTinyInteger('welcome_rating');
            $table->unsignedTinyInteger('mentorship_rating');
            $table->unsignedTinyInteger('atmosphere_rating');
            $table->unsignedTinyInteger('professional_value_rating');
            $table->unsignedTinyInteger('recommendation_score');
            $table->text('comment')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->timestamps();

            $table->unique('internship_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internship_feedbacks');
    }
};