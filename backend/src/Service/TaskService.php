<?php

namespace App\Service;

use App\DTO\CreateTaskDTO;
use App\DTO\EditTaskDTO;
use App\DTO\PaginationDTO;
use App\DTO\TaskDTO;
use App\DTO\PaginatedResultDTO;
use App\Entity\Task;
use App\Entity\User;
use App\Enum\TaskStatus;
use App\Exception\TaskNotFoundException;
use App\Repository\ProjectRepository;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;

class TaskService {
    public function __construct(private TaskRepository $taskRepository, private EntityManagerInterface $em, private ProjectRepository $projectRepository) {}

    public function getAll(User $user, int $projectId, TaskStatus $status = TaskStatus::TODO, int $page = 1, int $limit = 20): PaginatedResultDTO {
        $result = $this->taskRepository->findByOwnerAndProject($user, $projectId, $status->name, $page, $limit);
        $tasksDTO = array_map(fn($item) => $this->mapToTaskDTO($item), $result['data']);

        return new PaginatedResultDTO($tasksDTO, new PaginationDTO($page, $limit, $result['total'], ceil($result['total'] / $limit)));
    }

    public function getById(User $user, int $id): TaskDTO|null {
        return $this->mapToTaskDTO($this->taskRepository->findOneByOwner($user, $id));
    }

    public function create(User $user, CreateTaskDTO $createTaskDTO): TaskDTO {
        $project = $this->projectRepository->findOneBy(['id' => $createTaskDTO->projectId, 'owner' => $user]);

        $task = new Task();
        $task->setName($createTaskDTO->name)
            ->setPriority($createTaskDTO->priority)
            ->setStatus($createTaskDTO->status)
            ->setType($createTaskDTO->type)
            ->setProject($project);

        $this->em->persist($task);
        $this->em->flush();

        return $this->mapToTaskDTO($task);
    }

    public function update(User $user, EditTaskDTO $editTaskDTO, int $id): TaskDTO {
        $task = $this->taskRepository->findOneByOwner($user, $id);
        if($task === null) {
            throw new TaskNotFoundException();
        }

        $task->setName($editTaskDTO->name)
            ->setPriority($editTaskDTO->priority)
            ->setStatus($editTaskDTO->status)
            ->setType($editTaskDTO->type);

        $this->em->persist($task);
        $this->em->flush();

        return $this->mapToTaskDTO($task);
    }

    public function delete(User $user, int $id): void {
        $task = $this->taskRepository->findOneByOwner($user, $id);
        if($task === null) {
            throw new TaskNotFoundException();
        }

        $this->em->remove($task);
        $this->em->flush();
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
