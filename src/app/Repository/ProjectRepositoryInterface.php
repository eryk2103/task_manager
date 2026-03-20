<?php 
namespace App\Repository;

use App\Model\Project;

interface ProjectRepositoryInterface {
    public function findAll(): array;
    public function save(Project $project): void;
}