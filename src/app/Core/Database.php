<?php
namespace App\Core;

class Database {
    private static ?\PDO $db = null;

    private function __construct() {}

    public static function getDb(): \PDO {
        if(self::$db === null) {
            self::$db = new \PDO(
                'pgsql:host=db;
                port=5432;
                dbname=task_manager;
                user=postgres;
                password=root'
            );
        }
        return self::$db;
    } 
}