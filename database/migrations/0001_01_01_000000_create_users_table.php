<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->string('role')->default(UserRole::Intern->value);
            $table->string('status')->default(UserStatus::Pending->value);
            $table->string('avatar_path')->nullable();
            $table->boolean('mfa_enabled')->default(false);
            $table->text('mfa_secret')->nullable();
            $table->timestamp('consent_accepted_at')->nullable();
            $table->string('invitation_token')->nullable();
            $table->timestamp('invitation_token_expires_at')->nullable();
            $table->timestamp('invitation_accepted_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index('role');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};