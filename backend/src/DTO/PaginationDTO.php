<?php

namespace App\DTO;

class PaginationDTO {
    public function __construct(
        public readonly int $page,
        public readonly int $limit,
        public readonly int $total,
        public readonly int $pages
    ) {}
}
