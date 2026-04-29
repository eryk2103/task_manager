<?php

namespace App\Tests\Service;

use App\DTO\CreateTaskDTO;
use App\DTO\EditTaskDTO;
use App\Entity\Task;
use App\Entity\User;
use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use App\Enum\TaskType;
use App\Exception\TaskNotFoundException;
use App\Repository\ProjectRepository;
use App\Repository\TaskRepository;
use App\Service\TaskService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class TaskServiceTest extends TestCase
{
    private TaskRepository $taskRepository;
    private ProjectRepository $projectRepository;
    private EntityManagerInterface $em;

    private TaskService $service;

    protected function setUp(): void
    {
        $this->taskRepository = $this->createMock(TaskRepository::class);
        $this->projectRepository = $this->createMock(ProjectRepository::class);
        $this->em = $this->createMock(EntityManagerInterface::class);

        $this->service = new TaskService(
            $this->taskRepository,
            $this->em,
            $this->projectRepository
        );
    }


    public function testGetAllReturnsEmptyWhenInvalidPagination(): void
    {
        $user = new User();

        $result = $this->service->getAll($user, 1, TaskStatus::TODO, 0, 0);

        $this->assertEquals(['data' => [], 'total' => 0, 'pages' => 0], $result);
    }

    public function testGetAllReturnsPaginatedData(): void
    {
        $user = new User();

        $this->taskRepository
            ->expects($this->once())
            ->method('findByOwnerAndProject')
            ->willReturn([
                'data' => ['task1', 'task2'],
                'total' => 40
            ]);

        $result = $this->service->getAll($user, 1, TaskStatus::TODO, 1, 20);

        $this->assertCount(2, $result['data']);
        $this->assertEquals(40, $result['total']);
        $this->assertEquals(2, $result['pages']);
    }

    public function testGetByIdReturnsTask(): void
    {
        $user = new User();
        $task = new Task();

        $this->taskRepository
            ->method('findOneByOwner')
            ->willReturn($task);

        $result = $this->service->getById($user, 1);

        $this->assertSame($task, $result);
    }

    public function testGetByIdThrowsExceptionWhenNotFound(): void
    {
        $this->expectException(TaskNotFoundException::class);

        $user = new User();

        $this->taskRepository
            ->method('findOneByOwner')
            ->willReturn(null);

        $this->service->getById($user, 1);
    }

    public function testCreatePersistsTask(): void
    {
        $user = new User();
        $project = $this->createMock(\App\Entity\Project::class);

        $dto = new CreateTaskDTO(
            'Task name',
            1,
            TaskType::BUG,
            TaskStatus::DONE,
            TaskPriority::HIGH,
        );

        $this->projectRepository
            ->method('findOneBy')
            ->willReturn($project);

        $this->em
            ->expects($this->once())
            ->method('persist')
            ->with($this->isInstanceOf(Task::class));

        $this->em
            ->expects($this->once())
            ->method('flush');

        $task = $this->service->create($user, $dto);

        $this->assertEquals('Task name', $task->getName());
    }

    public function testUpdateModifiesTask(): void
    {
        $user = new User();
        $task = new Task();

        $dto = new EditTaskDTO(
            'Updated',
            TaskStatus::IN_PROGRESS,
            TaskType::BUG,
            TaskPriority::HIGH,
        );

        $this->taskRepository
            ->method('findOneByOwner')
            ->willReturn($task);

        $this->em
            ->expects($this->once())
            ->method('flush');

        $result = $this->service->update($user, $dto, 1);

        $this->assertEquals('Updated', $result->getName());
        $this->assertEquals(TaskStatus::IN_PROGRESS, $result->getStatus());
        $this->assertEquals(TaskType::BUG, $result->getType());
        $this->assertEquals(TaskPriority::HIGH, $result->getPriority());
    }

    public function testUpdateThrowsWhenNotFound(): void
    {
        $this->expectException(TaskNotFoundException::class);

        $user = new User();

        $this->taskRepository
            ->method('findOneByOwner')
            ->willReturn(null);

        $dto = new EditTaskDTO('name', TaskStatus::DONE, TaskType::FEATURE, TaskPriority::HIGH);

        $this->service->update($user, $dto, 1);
    }

    public function testDeleteRemovesTask(): void
    {
        $user = new User();
        $task = new Task();

        $this->taskRepository
            ->method('findOneByOwner')
            ->willReturn($task);

        $this->em
            ->expects($this->once())
            ->method('remove')
            ->with($task);

        $this->em
            ->expects($this->once())
            ->method('flush');

        $this->service->delete($user, 1);
    }

    public function testDeleteThrowsWhenNotFound(): void
    {
        $this->expectException(TaskNotFoundException::class);

        $user = new User();

        $this->taskRepository
            ->method('findOneByOwner')
            ->willReturn(null);

        $this->service->delete($user, 1);
    }
}
