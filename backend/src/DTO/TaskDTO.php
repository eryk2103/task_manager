<?php

namespace App\DTO;

use App\Enum\TaskStatus;
use App\Enum\TaskType;

class TaskDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly TaskStatus $status,
        public readonly int $projectId,
        public readonly TaskType $type
    ) {}
}
