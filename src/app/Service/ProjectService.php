<?php
namespace App\Service;

use App\Service\ProjectServiceInterface;
use App\Repository\ProjectRepositoryInterface;
use App\Model\Project;

class ProjectService implements ProjectServiceInterface {
    public function __construct(private ProjectRepositoryInterface $projectRepository) {}

    public function getAll(): array {
        return $this->projectRepository->findAll();
    }

    public function create(Project $project) {
        $this->projectRepository->save($project);
    }

}