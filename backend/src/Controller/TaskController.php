<?php

namespace App\Controller;

use App\Entity\Task;
use App\DTO\CreateTaskDTO;
use App\DTO\EditTaskDTO;
use App\DTO\TaskDTO;
use App\Enum\TaskStatus;
use App\Repository\ProjectRepository;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Exception\UnexpectedValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('api/tasks')]
class TaskController extends AbstractController
{
    #[Route('', name: 'api_tasks_get_all', methods: ['GET'])]
    public function getAll(#[CurrentUser()] $user, TaskRepository $taskRepository, Request $request, ProjectRepository $projectRepository): JsonResponse
    {
        $projectId = $request->query->get('project');
        $status = $request->query->get('status', '');

        if ($projectId !== null) {
            if (!ctype_digit($projectId)) {
                return $this->json(['error' => 'Invalid project id'], 400);
            }
            if ($status !== '' && TaskStatus::tryFrom(strtoupper($status)) === null) {
                return $this->json(['error' => 'Invalid status type'], 400);
            }

            $project = $projectRepository->findOneBy(['id' => $projectId, 'owner' => $user]);
            if ($project === null) {
                return $this->json(['error' => 'Project not found'], 404);
            }

            $tasks = $taskRepository->findByOwnerAndProject($user, $project, $status);
        } else {
            $tasks = $taskRepository->findByOwner($user, $status);
        }

        return $this->json(array_map(fn(Task $item) => $this->mapToTaskDTO($item), $tasks), 200);
    }

    #[Route('/{id}', requirements: ['id' => '\d+'], name: 'api_tasks_get_by_id', methods: ['GET'])]
    public function getById(int $id, #[CurrentUser] $user, TaskRepository $taskRepository): JsonResponse
    {
        $task = $taskRepository->findOneByOwner($user, $id);
        if ($task == null) {
            return $this->json(['error' => 'Task not found'], 404);
        }

        return $this->json($this->mapToTaskDTO($task), 200);
    }

    #[Route('', name: 'api_tasks_create', methods: ['POST'])]
    public function create(#[CurrentUser] $user, Request $request, SerializerInterface $serializer, ValidatorInterface $validator, ProjectRepository $projectRepository, EntityManagerInterface $em): JsonResponse
    {
        try {
            $data = $serializer->deserialize($request->getContent(), CreateTaskDTO::class, 'json');
        } catch (NotNormalizableValueException | UnexpectedValueException $ex) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $errors = $validator->validate($data);

        if (count($errors) > 0) {
            $violations = $this->formatErrors($errors);
            return $this->json(['errors' => $violations], 400);
        }

        $project = $projectRepository->findOneBy(['id' => $data->projectId, 'owner' => $user]);
        if ($project === null) {
            return $this->json(['error' => 'Project not found'], 404);
        }

        $task = new Task();
        $task->setName($data->name)
            ->setProject($project)
            ->setStatus(TaskStatus::IDEA);

        $em->persist($task);
        $em->flush();

        return $this->json($this->mapToTaskDTO($task), 201);
    }

    #[Route('/{id}', requirements: ['id' => '\d+'], name: 'api_tasks_edit', methods: ['PUT'])]
    public function edit(int $id, #[CurrentUser] $user, Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator, TaskRepository $taskRepository): JsonResponse
    {
        $task = $taskRepository->findOneByOwner($user, $id);
        if ($task == null) {
            return $this->json(['error' => 'Task not found'], 404);
        }

        try {
            $data = $serializer->deserialize($request->getContent(), EditTaskDTO::class, 'json');
        } catch (NotNormalizableValueException | UnexpectedValueException $ex) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $errors = $validator->validate($data);

        if (count($errors) > 0) {
            $violations = $this->formatErrors($errors);
            return $this->json(['errors' => $violations], 400);
        }

        $status = TaskStatus::tryFrom($data->status);
        if (!$status) {
            return $this->json(['error' => 'Invalid status'], 400);
        }

        $task->setName($data->name)
            ->setStatus($status);

        $em->flush();

        return $this->json($this->mapToTaskDTO($task), 200);
    }

    #[Route('/{id}', requirements: ['id' => '\d+'], name: 'api_tasks_delete', methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] $user, TaskRepository $taskRepository, EntityManagerInterface $em): JsonResponse
    {
        $task = $taskRepository->findOneByOwner($user, $id);
        if ($task == null) {
            return $this->json(['error' => 'Task not found'], status: 404);
        }

        $em->remove($task);
        $em->flush();

        return $this->json(null, 204);
    }

    private function mapToTaskDTO(Task $task): TaskDTO
    {
        return new TaskDTO(
            $task->getId(),
            $task->getName(),
            $task->getStatus(),
            $task->getProject()->getId()
        );
    }

    private function formatErrors($errors): array
    {
        $result = [];
        foreach ($errors as $error) {
            $result[$error->getPropertyPath()][] = $error->getMessage();
        }
        return $result;
    }
}
