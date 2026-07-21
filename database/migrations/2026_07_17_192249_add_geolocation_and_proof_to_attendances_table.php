<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('arrival_time');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->string('late_proof_path')->nullable()->after('late_reason');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'late_proof_path']);
        });
    }
};