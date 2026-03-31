<?php

namespace App\DTO;

use App\Enum\TaskStatus;

class TaskDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly TaskStatus $status,
        public readonly int $projectId,
    ) {}
}
