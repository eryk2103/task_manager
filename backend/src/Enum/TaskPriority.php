<?php

namespace App\Enum;

enum TaskPriority: string
{
    case LOW = 'LOW';
    case MID = 'MID';
    case HIGH = 'HIGH';
    case CRITICAL = 'CRITICAL';
}
