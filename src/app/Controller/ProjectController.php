<?php
namespace App\Controller;

use App\Database;
use App\Validator;
use App\View;
use App\Response;

class ProjectController {
    public function index(): Response {
        $db = Database::getDb();
        $stmt = $db->query('SELECT * FROM projects');
        $projects = $stmt->fetchAll();
        return new Response(200, new View('project/index.php', ['projects' => $projects]));
    }

    public function store(): Response {
        $method = $_SERVER['REQUEST_METHOD'];
        if($method === 'POST') {
            $name = $_POST['name'];
            $description = $_POST['description'];

            $validator = new Validator();
            $validator->validate($name, 'name', [Validator::required(), Validator::minLength(3), Validator::maxLength(100)]);
            $validator->validate($description, 'description', [Validator::required(), Validator::maxLength(1000)]);
            
            if(!$validator->isValid()) {
                return new Response(400,new View('project/store.php', [
                    'errors' => $validator->getErrors(),
                    'form' => [
                        'name' => $name,
                        'description' => $description
                    ]
                ]));
            }

            $db = Database::getDb();
            $prep = $db->prepare('INSERT INTO projects(name, description) Values(?,?)');
            $prep->execute([$name, $description]);

            header('Location: /');
            return new Response(304, null, ['Location: ' => '/']);
        }
        return new Response(200, new View('project/store.php'));
    }
}