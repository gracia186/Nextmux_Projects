<?php

use App\Enums\EventAudience;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->string('audience')->default(EventAudience::All->value);
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['audience', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};