<?php
// 2.5.10 Controlador de Contactos - Libreta de direcciones AJAX
// Archivo: backend/controllers/ContactsController.php

require_once __DIR__ . '/../models/ContactModel.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../controllers/AuthController.php';

class ContactsController {
    private $contactModel;
    private $userModel;
    private $authController;
    
    public function __construct() {
        $this->contactModel = new ContactModel();
        $this->userModel = new UserModel();
        $this->authController = new AuthController();
    }
    
    /**
     * 2.5.10 Obtener lista de contactos del usuario actual
     */
    public function getContacts() {
        if (!$this->authController->isAuthenticated()) {
            return $this->jsonResponse(['success' => false, 'message' => 'No autenticado'], 401);
        }
        
        $currentUser = $this->authController->getCurrentUser();
        $contacts = $this->contactModel->getContactsList($currentUser['id']);
        
        return $this->jsonResponse(['success' => true, 'contacts' => $contacts], 200);
    }
    
    /**
     * 2.5.10 Agregar un nuevo contacto (conexión)
     * Petición AJAX
     */
    public function addContact() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->jsonResponse(['success' => false, 'message' => 'Método no permitido'], 405);
        }
        
        if (!$this->authController->isAuthenticated()) {
            return $this->jsonResponse(['success' => false, 'message' => 'No autenticado'], 401);
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (empty($data['contacto_id'])) {
            return $this->jsonResponse(['success' => false, 'message' => 'ID de contacto requerido'], 400);
        }
        
        $currentUser = $this->authController->getCurrentUser();
        $result = $this->contactModel->addContact($currentUser['id'], $data['contacto_id']);
        
        $statusCode = $result['success'] ? 201 : 400;
        return $this->jsonResponse($result, $statusCode);
    }
    
    /**
     * 2.5.10 Buscar contactos por especialidad
     * 2.5.9 Validación con AJAX
     */
    public function searchBySpecialty() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            return $this->jsonResponse(['success' => false, 'message' => 'Método no permitido'], 405);
        }
        
        if (!$this->authController->isAuthenticated()) {
            return $this->jsonResponse(['success' => false, 'message' => 'No autenticado'], 401);
        }
        
        $specialty = $_GET['specialty'] ?? '';
        
        if (empty($specialty)) {
            return $this->jsonResponse(['success' => false, 'message' => 'Especialidad requerida'], 400);
        }
        
        $currentUser = $this->authController->getCurrentUser();
        $contacts = $this->contactModel->searchContacts($currentUser['id'], $specialty);
        
        return $this->jsonResponse(['success' => true, 'contacts' => $contacts], 200);
    }
    
    /**
     * Eliminar un contacto
     * 2.5.10 CRUD - Delete
     */
    public function removeContact() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            return $this->jsonResponse(['success' => false, 'message' => 'Método no permitido'], 405);
        }
        
        if (!$this->authController->isAuthenticated()) {
            return $this->jsonResponse(['success' => false, 'message' => 'No autenticado'], 401);
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (empty($data['contacto_id'])) {
            return $this->jsonResponse(['success' => false, 'message' => 'ID de contacto requerido'], 400);
        }
        
        $currentUser = $this->authController->getCurrentUser();
        $result = $this->contactModel->removeContact($currentUser['id'], $data['contacto_id']);
        
        $statusCode = $result['success'] ? 200 : 400;
        return $this->jsonResponse($result, $statusCode);
    }
    
    /**
     * 2.5.10 Obtener sugerencias de contactos (usuarios que no son contactos aún)
     * 2.5.12 Uso de estructuras de control
     */
    public function getSuggestions() {
        if (!$this->authController->isAuthenticated()) {
            return $this->jsonResponse(['success' => false, 'message' => 'No autenticado'], 401);
        }
        
        $currentUser = $this->authController->getCurrentUser();
        $allUsers = $this->userModel->getAllUsers();
        
        // Filtrar: excluir al usuario actual y sus contactos
        $currentContacts = $this->contactModel->getContactsList($currentUser['id']);
        $contactIds = array_map(fn($c) => $c['id'], $currentContacts);
        
        $suggestions = array_filter($allUsers, function($user) use ($currentUser, $contactIds) {
            // 2.5.12 Estructuras de control (if)
            if ($user['id'] == $currentUser['id']) {
                return false; // Excluir al usuario actual
            }
            if (in_array($user['id'], $contactIds)) {
                return false; // Excluir contactos existentes
            }
            return true;
        });
        
        return $this->jsonResponse(['success' => true, 'suggestions' => array_values($suggestions)], 200);
    }
    
    /**
     * Contar contactos
     */
    public function countContacts() {
        if (!$this->authController->isAuthenticated()) {
            return $this->jsonResponse(['success' => false, 'message' => 'No autenticado'], 401);
        }
        
        $currentUser = $this->authController->getCurrentUser();
        $count = $this->contactModel->countContacts($currentUser['id']);
        
        return $this->jsonResponse(['success' => true, 'count' => $count], 200);
    }
    
    /**
     * Enviar respuesta en formato JSON
     */
    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
?>