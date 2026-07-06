<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->uuid('mentor_id')->nullable()->after('intern_id');
            $table->timestamp('mentor_validated_at')->nullable()->after('reviewed_at');
            $table->timestamp('uploaded_at')->nullable()->after('mentor_validated_at');

            $table->foreign('mentor_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['mentor_id']);
            $table->dropColumn(['mentor_id', 'mentor_validated_at', 'uploaded_at']);
        });
    }
};