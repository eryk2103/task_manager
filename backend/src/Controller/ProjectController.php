<?php

namespace App\Controller;

use App\DTO\CreateProjectDTO;
use App\DTO\EditProjectDTO;
use App\DTO\ProjectQueryDTO;
use App\Service\ProjectService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/projects')]
class ProjectController extends AbstractController
{
    public function __construct(private readonly ProjectService $projectService) {}
    #[Route('', name: 'api_projects_index', methods: ['GET'])]
    public function index(#[CurrentUser] $user, #[MapQueryString] ProjectQueryDTO $query): JsonResponse
    {
        $projects = $this->projectService->getAll($user, $query->search, $query->page, $query->limit);
        return $this->json($projects, 200);
    }

    #[Route('/{id}', name: 'api_projects_detail', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function detail(int $id, #[CurrentUser] $user): JsonResponse
    {
        $project = $this->projectService->getById($user, $id);
        if ($project == null) {
            return $this->json(['error' => 'Project not found'], 404);
        }
        return $this->json($project, 200);
    }

    #[Route('', name: 'api_projects_create', methods: ['POST'])]
    public function create(#[CurrentUser] $user, #[MapRequestPayload] CreateProjectDTO $createProjectDTO): JsonResponse
    {
        $newProject = $this->projectService->create($user, $createProjectDTO);
        return $this->json($newProject, 201);
    }

    #[Route('/{id}', name: 'api_projects_edit', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function edit(int $id, #[CurrentUser] $user, #[MapRequestPayload] EditProjectDTO $editProjectDTO): JsonResponse
    {
        $project = $this->projectService->update($user, $editProjectDTO, $id);
        return $this->json($project, 200);
    }

    #[Route('/{id}', name: 'api_projects_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] $user): JsonResponse
    {
        $this->projectService->delete($user, $id);
        return $this->json(null, 204);
    }
}
