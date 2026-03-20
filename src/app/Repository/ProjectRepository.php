<?php
namespace App\Repository;

use App\Core\Database;

use App\Model\Project;
use App\Repository\ProjectRepositoryInterface;

class ProjectRepository implements ProjectRepositoryInterface {
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getDb();
    }

    public function findAll(): array {
        $stmt = $this->db->query('SELECT * FROM projects');
        return $stmt->fetchAll();
    }

    public function save(Project $project): void {
        $prep = $this->db->prepare('INSERT INTO projects(name, description) Values(?,?)');
        $prep->execute([$project->getName(), $project->getDescription()]);
    }
}