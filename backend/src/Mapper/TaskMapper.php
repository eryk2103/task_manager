<?php

namespace App\Mapper;

use App\DTO\TaskDTO;
use App\Entity\Task;

class TaskMapper
{
    public function mapToDTO(Task $task): TaskDTO
    {
        return new TaskDTO(
            $task->getId(),
            $task->getName(),
            $task->getStatus(),
            $task->getProject()->getId(),
            $task->getType(),
            $task->getPriority()
        );
    }
}
