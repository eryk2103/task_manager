<?php

namespace App\DTO;

use App\Enum\TaskStatus;
use App\Enum\TaskType;
use App\Enum\TaskPriority;

use Symfony\Component\Validator\Constraints as Assert;

class EditTaskDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(
            min: 3,
            max: 255,
            minMessage: 'Name must be at least {{ limit }} characters long',
            maxMessage: 'Name cannot be longer than {{ limit }} characters'
        )]
        public readonly ?string $name = null,

        #[Assert\NotBlank]
        #[Assert\Choice(callback: [TaskStatus::class, 'getChoices'])]
        public readonly ?string $status = null,

        #[Assert\NotBlank]
        #[Assert\Choice(callback: [TaskType::class, 'getChoices'])]
        public readonly ?string $type = null,

        #[Assert\NotBlank]
        #[Assert\Choice(callback: [TaskPriority::class, 'getChoices'])]
        public readonly ?string $priority = null
    ) {}
}
