<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert numeric notifiable_id to UUID char(36)
        DB::statement("ALTER TABLE `notifications` MODIFY `notifiable_id` CHAR(36) NOT NULL");

        // Ensure composite index exists for morph lookup
        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['notifiable_type', 'notifiable_id'], 'notifications_notifiable_type_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('notifications_notifiable_type_id_index');
        });

        DB::statement("ALTER TABLE `notifications` MODIFY `notifiable_id` BIGINT(20) UNSIGNED NOT NULL");
    }
};
