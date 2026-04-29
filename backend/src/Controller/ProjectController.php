<?php

namespace App\Controller;

use App\DTO\CreateProjectDTO;
use App\DTO\EditProjectDTO;
use App\DTO\PaginatedResultDTO;
use App\DTO\PaginationDTO;
use App\DTO\ProjectQueryDTO;
use App\Mapper\ProjectMapper;
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
    public function __construct(private readonly ProjectService $projectService, private readonly ProjectMapper $projectMapper) {}
    #[Route('', name: 'api_projects_index', methods: ['GET'])]
    public function index(#[CurrentUser] $user, #[MapQueryString] ProjectQueryDTO $query): JsonResponse
    {
        $result = $this->projectService->getAll($user, $query->search, $query->page, $query->limit);

        $projects = array_map(fn($project) => $this->projectMapper->mapToDTO($project), $result['data']);
        $pagination = new PaginationDTO($query->page, $query->limit, $result['total'], $result['pages']);

        $paginatedResult = new PaginatedResultDTO($projects, $pagination);
        return $this->json($paginatedResult, 200);
    }

    #[Route('/{id}', name: 'api_projects_detail', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function detail(int $id, #[CurrentUser] $user): JsonResponse
    {
        $project = $this->projectService->getById($user, $id);
        return $this->json($this->projectMapper->mapToDTO($project), 200);
    }

    #[Route('', name: 'api_projects_create', methods: ['POST'])]
    public function create(#[CurrentUser] $user, #[MapRequestPayload] CreateProjectDTO $createProjectDTO): JsonResponse
    {
        $newProject = $this->projectService->create($user, $createProjectDTO);
        return $this->json($this->projectMapper->mapToDTO($newProject), 201);
    }

    #[Route('/{id}', name: 'api_projects_edit', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function edit(int $id, #[CurrentUser] $user, #[MapRequestPayload] EditProjectDTO $editProjectDTO): JsonResponse
    {
        $project = $this->projectService->update($user, $editProjectDTO, $id);
        return $this->json($this->projectMapper->mapToDTO($project), 200);
    }

    #[Route('/{id}', name: 'api_projects_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id, #[CurrentUser] $user): JsonResponse
    {
        $this->projectService->delete($user, $id);
        return $this->json(null, 204);
    }
}
