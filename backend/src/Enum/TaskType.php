<?php

namespace App\Enum;

enum TaskType: string
{
    case FEATURE = 'FEATURE';
    case BUG = 'BUG';
    case IMPROVE = 'IMPROVE';
    case REFACTOR = 'REFACTOR';
    case MAINTENANCE = 'MAINTENANCE';
    case OTHER = 'OTHER';

    public static function getChoices(): array
    {
        return array_column(TaskType::cases(), 'name');
    }
}
