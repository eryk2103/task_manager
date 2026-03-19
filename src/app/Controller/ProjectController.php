<?php
namespace App\Controller;

use App\Database;

class ProjectController {
    public function index(): void {
        $db = Database::getDb();
        $stmt = $db->query('SELECT * FROM projects');
        $projects = $stmt->fetchAll();
        $this->render('project/index.php', ['projects' => $projects]);
    }

    private function render(string $view, array $props = []): void {
        require __DIR__ . '/../View/header.php';  
        require __DIR__ . '/../View/' . $view;  
        require __DIR__ . '/../View/footer.php';  
    }
}