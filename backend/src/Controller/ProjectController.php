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
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Constraints\Json;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('projects')]
class ProjectController extends AbstractController
{
    #[Route('', name: 'api_projects_get_all', methods: ['GET'])]
    public function getAll(ProjectRepository $projectRepository): JsonResponse
    {
        $projects = $projectRepository->findAll();
        return $this->json(array_map(fn($item) => new ProjectDTO($item->getId(), $item->getName(), $item->getDescription()), $projects), 200);
    }

    #[Route('/{id}', name: 'api_projects_get_by_id', methods: ['GET'])]
    public function getById(int $id, ProjectRepository $projectRepository): JsonResponse
    {
        $project = $projectRepository->findOneBy(['id' => $id]);
        if ($project == null) {
            return new JsonResponse(status: 404);
        }

        return $this->json(new ProjectDTO($project->getId(), $project->getName(), $project->getDescription()), 200);
    }

    #[Route('', name: 'api_projects_create', methods: ['POST'])]
    public function create(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        $data = $serializer->deserialize($request->getContent(), CreateProjectDTO::class, 'json');
        $errors = $validator->validate($data);

        if (count($errors) > 0) {
            $violations = [];
            foreach ($errors as $error) {
                $violations[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json(['errors' => $violations], 400);
        }

        $project = new Project();
        $project->setName($data->name)
            ->setDescription($data->description);

        $em->persist($project);
        $em->flush();

        $projectDTO = new ProjectDTO($project->getId(), $project->getName(), $project->getDescription());

        return $this->json($projectDTO, 201);
    }

    #[Route('/{id}', name: 'api_projects_edit', methods: ['PUT'])]
    public function edit(int $id, Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator, ProjectRepository $projectRepository): JsonResponse
    {
        $project = $projectRepository->findOneBy(['id' => $id]);
        if ($project == null) {
            return new JsonResponse(status: 404);
        }

        $data = $serializer->deserialize($request->getContent(), EditProjectDTO::class, 'json');
        $errors = $validator->validate($data);

        if (count($errors) > 0) {
            $violations = [];
            foreach ($errors as $error) {
                $violations[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json(['errors' => $violations], 400);
        }

        if ($id !== $data->id) {
            return new JsonResponse(status: 400);
        }

        $project->setName($data->name)
            ->setDescription($data->description);

        $em->flush();

        $projectDTO = new ProjectDTO($project->getId(), $project->getName(), $project->getDescription());

        return $this->json($projectDTO, 200);
    }

    #[Route('/{id}', name: 'api_projects_delete', methods: ['DELETE'])]
    public function delete(int $id, ProjectRepository $projectRepository, EntityManagerInterface $em): JsonResponse
    {
        $project = $projectRepository->findOneBy(['id' => $id]);
        if ($project == null) {
            return new JsonResponse(status: 404);
        }

        $em->remove($project);
        $em->flush();

        return new JsonResponse(status: 200);
    }
}
