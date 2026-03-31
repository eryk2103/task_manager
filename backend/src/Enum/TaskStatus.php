<?php

namespace App\Enum;

enum TaskStatus: string
{
    case IDEA = 'IDEA';
    case TODO = 'TODO';
    case IN_PROGRESS = 'IN_PROGRESS';
    case DONE = 'DONE';

    public static function getChoices(): array
    {
        return array_column(TaskStatus::cases(), 'name');
    }
}
