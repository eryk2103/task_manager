<?php
namespace App;  

use App\Response;

class Router {
    private array $routes = [];

    public function __construct() {}

    public function register(string $uri, array $methods, string $controller, string $action): self {
        $handler = [new $controller, $action];
        $methods = array_map(fn($item) => strtoupper($item), $methods);

        $this->routes[] = ['uri' => $uri, 'methods' => $methods, 'handler' => $handler];
        return $this;
    }

    public function resolve(string $uri, string $method): Response {
        $method = strtoupper($method);
        $uri = explode('?', $uri)[0];

        foreach($this->routes as $route) {
            if($route['uri'] === $uri) {
                if(in_array($method, $route['methods'])) {
                    return call_user_func($route['handler']);
                    
                }
                else {
                    $allowed = implode(' ', $route['methods']);
                    return new Response(405, null, ['Allow: ' => $allowed]);
                }
            }
        }
        return new Response(404);
    }
}