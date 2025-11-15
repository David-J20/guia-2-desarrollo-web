<?php
// 2.5.8 Configuración de conexión a Base de Datos MySQL
// Archivo: backend/config/Database.php

class Database {
    // Credenciales de la base de datos
    private $host = 'localhost';
    private $dbname = 'it_connect_db';
    private $dbuser = 'root';  // Usuario por defecto en XAMPP
    private $dbpass = '';      // Sin contraseña por defecto en XAMPP
    private $charset = 'utf8mb4';
    
    // Conexión PDO
    private $connection;
    
    /**
     * Constructor: Establece la conexión a la base de datos
     */
    public function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            
            $this->connection = new PDO(
                $dsn,
                $this->dbuser,
                $this->dbpass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
            
            // Conexión exitosa (no imprimir nada aquí para no contaminar JSON)
        } catch (PDOException $e) {
            die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]));
        }
    }
    
    /**
     * Retorna la conexión PDO
     */
    public function getConnection() {
        return $this->connection;
    }
    
    /**
     * Ejecuta una consulta preparada (segura contra SQL injection)
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            die("Error en query: " . $e->getMessage());
        }
    }
    
    /**
     * Obtiene una fila de resultados
     */
    public function fetchOne($sql, $params = []) {
        $result = $this->query($sql, $params);
        return $result->fetch();
    }
    
    /**
     * Obtiene todas las filas de resultados
     */
    public function fetchAll($sql, $params = []) {
        $result = $this->query($sql, $params);
        return $result->fetchAll();
    }
    
    /**
     * Ejecuta un INSERT y retorna el ID insertado
     */
    public function insert($sql, $params = []) {
        $this->query($sql, $params);
        return $this->connection->lastInsertId();
    }
}
?>