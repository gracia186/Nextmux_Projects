<?php

use App\Enums\ProjectStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('mentor_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->text('objectives')->nullable();
            $table->text('deliverables')->nullable();
            $table->unsignedTinyInteger('progress')->default(0);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status')->default(ProjectStatus::Active->value);
            $table->timestamps();

            $table->index(['mentor_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};