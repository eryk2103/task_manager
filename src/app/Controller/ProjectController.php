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

    public function store(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        if($method === 'POST') {
            $db = Database::getDb();
            $name = $_POST['name'];
            $description = $_POST['description'];
            $prep = $db->prepare('INSERT INTO projects(name, description) Values(?,?)');
            $prep->execute([$name, $description]);
            header('Location: /');
            return;
        }
        $this->render('project/store.php');
    }

    private function render(string $view, array $props = []): void {
        require __DIR__ . '/../View/header.php';  
        require __DIR__ . '/../View/' . $view;  
        require __DIR__ . '/../View/footer.php';  
    }
}