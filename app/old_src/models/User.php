<?php

require_once dirname(__DIR__) . '/config/Database.php';

class User {
    private $db;

    public function __construct() {
        // Obtenemos la conexión única mediante PDO
        $this->db = Database::getConnection();
    }

    /**
     * Busca un usuario por su correo electrónico (Indispensable para el Inicio de Sesión)
     */
    public function findByEmail($email) {
        $sql = "SELECT id, name, email, password, role, status FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        
        return $user ? $user : null;
    }

    /**
     * Registra un nuevo usuario en el sistema aplicando hashing seguro a la contraseña
     */
    public function create($data) {
        $sql = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
        $stmt = $this->db->prepare($sql);
        
        // Cifrado robusto nativo de PHP usando BCRYPT (Cumple con el RNF-05)
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt->execute([
            ':name'     => $data['name'],
            ':email'    => $data['email'],
            ':password' => $hashedPassword,
            ':role'     => $data['role'] ?? 'cliente'
        ]);

        return (int)$this->db->lastInsertId();
    }

    /**
     * Busca un usuario por su ID para validar sesiones activas
     */
    public function findById($id) {
        $sql = "SELECT id, name, email, role, status FROM users WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();

        return $user ? $user : null;
    }
}