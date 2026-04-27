<?php

namespace App\DTO;

class PaginatedResultDTO {
    public function __construct(
        public readonly array $data,
        public readonly PaginationDTO $meta
    ) {}
}
