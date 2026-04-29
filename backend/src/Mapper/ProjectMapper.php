<?php

namespace App\Mapper;

use App\DTO\ProjectDTO;
use App\Entity\Project;

class ProjectMapper
{
    public function mapToDTO(project $project): ProjectDTO
    {
        return new ProjectDTO(
            $project->getId(),
            $project->getName(),
            $project->getDescription()
        );
    }
}
