<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'status' => $this->status,
            'avatar_path' => $this->avatar_path,
            'mfa_enabled' => $this->mfa_enabled,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}