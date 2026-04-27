<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;
class ProjectQueryDTO
{
    public function __construct(
        #[Assert\Length(max: 100)]
        public string $search = '',

        #[Assert\Positive]
        public int $page = 1,

        #[Assert\Choice(options: [10, 20, 50, 100])]
        public int $limit = 20,
    ){}
}
