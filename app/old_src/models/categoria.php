<?php

namespace Src\Models;

require_once dirname(dirname(__DIR__)) . '/config/Database.php';
use Database;
use PDO;

class Category {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Obtiene todas las categorías activas
     */
    public function getAll() {
        $sql = "SELECT id, name, description, slug, status FROM categories WHERE status = 'active' ORDER BY name ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Crea una nueva categoría
     */
    public function create($data) {
        $sql = "INSERT INTO categories (name, description, slug) VALUES (:name, :description, :slug)";
        $stmt = $this->db->prepare($sql);
        
        // El slug es el nombre en minúsculas y con guiones para las URLs limpias
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name'])));

        $stmt->execute([
            ':name'        => $data['name'],
            ':description' => $data['description'] ?? null,
            ':slug'        => $slug
        ]);

        return (int)$this->db->lastInsertId();
    }
}