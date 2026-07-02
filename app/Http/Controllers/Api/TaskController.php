<?php

namespace App\Http\Controllers\Api;

use App\Actions\Task\CreateTaskAction;
use App\Actions\Task\UpdateTaskStatusAction;
use App\DTOs\TaskData;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Task\CreateTaskRequest;
use App\Http\Requests\Task\UpdateTaskStatusRequest;
use App\Http\Resources\TaskResource;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        private CreateTaskAction $createTaskAction,
        private UpdateTaskStatusAction $updateTaskStatusAction,
        private TaskRepositoryInterface $tasks,
    ) {
    }

    public function store(CreateTaskRequest $request, string $projectId): JsonResponse
    {
        $data = TaskData::fromArray(array_merge($request->validated(), [
            'project_id' => $projectId,
            'created_by' => auth()->id(),
        ]));

        $task = $this->createTaskAction->execute($data);

        return response()->json([
            'success' => true,
            'data' => new TaskResource($task),
        ], 201);
    }

    public function byProject(string $projectId): JsonResponse
    {
        $tasks = $this->tasks->byProject($projectId);

        return response()->json([
            'success' => true,
            'data' => TaskResource::collection($tasks),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $task = $this->tasks->find($id);

        $this->authorize('view', $task);

        return response()->json([
            'success' => true,
            'data' => new TaskResource($task),
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $task = $this->tasks->find($id);

        $this->authorize('updateStatus', $task);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'assigned_to' => ['nullable', 'uuid', 'exists:users,id'],
            'due_date' => ['nullable', 'date'],
        ]);

        $updated = $this->tasks->update($task, $validated);

        return response()->json([
            'success' => true,
            'data' => new TaskResource($updated),
        ]);
    }

    public function updateStatus(UpdateTaskStatusRequest $request, string $id): JsonResponse
    {
        $task = $this->tasks->find($id);

        $this->authorize('updateStatus', $task);

        $newStatus = TaskStatus::from($request->validated('status'));

        $updated = $this->updateTaskStatusAction->execute($task, $newStatus, auth()->user());

        return response()->json([
            'success' => true,
            'data' => new TaskResource($updated),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $task = $this->tasks->find($id);

        $this->authorize('delete', $task);

        $this->tasks->delete($task);

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Tâche supprimée avec succès.'],
        ]);
    }
}