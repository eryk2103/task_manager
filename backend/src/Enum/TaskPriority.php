<?php

namespace App\Enum;

enum TaskPriority: string
{
    case LOW = 'LOW';
    case MID = 'MID';
    case HIGH = 'HIGH';
    case CRITICAL = 'CRITICAL';

    public static function getChoices(): array
    {
        return array_column(self::cases(), 'name');
    }
}
