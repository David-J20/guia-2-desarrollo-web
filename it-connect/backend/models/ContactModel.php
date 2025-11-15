<?php
// 2.5.10 Modelo de Contactos - Libreta de direcciones
// Archivo: backend/models/ContactModel.php

require_once __DIR__ . '/../config/Database.php';

class ContactModel {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    /**
     * 2.5.10 Agregar un contacto (conexión entre usuarios)
     * 2.5.12 Estructuras de control para validación
     */
    public function addContact($usuarioId, $contactoId) {
        // Validar que no sea a sí mismo
        if ($usuarioId == $contactoId) {
            return ['success' => false, 'message' => 'No puedes conectarte contigo mismo'];
        }
        
        // Validar que ambos usuarios existan
        $usuario = $this->db->fetchOne("SELECT id FROM usuarios WHERE id = :id", [':id' => $usuarioId]);
        $contacto = $this->db->fetchOne("SELECT id FROM usuarios WHERE id = :id", [':id' => $contactoId]);
        
        if (!$usuario || !$contacto) {
            return ['success' => false, 'message' => 'Usuario no encontrado'];
        }
        
        // Validar que no ya existe la conexión
        $existing = $this->db->fetchOne(
            "SELECT id FROM contactos WHERE usuario_id = :uid AND contacto_id = :cid",
            [':uid' => $usuarioId, ':cid' => $contactoId]
        );
        
        if ($existing) {
            return ['success' => false, 'message' => 'Ya estás conectado con este usuario'];
        }
        
        // Crear la conexión bidireccional
        try {
            // Conexión 1: Usuario -> Contacto
            $sql1 = "INSERT INTO contactos (usuario_id, contacto_id) VALUES (:uid, :cid)";
            $this->db->query($sql1, [':uid' => $usuarioId, ':cid' => $contactoId]);
            
            // Conexión 2: Contacto -> Usuario
            $this->db->query($sql1, [':uid' => $contactoId, ':cid' => $usuarioId]);
            
            return ['success' => true, 'message' => 'Contacto agregado exitosamente'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    /**
     * 2.5.10 Obtener lista de contactos de un usuario
     * 2.5.12 JOIN para relaciones entre tablas
     */
    public function getContactsList($usuarioId) {
        $sql = "SELECT u.id, u.nombre, u.email, u.especialidad, u.github_username, u.ubicacion, 
                       u.bio, c.fecha_conexion
                FROM usuarios u
                INNER JOIN contactos c ON u.id = c.contacto_id
                WHERE c.usuario_id = :usuario_id AND c.estado = 'activo'
                ORDER BY c.fecha_conexion DESC";
        
        return $this->db->fetchAll($sql, [':usuario_id' => $usuarioId]);
    }
    
    /**
     * Buscar contactos por especialidad
     * 2.5.10 & 2.5.12 Búsqueda con estructuras de control
     */
    public function searchContacts($usuarioId, $specialty) {
        if (empty($specialty)) {
            return [];
        }
        
        $sql = "SELECT u.id, u.nombre, u.email, u.especialidad, u.github_username
                FROM usuarios u
                INNER JOIN contactos c ON u.id = c.contacto_id
                WHERE c.usuario_id = :usuario_id 
                AND u.especialidad = :specialty
                AND c.estado = 'activo'
                ORDER BY u.nombre ASC";
        
        return $this->db->fetchAll($sql, [
            ':usuario_id' => $usuarioId,
            ':specialty' => $specialty
        ]);
    }
    
    /**
     * Eliminar un contacto
     */
    public function removeContact($usuarioId, $contactoId) {
        try {
            // Eliminar la conexión bidireccional
            $sql = "DELETE FROM contactos WHERE (usuario_id = :uid AND contacto_id = :cid) 
                    OR (usuario_id = :cid AND contacto_id = :uid)";
            
            $this->db->query($sql, [
                ':uid' => $usuarioId,
                ':cid' => $contactoId
            ]);
            
            return ['success' => true, 'message' => 'Contacto eliminado'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    /**
     * Contar total de contactos de un usuario
     */
    public function countContacts($usuarioId) {
        $result = $this->db->fetchOne(
            "SELECT COUNT(*) as total FROM contactos WHERE usuario_id = :id AND estado = 'activo'",
            [':id' => $usuarioId]
        );
        
        return $result['total'] ?? 0;
    }
}
?>