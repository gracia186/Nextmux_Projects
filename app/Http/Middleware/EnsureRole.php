<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'Vous devez être connecté pour accéder à cette ressource.',
                ],
            ], 401);
        }

        $userRole = $request->user()->role->value;

        if (! in_array($userRole, $roles, true)) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.',
                ],
            ], 403);
        }

        return $next($request);
    }
}