<?php

namespace App\Service;

use App\DTO\CreateProjectDTO;
use App\DTO\EditProjectDTO;
use App\DTO\ProjectDTO;
use App\Entity\Project;
use App\Entity\User;
use App\Exception\ProjectNotFoundException;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;

class ProjectService {

    public function __construct(private ProjectRepository $projectRepository, private EntityManagerInterface $entityManager) {}

    public function getAll(User $user, string $search = ''): array {
        return array_map(fn($item) => $this->mapToProjectDTO($item), $this->projectRepository->searchByName($search, $user));
    }

    public function getById(User $user, int $id): ProjectDTO|null {
        return $this->mapToProjectDTO($this->projectRepository->findOneBy(['id' => $id, 'owner' => $user]));
    }

    public function create(User $user, CreateProjectDTO $createProjectDTO): ProjectDto {
        $project = new Project();
        $project->setName($createProjectDTO->name)
            ->setOwner($user)
            ->setDescription($createProjectDTO->description);

        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $this->mapToProjectDTO($project);
    }

    public function update(User $user, EditProjectDTO $editProjectDTO, int $id): ProjectDTO {
        $project = $this->projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if ($project === null) {
            throw new ProjectNotFoundException();
        }

        $project->setName($editProjectDTO->name)
            ->setDescription($editProjectDTO->description);

        $this->entityManager->flush();
        return $this->mapToProjectDTO($project);
    }

    public function delete(User $user, int $id): void {
        $project = $this->projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if ($project === null) {
            throw new ProjectNotFoundException();
        }

        $this->entityManager->remove($project);
        $this->entityManager->flush();
    }

    private function mapToProjectDTO(project $project): ProjectDTO
    {
        return new ProjectDTO(
            $project->getId(),
            $project->getName(),
            $project->getDescription()
        );
    }
}
