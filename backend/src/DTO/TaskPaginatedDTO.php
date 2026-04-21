<?php

namespace App\DTO;

class TaskPaginatedDTO {
    public function __construct(
        public readonly array $data,
        public readonly PaginationDTO $meta
    ) {}
}
