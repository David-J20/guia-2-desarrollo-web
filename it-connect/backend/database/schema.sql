-- 2.5.7 & 2.5.8 Esquema de Base de Datos Relacional para IT Connect
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS it_connect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE it_connect_db;

-- ============================================
-- TABLA: usuarios
-- 2.5.9 Registro y Login de usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    especialidad ENUM('frontend', 'backend', 'fullstack', 'devops', 'data') NOT NULL,
    github_username VARCHAR(100),
    ubicacion VARCHAR(150),
    bio TEXT,
    foto_perfil VARCHAR(255),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para búsquedas rápidas
    INDEX idx_email (email),
    INDEX idx_especialidad (especialidad),
    INDEX idx_github (github_username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: contactos
-- 2.5.10 Libreta de direcciones
-- ============================================
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    contacto_id INT NOT NULL,
    fecha_conexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'bloqueado') DEFAULT 'activo',
    
    -- Claves foráneas (relaciones)
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (contacto_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices
    UNIQUE INDEX idx_conexion (usuario_id, contacto_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: visitas
-- 2.5.11 Contador de visitas
-- ============================================
CREATE TABLE IF NOT EXISTS visitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    referrer VARCHAR(255),
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relación con usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_fecha (fecha_visita),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: sesiones
-- 2.5.13 Gestión de sesiones y cookies
-- ============================================
CREATE TABLE IF NOT EXISTS sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    estado ENUM('activa', 'expirada', 'revocada') DEFAULT 'activa',
    
    -- Relación con usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_token (token),
    INDEX idx_usuario (usuario_id),
    INDEX idx_expiracion (fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: github_data (Caché de datos de GitHub)
-- Mashup: Integración con GitHub API
-- ============================================
CREATE TABLE IF NOT EXISTS github_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    github_username VARCHAR(100) UNIQUE NOT NULL,
    repos_count INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    gists INT DEFAULT 0,
    bio TEXT,
    location VARCHAR(150),
    avatar_url VARCHAR(255),
    profile_url VARCHAR(255),
    last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relación con usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_github_username (github_username),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: logs
-- Para auditoría y debugging
-- ============================================
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('login', 'logout', 'crear', 'actualizar', 'eliminar', 'error') NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relación con usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_tipo (tipo),
    INDEX idx_fecha (fecha),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERTS DE PRUEBA
-- ============================================

-- Usuarios de prueba
INSERT INTO usuarios (nombre, email, password, especialidad, github_username, ubicacion, bio) VALUES
('Ana García', 'ana@itconnect.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456789', 'frontend', 'anagarcia', 'Bogotá, Colombia', 'Frontend Developer apasionada'),
('Carlos Rodríguez', 'carlos@itconnect.com', '$2y$10$abcdefghijklmnopqrstuvwxyz123456789', 'backend', 'carlosrm', 'Medellín, Colombia', 'Backend Developer con expertise en Node.js');

-- Ver estructura creada
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'it_connect_db';