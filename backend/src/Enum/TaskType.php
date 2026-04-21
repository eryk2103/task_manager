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
}
