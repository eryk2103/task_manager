<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        #[Assert\Length(
            min: 3,
            max: 255,
            minMessage: 'Email must be at least {{ limit }} characters long',
            maxMessage: 'Email cannot be longer than {{ limit }} characters'
        )]
        public readonly ?string $email = null,

        #[Assert\NotBlank]
        #[Assert\Length(
            min: 8,
            max: 255,
            minMessage: 'Password must be at least {{ limit }} characters long',
            maxMessage: 'Passsword cannot be longer than {{ limit }} characters'
        )]
        public readonly ?string $password = null
    ) {}
}
