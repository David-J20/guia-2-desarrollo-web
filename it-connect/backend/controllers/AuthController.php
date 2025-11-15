<?php
// 2.5.9 Controlador de Autenticación - Login y Registro
// Archivo: backend/controllers/AuthController.php

require_once __DIR__ . '/../models/UserModel.php';

class AuthController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new UserModel();
    }
    
    /**
     * 2.5.9 Procesar registro de usuario
     * 2.5.12 Uso de funciones y estructuras de control
     */
    public function register() {
        // Validar que es una petición POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->jsonResponse(['success' => false, 'message' => 'Método no permitido'], 405);
        }
        
        // Obtener datos del formulario
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validar datos requeridos
        $required = ['nombre', 'email', 'password', 'especialidad'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return $this->jsonResponse(['success' => false, 'message' => "El campo $field es requerido"], 400);
            }
        }
        
        // Llamar al modelo
        $result = $this->userModel->register(
            $data['nombre'],
            $data['email'],
            $data['password'],
            $data['especialidad']
        );
        
        // Retornar respuesta JSON
        return $this->jsonResponse($result, $result['success'] ? 201 : 400);
    }
    
    /**
     * 2.5.9 Procesar login
     * 2.5.13 Crear sesiones y cookies
     */
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->jsonResponse(['success' => false, 'message' => 'Método no permitido'], 405);
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validar datos
        if (empty($data['email']) || empty($data['password'])) {
            return $this->jsonResponse(['success' => false, 'message' => 'Email y contraseña requeridos'], 400);
        }
        
        // Validar credenciales
        $result = $this->userModel->login($data['email'], $data['password']);
        
        if (!$result['success']) {
            return $this->jsonResponse($result, 401);
        }
        
        // 2.5.13 Crear sesión y cookie
        $user = $result['user'];
        
        // Iniciar sesión PHP
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Guardar datos en sesión
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['nombre'];
        $_SESSION['user_specialty'] = $user['especialidad'];
        
        // Crear cookie de remember (30 días)
        setcookie(
            'it_connect_user',
            $user['id'],
            time() + (30 * 24 * 60 * 60),
            '/',
            '',
            false,
            true  // httponly
        );
        
        // Retornar respuesta exitosa
        return $this->jsonResponse([
            'success' => true,
            'message' => 'Login exitoso',
            'user' => [
                'id' => $user['id'],
                'nombre' => $user['nombre'],
                'email' => $user['email'],
                'especialidad' => $user['especialidad']
            ]
        ], 200);
    }
    
    /**
     * 2.5.13 Cerrar sesión y eliminar cookies
     */
    public function logout() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Destruir sesión
        session_destroy();
        
        // Eliminar cookies
        setcookie('it_connect_user', '', time() - 3600, '/');
        
        return $this->jsonResponse(['success' => true, 'message' => 'Sesión cerrada'], 200);
    }
    
    /**
     * Verificar si el usuario está autenticado
     */
    public function isAuthenticated() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        return isset($_SESSION['user_id']);
    }
    
    /**
     * Obtener usuario actual
     */
    public function getCurrentUser() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!$this->isAuthenticated()) {
            return null;
        }
        
        return [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'],
            'nombre' => $_SESSION['user_name'],
            'especialidad' => $_SESSION['user_specialty']
        ];
    }
    
    /**
     * Enviar respuesta en formato JSON
     * 2.5.12 Función auxiliar
     */
    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
?>