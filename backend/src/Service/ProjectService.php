<?php

namespace App\Service;

use App\DTO\CreateProjectDTO;
use App\DTO\EditProjectDTO;
use App\Entity\Project;
use App\Entity\User;
use App\Exception\ProjectNotFoundException;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;

class ProjectService {

    public function __construct(private ProjectRepository $projectRepository, private EntityManagerInterface $entityManager) {}

    public function getAll(User $user, string $search = '', int $page = 1, int $limit = 20): array {
        if($limit < 1 || $page < 1) {
            return ['data' => [], 'total' => 0];
        }

        $result = $this->projectRepository->searchByName($search, $user, $page, $limit);
        $pages = ceil($result['total'] / $limit);

        return ['data' => $result['data'], 'total' => $result['total'], 'pages' => $pages];
    }

    public function getById(User $user, int $id): Project {
        $project = $this->projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if($project === null) {
            throw new ProjectNotFoundException();
        }
        return $project;
    }

    public function create(User $user, CreateProjectDTO $createProjectDTO): Project {
        $project = new Project();
        $project->setName($createProjectDTO->name)
            ->setOwner($user)
            ->setDescription($createProjectDTO->description);

        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $project;
    }

    public function update(User $user, EditProjectDTO $editProjectDTO, int $id): Project {
        $project = $this->projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if ($project === null) {
            throw new ProjectNotFoundException();
        }

        $project->setName($editProjectDTO->name)
            ->setDescription($editProjectDTO->description);

        $this->entityManager->flush();
        return $project;
    }

    public function delete(User $user, int $id): void {
        $project = $this->projectRepository->findOneBy(['id' => $id, 'owner' => $user]);
        if ($project === null) {
            throw new ProjectNotFoundException();
        }

        $this->entityManager->remove($project);
        $this->entityManager->flush();
    }
}
