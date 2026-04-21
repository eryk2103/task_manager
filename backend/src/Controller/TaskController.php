<?php

namespace App\Controller;

use App\Entity\Task;
use App\DTO\CreateTaskDTO;
use App\DTO\EditTaskDTO;
use App\DTO\TaskDTO;
use App\Enum\TaskStatus;
use App\Enum\TaskType;
use App\Enum\TaskPriority;
use App\Repository\ProjectRepository;
use App\Repository\TaskRepository;
use App\Service\TaskService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Exception\UnexpectedValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('api/tasks')]
class TaskController extends AbstractController
{
    public function __construct(Private TaskService $taskService) {}
    #[Route('', name: 'api_tasks_get_all', methods: ['GET'])]
    public function getAll(#[CurrentUser] $user, #[MapQueryParameter] int $project, #[MapQueryParameter] TaskStatus $status): JsonResponse
    {
        $tasks = $this->taskService->getAll($user, $project, $status);
        return $this->json(array_map(fn(Task $item) => $this->mapToTaskDTO($item), $tasks), 200);
    }

    #[Route('/{id}', name: 'api_tasks_get_by_id', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getById(int $id, #[CurrentUser] $user): JsonResponse
    {
        $task = $this->taskService->getById($user, $id);
        return $this->json($this->mapToTaskDTO($task), 200);
    }

    #[Route('', name: 'api_tasks_create', methods: ['POST'])]
    public function create(#[CurrentUser] $user, #[MapRequestPayload] CreateTaskDTO $createTaskDTO): JsonResponse
    {
        $task = $this->taskService->create($user, $createTaskDTO);
        return $this->json($this->mapToTaskDTO($task), 201);
    }

    #[Route('/{id}', name: 'api_tasks_edit', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function edit(int $id, #[CurrentUser] $user, #[MapRequestPayload] EditTaskDTO $editTaskDTO): JsonResponse
    {
        $task = $this->taskService->update($user, $editTaskDTO, $id);
        return $this->json($this->mapToTaskDTO($task), 200);
    }

    #[Route('/{id}', name: 'api_tasks_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] $user): JsonResponse
    {
        $this->taskService->delete($user, $id);
        return $this->json(null, 204);
    }

    private function mapToTaskDTO(Task $task): TaskDTO
    {
        return new TaskDTO(
            $task->getId(),
            $task->getName(),
            $task->getStatus(),
            $task->getProject()->getId(),
            $task->getType(),
            $task->getPriority()
        );
    }
}
