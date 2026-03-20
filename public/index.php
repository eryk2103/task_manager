<?php
spl_autoload_register(function($className) {
    $className = __DIR__ . '/../src/' . lcfirst(str_replace('\\', '/', $className)) . '.php';
    require $className;
});

use App\Core\Router;
use App\Controller\ProjectController;

$router = new Router();

$router->register('/', ['get'], ProjectController::class, 'index')
    ->register('/new', ['get', 'post'], ProjectController::class, 'store');

$res = $router->resolve($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);

$res->send();