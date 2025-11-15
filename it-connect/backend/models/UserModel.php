<?php
// 2.5.12 Modelo de Usuario - Estructuras de control y funciones en PHP
// Archivo: backend/models/UserModel.php

require_once __DIR__ . '/../config/Database.php';

class UserModel {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    /**
     * 2.5.9 Registrar un nuevo usuario
     * Utiliza estructuras de control (if, else) para validación
     */
    public function register($nombre, $email, $password, $especialidad) {
        // 2.5.12 Validaciones con estructuras de control
        if (empty($nombre) || empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'Campos requeridos'];
        }
        
        // Validar formato de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Email inválido'];
        }
        
        // Validar que no existe el email
        $existingUser = $this->getUserByEmail($email);
        if ($existingUser) {
            return ['success' => false, 'message' => 'El email ya está registrado'];
        }
        
        // Encriptar contraseña
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Insertar usuario
        try {
            $sql = "INSERT INTO usuarios (nombre, email, password, especialidad) 
                    VALUES (:nombre, :email, :password, :especialidad)";
            
            $id = $this->db->insert($sql, [
                ':nombre' => $nombre,
                ':email' => $email,
                ':password' => $hashedPassword,
                ':especialidad' => $especialidad
            ]);
            
            return ['success' => true, 'message' => 'Usuario registrado', 'id' => $id];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    /**
     * 2.5.9 Login - Validar credenciales
     */
    public function login($email, $password) {
        // Validar que el email existe
        $user = $this->getUserByEmail($email);
        
        if (!$user) {
            return ['success' => false, 'message' => 'Usuario no encontrado'];
        }
        
        // Validar contraseña
        if (!password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => 'Contraseña incorrecta'];
        }
        
        // Login exitoso
        return ['success' => true, 'message' => 'Login exitoso', 'user' => $user];
    }
    
    /**
     * Obtener usuario por email
     */
    public function getUserByEmail($email) {
        $sql = "SELECT * FROM usuarios WHERE email = :email LIMIT 1";
        return $this->db->fetchOne($sql, [':email' => $email]);
    }
    
    /**
     * Obtener usuario por ID
     */
    public function getUserById($id) {
        $sql = "SELECT * FROM usuarios WHERE id = :id LIMIT 1";
        return $this->db->fetchOne($sql, [':id' => $id]);
    }
    
    /**
     * 2.5.10 Obtener todos los contactos de un usuario
     * Utiliza JOIN para relaciones entre tablas
     */
    public function getContacts($userId) {
        $sql = "SELECT u.* FROM usuarios u
                INNER JOIN contactos c ON u.id = c.contacto_id
                WHERE c.usuario_id = :usuario_id AND c.estado = 'activo'
                ORDER BY c.fecha_conexion DESC";
        
        return $this->db->fetchAll($sql, [':usuario_id' => $userId]);
    }
    
    /**
     * Buscar usuarios por especialidad
     * 2.5.12 Búsqueda con estructuras de control
     */
    public function searchBySpecialty($specialty) {
        if (empty($specialty)) {
            return [];
        }
        
        $sql = "SELECT * FROM usuarios 
                WHERE especialidad = :specialty AND estado = 'activo'
                ORDER BY nombre ASC";
        
        return $this->db->fetchAll($sql, [':specialty' => $specialty]);
    }
    
    /**
     * Buscar usuarios por nombre o GitHub username
     * 2.5.12 Búsqueda con LIKE (SQL seguro con prepared statements)
     */
    public function search($query) {
        if (empty($query)) {
            return [];
        }
        
        $searchTerm = '%' . $query . '%';
        $sql = "SELECT * FROM usuarios 
                WHERE (nombre LIKE :query OR github_username LIKE :query) 
                AND estado = 'activo'
                ORDER BY nombre ASC";
        
        return $this->db->fetchAll($sql, [':query' => $searchTerm]);
    }
    
    /**
     * Actualizar perfil de usuario
     */
    public function updateProfile($userId, $data) {
        try {
            $sql = "UPDATE usuarios SET 
                    nombre = :nombre,
                    github_username = :github,
                    ubicacion = :ubicacion,
                    bio = :bio
                    WHERE id = :id";
            
            $this->db->query($sql, [
                ':nombre' => $data['nombre'],
                ':github' => $data['github_username'] ?? null,
                ':ubicacion' => $data['ubicacion'] ?? null,
                ':bio' => $data['bio'] ?? null,
                ':id' => $userId
            ]);
            
            return ['success' => true, 'message' => 'Perfil actualizado'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    /**
     * Obtener todos los usuarios (para listado)
     * 2.5.12 Uso de estructuras de control
     */
    public function getAllUsers() {
        $sql = "SELECT * FROM usuarios WHERE estado = 'activo' ORDER BY nombre ASC";
        return $this->db->fetchAll($sql);
    }
}
?>