<?php
spl_autoload_register(function($className) {
    $className = __DIR__ . '/../src/' . lcfirst(str_replace('\\', '/', $className)) . '.php';
    require $className;
});

use App\Router;
use App\Controller\ProjectController;

$requestUri = $_SERVER['REQUEST_URI'];
$router = new Router();

$router->register([
    ['/', ProjectController::class, 'index'],
    ['/new', ProjectController::class, 'store']
]);

$router->resolve($requestUri);

