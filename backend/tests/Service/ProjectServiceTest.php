<?php

namespace App\Tests\Service;

use App\DTO\CreateProjectDTO;
use App\DTO\EditProjectDTO;
use App\Entity\Project;
use App\Entity\User;
use App\Exception\ProjectNotFoundException;
use App\Repository\ProjectRepository;
use App\Service\ProjectService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class ProjectServiceTest extends TestCase
{
    private ProjectRepository $projectRepository;
    private EntityManagerInterface $em;
    private ProjectService $service;

    protected function setUp(): void
    {
        $this->projectRepository = $this->createMock(ProjectRepository::class);
        $this->em = $this->createMock(EntityManagerInterface::class);

        $this->service = new ProjectService(
            $this->projectRepository,
            $this->em
        );
    }

    public function testGetAllReturnsEmptyWhenInvalidPagination(): void
    {
        $user = new User();

        $result = $this->service->getAll($user, '', 0, 0);

        $this->assertEquals([
            'data' => [],
            'total' => 0,
            'pages' => 0
        ], $result);
    }

    public function testGetAllReturnsPaginatedData(): void
    {
        $user = new User();

        $this->projectRepository
            ->expects($this->once())
            ->method('searchByName')
            ->with('', $user, 1, 20)
            ->willReturn([
                'data' => ['p1', 'p2'],
                'total' => 40
            ]);

        $result = $this->service->getAll($user, '', 1, 20);

        $this->assertCount(2, $result['data']);
        $this->assertEquals(40, $result['total']);
        $this->assertEquals(2, $result['pages']);
    }

    public function testGetByIdReturnsProject(): void
    {
        $user = new User();
        $project = new Project();

        $this->projectRepository
            ->method('findOneBy')
            ->willReturn($project);

        $result = $this->service->getById($user, 1);

        $this->assertSame($project, $result);
    }

    public function testGetByIdThrowsWhenNotFound(): void
    {
        $this->expectException(ProjectNotFoundException::class);

        $user = new User();

        $this->projectRepository
            ->method('findOneBy')
            ->willReturn(null);

        $this->service->getById($user, 1);
    }

    public function testCreatePersistsProject(): void
    {
        $user = new User();

        $dto = new CreateProjectDTO(
            'Project name',
            'Description'
        );

        $this->em
            ->expects($this->once())
            ->method('persist')
            ->with($this->isInstanceOf(Project::class));

        $this->em
            ->expects($this->once())
            ->method('flush');

        $project = $this->service->create($user, $dto);

        $this->assertInstanceOf(Project::class, $project);
        $this->assertEquals('Project name', $project->getName());
        $this->assertEquals('Description', $project->getDescription());
        $this->assertSame($user, $project->getOwner());
    }

    public function testUpdateModifiesProject(): void
    {
        $user = new User();
        $project = new Project();

        $dto = new EditProjectDTO(
            'Updated name',
            'Updated description'
        );

        $this->projectRepository
            ->method('findOneBy')
            ->willReturn($project);

        $this->em
            ->expects($this->once())
            ->method('flush');

        $result = $this->service->update($user, $dto, 1);

        $this->assertEquals('Updated name', $result->getName());
        $this->assertEquals('Updated description', $result->getDescription());
    }

    public function testUpdateThrowsWhenNotFound(): void
    {
        $this->expectException(ProjectNotFoundException::class);

        $user = new User();

        $this->projectRepository
            ->method('findOneBy')
            ->willReturn(null);

        $dto = new EditProjectDTO('name', 'desc');

        $this->service->update($user, $dto, 1);
    }

    public function testDeleteRemovesProject(): void
    {
        $user = new User();
        $project = new Project();

        $this->projectRepository
            ->method('findOneBy')
            ->willReturn($project);

        $this->em
            ->expects($this->once())
            ->method('remove')
            ->with($project);

        $this->em
            ->expects($this->once())
            ->method('flush');

        $this->service->delete($user, 1);
    }

    public function testDeleteThrowsWhenNotFound(): void
    {
        $this->expectException(ProjectNotFoundException::class);

        $user = new User();

        $this->projectRepository
            ->method('findOneBy')
            ->willReturn(null);

        $this->service->delete($user, 1);
    }
}
