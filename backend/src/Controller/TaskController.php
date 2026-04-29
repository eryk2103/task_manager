<?php

namespace App\Controller;

use App\DTO\PaginatedResultDTO;
use App\DTO\PaginationDTO;
use App\DTO\TaskQueryDTO;
use App\DTO\CreateTaskDTO;
use App\DTO\EditTaskDTO;
use App\Mapper\TaskMapper;
use App\Service\TaskService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;


#[Route('api/tasks')]
class TaskController extends AbstractController
{
    public function __construct(private TaskService $taskService, private TaskMapper $taskMapper) {}
    #[Route('', name: 'api_tasks_get_all', methods: ['GET'])]
    public function getAll(#[CurrentUser] $user, #[MapQueryString] TaskQueryDTO $query): JsonResponse
    {
        $result = $this->taskService->getAll($user, $query->project, $query->status, $query->page, $query->limit);

        $tasks = array_map(fn($project) => $this->taskMapper->mapToDTO($project), $result['data']);
        $pagination = new PaginationDTO($query->page, $query->limit, $result['total'], $result['pages']);

        $paginatedResult = new PaginatedResultDTO($tasks, $pagination);
        return $this->json($paginatedResult, 200);

    }

    #[Route('/{id}', name: 'api_tasks_get_by_id', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getById(int $id, #[CurrentUser] $user): JsonResponse
    {
        $task = $this->taskService->getById($user, $id);
        return $this->json($this->taskMapper->mapToDTO($task), 200);
    }

    #[Route('', name: 'api_tasks_create', methods: ['POST'])]
    public function create(#[CurrentUser] $user, #[MapRequestPayload] CreateTaskDTO $createTaskDTO): JsonResponse
    {
        $task = $this->taskService->create($user, $createTaskDTO);
        return $this->json($this->taskMapper->mapToDTO($task), 201);
    }

    #[Route('/{id}', name: 'api_tasks_edit', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function edit(int $id, #[CurrentUser] $user, #[MapRequestPayload] EditTaskDTO $editTaskDTO): JsonResponse
    {
        $task = $this->taskService->update($user, $editTaskDTO, $id);
        return $this->json($this->taskMapper->mapToDTO($task), 200);
    }

    #[Route('/{id}', name: 'api_tasks_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] $user): JsonResponse
    {
        $this->taskService->delete($user, $id);
        return $this->json(null, 204);
    }
}
