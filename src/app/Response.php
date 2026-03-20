<?php
namespace App;

use App\View;

class Response {
    private array $statusCodes = [
        200 => '200 Ok', 405 => '405 Method Not Allowed', 404 => '404 Page Not Found', 
        303 => '303 See Other', 400 => '400 Bad Request'
    ];
    
    public function __construct(
        private int $code = 200,
        private ?View $view = null,
        private array $headers = []
    ) {}

    public function send() {
        if(!key_exists($this->code, $this->statusCodes)) {
            throw new \Exception('status code is not supported: ' . $this->code);
        }

        header('http/1.1 ' . $this->statusCodes[$this->code]);
        
        foreach($this->headers as $key => $value) {
            header($key . ' ' . $value);
        }

        if($this->view !== null) {
            $this->view->render();
        }
    }
}