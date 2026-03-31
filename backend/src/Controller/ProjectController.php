<?php

namespace App\Controller;

use App\DTO\CreateProjectDTO;
use App\DTO\EditProjectDTO;
use App\DTO\ProjectDTO;
use App\Entity\Project;
use App\Repository\ProjectRepository;
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

#[Route('api/projects')]
class ProjectController extends AbstractController
{
    #[Route('', name: 'api_projects_get_all', methods: ['GET'])]
    public function getAll(#[CurrentUser] $user, Request $request, ProjectRepository $projectRepository): JsonResponse
    {
        $search = $request->query->get('search', '');

        $projects = $projectRepository->searchByName($search, $user);
        return $this->json(array_map(fn($item) => $this->mapToProjectDTO($item), $projects), 200);
    }

    #[Route('/{id}', requirements: ['id' => '\d+'], name: 'api_projects_get_by_id', methods: ['GET'])]
    public function getById(int $id, #[CurrentUser] $user,  ProjectRepository $projectRepository): JsonResponse
    {
        $project = $projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if ($project == null) {
            return $this->json(['error' => 'Project not found'], 404);
        }

        return $this->json($this->mapToProjectDTO($project), 200);
    }

    #[Route('', name: 'api_projects_create', methods: ['POST'])]
    public function create(#[CurrentUser] $user, Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        try {
            $data = $serializer->deserialize($request->getContent(), CreateProjectDTO::class, 'json');
        } catch (NotNormalizableValueException | UnexpectedValueException $ex) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $errors = $validator->validate($data);

        if (count($errors) > 0) {
            $violations = $this->formatErrors($errors);
            return $this->json(['errors' => $violations], 400);
        }

        $project = new Project();
        $project->setName($data->name)
            ->setOwner($user)
            ->setDescription($data->description);

        $em->persist($project);
        $em->flush();

        return $this->json($this->mapToProjectDTO($project), 201);
    }

    #[Route('/{id}', requirements: ['id' => '\d+'], name: 'api_projects_edit', methods: ['PUT'])]
    public function edit(int $id, #[CurrentUser] $user, Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator, ProjectRepository $projectRepository): JsonResponse
    {
        $project = $projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if ($project == null) {
            return $this->json(['error' => 'Project not found'], 404);
        }

        try {
            $data = $serializer->deserialize($request->getContent(), EditProjectDTO::class, 'json');
        } catch (NotNormalizableValueException | UnexpectedValueException $ex) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $errors = $validator->validate($data);

        if (count($errors) > 0) {
            $violations = $this->formatErrors($errors);
            return $this->json(['errors' => $violations], 400);
        }

        $project->setName($data->name)
            ->setDescription($data->description);

        $em->flush();

        return $this->json($this->mapToProjectDTO($project), 200);
    }

    #[Route('/{id}', requirements: ['id' => '\d+'], name: 'api_projects_delete', methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] $user, ProjectRepository $projectRepository, EntityManagerInterface $em): JsonResponse
    {
        $project = $projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if ($project == null) {
            return $this->json(['error' => 'Project not found'], 404);
        }

        $em->remove($project);
        $em->flush();

        return $this->json(null, 204);
    }

    private function mapToProjectDTO(project $project): ProjectDTO
    {
        return new ProjectDTO(
            $project->getId(),
            $project->getName(),
            $project->getDescription()
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
