<?php
namespace App\Core;

class View {
    public function __construct(private string $path, private array $variables = []) {}

    public function render(): void {
        $templatePath = __DIR__ . '/../View/' . $this->path;

        if(!file_exists($templatePath)) {
            throw new \Exception('template file not found');
        }
        
        $props = $this->variables;
        require __DIR__ . '/../View/header.php';  
        require $templatePath;
        require __DIR__ . '/../View/footer.php';  
    }
}