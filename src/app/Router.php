<?php

namespace App;  

class Router {
    private array $routes;

    public function __construct() {
        $this->routes = [];
    }

    public function register(array $routes): void {
        $this->routes = $routes;
    }

    public function resolve($uri): void {
        foreach($this->routes as $route) {
            if($route[0] === $uri) {
                call_user_func([new $route[1], $route[2]]);
                return;
            }
        }
        echo 'route not found';
    }
}