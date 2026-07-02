<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuditLog
{
    private const AUDITED_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

    private const EXCLUDED_PATHS = [
        'api/v1/me/notifications',
        'api/v1/attendance',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! in_array($request->method(), self::AUDITED_METHODS, true)) {
            return $response;
        }

        foreach (self::EXCLUDED_PATHS as $path) {
            if (str_contains($request->path(), $path)) {
                return $response;
            }
        }

        if (! $response->isSuccessful()) {
            return $response;
        }

        if (! $request->user()) {
            return $response;
        }

        $this->log($request, $response);

        return $response;
    }

    private function log(Request $request, Response $response): void
    {
        try {
            AuditLog::create([
                'id' => (string) Str::uuid(),
                'user_id' => $request->user()->id,
                'action' => $request->method().'.'.$request->path(),
                'target_type' => $this->extractTargetType($request),
                'target_id' => $this->extractTargetId($request),
                'payload' => json_encode($this->sanitizePayload($request->except([
                    'password',
                    'password_confirmation',
                    'token',
                    'mfa_secret',
                ]))),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    private function extractTargetType(Request $request): string
    {
        $segments = explode('/', $request->path());

        return $segments[2] ?? 'unknown';
    }

    private function extractTargetId(Request $request): string
    {
        $segments = explode('/', $request->path());

        foreach ($segments as $segment) {
            if (Str::isUuid($segment)) {
                return $segment;
            }
        }

        return 'none';
    }

    private function sanitizePayload(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value) && strlen($value) > 500) {
                $sanitized[$key] = substr($value, 0, 500).'...[tronqué]';
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}