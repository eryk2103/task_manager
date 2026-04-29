<?php

namespace App\Service;

use App\DTO\CreateTaskDTO;
use App\DTO\EditTaskDTO;
use App\Entity\Task;
use App\Entity\User;
use App\Enum\TaskStatus;
use App\Exception\TaskNotFoundException;
use App\Repository\ProjectRepository;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;

class TaskService
{
    public function __construct(private TaskRepository $taskRepository, private EntityManagerInterface $em, private ProjectRepository $projectRepository)
    {
    }

    public function getAll(User $user, int $projectId, TaskStatus $status = TaskStatus::TODO, int $page = 1, int $limit = 20): array
    {
        if($limit < 1 || $page < 1) {
            return ['data' => [], 'total' => 0];
        }

        $result = $this->taskRepository->findByOwnerAndProject($user, $projectId, $status->name, $page, $limit);
        $pages = ceil($result['total'] / $limit);

        return ['data' => $result['data'], 'total' => $result['total'], 'pages' => $pages];
    }

    public function getById(User $user, int $id): Task
    {
        $task = $this->taskRepository->findOneByOwner($user, $id);
        if($task === null) {
            throw new TaskNotFoundException();
        }

        return $task;
    }

    public function create(User $user, CreateTaskDTO $createTaskDTO): Task
    {
        $project = $this->projectRepository->findOneBy(['id' => $createTaskDTO->projectId, 'owner' => $user]);

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

    public function update(User $user, EditTaskDTO $editTaskDTO, int $id): Task
    {
        $task = $this->taskRepository->findOneByOwner($user, $id);
        if ($task === null) {
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

    public function delete(User $user, int $id): void
    {
        $task = $this->taskRepository->findOneByOwner($user, $id);
        if ($task === null) {
            throw new TaskNotFoundException();
        }

        $this->em->remove($task);
        $this->em->flush();
    }
}
