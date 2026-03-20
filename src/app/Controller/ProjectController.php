<?php
namespace App\Controller;

use App\Validator;
use App\View;
use App\Response;

use App\Model\Project;
use App\Service\ProjectService;
use App\Service\ProjectServiceInterface;
use App\Repository\ProjectRepository;

class ProjectController {
    private ProjectServiceInterface $projectService;

    public function __construct() {
        $this->projectService = new ProjectService(new ProjectRepository());
    }

    public function index(): Response {
        $projects = $this->projectService->getAll();
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
                return new Response(400, new View('project/store.php', [
                    'errors' => $validator->getErrors(),
                    'form' => [
                        'name' => $name,
                        'description' => $description
                    ]
                ]));
            }
            $project = new Project(0, $name, $description);
            $this->projectService->create($project);

            return new Response(303, null, ['Location: ' => '/']);
        }
        return new Response(200, new View('project/store.php'));
    }
}