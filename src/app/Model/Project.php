<?php
namespace App\Model;

class Project {
    public function __construct(
        private int $id,
        private string $name,
        private string $description
    ) {}

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $value): self {
        $this->id = $value;
        return $this;
    }

    public function getName(): string {
        return $this->name;
    }

    public function setName(string $value): self {
        $this->name = $value;
        return $this;
    }

    public function getDescription(): string {
        return $this->description;
    }

    public function setDescription(string $value): self {
        $this->description = $value;
        return $this;
    }
}