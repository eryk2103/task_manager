<?php
namespace App\Service;

use App\Model\Project;

interface ProjectServiceInterface {
    public function getAll(): array;
    public function create(Project $project);
}