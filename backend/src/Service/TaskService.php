<?php

namespace App\Service;

use App\DTO\CreateTaskDTO;
use App\DTO\EditTaskDTO;
use App\Entity\Task;
use App\Entity\User;
use App\Enum\TaskStatus;
use App\Exception\TaskNotFoundException;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;

class TaskService {
    public function __construct(private TaskRepository $taskRepository, private EntityManagerInterface $em, private ProjectService $projectService) {}

    public function getAll(User $user, int $projectId, TaskStatus $status = TaskStatus::TODO): array {
        return $this->taskRepository->findByOwnerAndProject($user, $projectId, $status->name);
    }

    public function getById(User $user, int $id): Task|null {
        return $this->taskRepository->findOneByOwner($user, $id);
    }

    public function create(User $user, CreateTaskDTO $createTaskDTO): Task {
        $project = $this->projectService->getById($user, $createTaskDTO->projectId);

        $task = new Task();
        $task->setName($createTaskDTO->name)
            ->setPriority($createTaskDTO->priority)
            ->setStatus($createTaskDTO->status)
            ->setType($createTaskDTO->type)
            ->setProject($project);

        $this->em->persist($task);
        $this->em->flush();

        return $task;
    }

    public function update(User $user, EditTaskDTO $editTaskDTO, int $id): Task {
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

        return $task;
    }

    public function delete(User $user, int $id): void {
        $task = $this->taskRepository->findOneByOwner($user, $id);
        if($task === null) {
            throw new TaskNotFoundException();
        }

        $this->em->remove($task);
        $this->em->flush();
    }
}
