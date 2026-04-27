<?php

namespace App\DTO;

use App\Enum\TaskPriority;
use App\Enum\TaskStatus;
use Symfony\Component\Validator\Constraints as Assert;

class TaskQueryDTO
{
    public function __construct(
        #[Assert\NotNull]
        public int $project,

        #[Assert\Choice(callback: [TaskStatus::class, 'cases'])]
        public TaskStatus $status,

        #[Assert\Positive]
        public int $page = 1,

        #[Assert\Choice(options: [10, 20, 50, 100])]
        public int $limit = 20,
    ){}
}
