<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class EditProjectDTO
{
    public function __construct(
        #[Assert\NotNull(message: 'Id cannot be null')]
        public readonly ?int $id = null,

        #[Assert\NotBlank]
        #[Assert\Length(
            min: 3,
            max: 255,
            minMessage: 'Name must be at least {{ limit }} characters long',
            maxMessage: 'Name cannot be longer than {{ limit }} characters'
        )]
        public readonly ?string $name = null,

        #[Assert\NotNull(message: 'Description cannot be null')]
        #[Assert\Length(
            max: 1000,
            maxMessage: 'Description cannot be longer than {{ limit }} characters'
        )]
        public readonly ?string $description = null
    ) {}
}
