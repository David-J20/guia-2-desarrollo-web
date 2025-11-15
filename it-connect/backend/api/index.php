<?php
// 2.5.9 API REST - Puntos de entrada para peticiones AJAX
// Archivo: backend/api/index.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Iniciar sesión
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Importar controladores
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ContactsController.php';

// Obtener parámetros de la URL
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

/**
 * 2.5.12 Enrutador simple con estructuras de control (if, else if)
 * Mapea las peticiones a los controladores correspondientes
 */

// Instanciar controladores
$authController = new AuthController();
$contactsController = new ContactsController();

try {
    // 2.5.9 Rutas de autenticación
    if ($action === 'register' && $method === 'POST') {
        $authController->register();
    } 
    else if ($action === 'login' && $method === 'POST') {
        $authController->login();
    } 
    else if ($action === 'logout' && $method === 'POST') {
        $authController->logout();
    }
        else if ($action === 'get-user' && $method === 'GET') {
            // Obtener datos del usuario autenticado actual
            $user = $authController->getCurrentUser();
            if ($user) {
                http_response_code(200);
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'No autenticado']);
            }
        }
    // 2.5.10 Rutas de contactos
    else if ($action === 'contacts' && $method === 'GET') {
        $contactsController->getContacts();
    }
    else if ($action === 'add-contact' && $method === 'POST') {
        $contactsController->addContact();
    }
    else if ($action === 'search-contacts' && $method === 'GET') {
        $contactsController->searchBySpecialty();
    }
    else if ($action === 'remove-contact' && $method === 'DELETE') {
        $contactsController->removeContact();
    }
    else if ($action === 'suggestions' && $method === 'GET') {
        $contactsController->getSuggestions();
    }
    else if ($action === 'count-contacts' && $method === 'GET') {
        $contactsController->countContacts();
    }
    // Si la acción no existe
    else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Acción no encontrada']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno: ' . $e->getMessage()]);
}
?>