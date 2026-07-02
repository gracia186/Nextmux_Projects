<?php

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('intern_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('internship_id')->constrained('internships')->cascadeOnDelete();
            $table->string('type')->default(DocumentType::Attestation->value);
            $table->string('status')->default(DocumentStatus::Pending->value);
            $table->text('request_note')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('file_path')->nullable();
            $table->string('document_number')->unique()->nullable();
            $table->timestamp('requested_at')->useCurrent();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();

            $table->index(['intern_id', 'status']);
            $table->index(['status', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};