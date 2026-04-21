<?php

namespace App\EventListener;

use App\Exception\ProjectNotFoundException;
use App\Exception\TaskNotFoundException;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::EXCEPTION)]
class ExceptionListener
{
    public function __invoke(ExceptionEvent $event): void
    {
        $e = $event->getThrowable();

        $response = null;

        if ($e instanceof ProjectNotFoundException) {
            $response = new JsonResponse(['error' => 'User already exists'], 404);
        }
        else if ($e instanceof TaskNotFoundException) {
            $response = new JsonResponse(['error' => 'Task not found'], 404);
        }

        if($response !== null) {
            $event->setResponse($response);
        }
    }
}
