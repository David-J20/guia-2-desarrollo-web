# 📋 Plan de Implementación: IT Connect - Versión Dinámica (PHP + MySQL + CodeIgniter)

## 🎯 Objetivo General
Convertir IT Connect de una aplicación estática HTML/CSS/JS a una aplicación dinámica completa con PHP, MySQL, CodeIgniter y AJAX.

---

## 📌 QUÉ NECESITO DE TI (Requisitos Previos)

### 1. **Entorno de Desarrollo** 
- [ ] Instalar **XAMPP** (PHP + MySQL + Apache)
  - Descargar desde: https://www.apachefriends.org/
  - O si usas Mac: Instalar Homebrew + PHP + MySQL
  
- [ ] Verificar que funciona:
  - Apache corriendo en http://localhost
  - MySQL accesible
  - PHPMyAdmin disponible en http://localhost/phpmyadmin

### 2. **Información del Proyecto**
Necesito que me digas:

- [ ] **¿Dónde colocar el proyecto?** 
  - Ruta en XAMPP: `/htdocs/it-connect/` (Windows)
  - O `/usr/local/var/www/it-connect/` (Mac)

- [ ] **Base de datos**: ¿Qué información debe guardarse?
  - Usuarios (nombre, email, contraseña, especialidad, GitHub username)
  - Contactos/Conexiones entre usuarios
  - Historial de visitas
  - ¿Algo más específico?

- [ ] **Funcionalidades prioritarias** (de la lista 2.5):
  - ¿Registro de usuarios?
  - ¿Login/logout?
  - ¿Libreta de direcciones dinámica?
  - ¿Contador de visitas?
  - ¿Integración con GitHub persistente?

### 3. **Sistema Operativo Confirmación**
- [ ] ¿Usas Windows o Mac?
- [ ] ¿Ya tienes XAMPP o necesitas instalarlo?

---

## 🚀 FASES DE IMPLEMENTACIÓN

### **FASE 1: Configuración Base** (1-2 horas)
**Qué haré yo:**
- [ ] Instalar CodeIgniter 4 en tu proyecto
- [ ] Configurar estructura MVC
- [ ] Crear configuración de base de datos
- [ ] Generar modelos base

**Qué necesito de ti:**
- Confirmar sistema operativo y ruta del proyecto
- Instalar XAMPP (si no lo tienes)

---

### **FASE 2: Base de Datos** (2-3 horas)
**Qué haré yo:**
- [ ] Diseñar esquema relacional (Usuarios, Perfiles, Contactos, Visitas)
- [ ] Crear script SQL para generar tablas
- [ ] Crear modelos en CodeIgniter

**Qué necesito de ti:**
- [ ] Confirmar qué datos necesitas guardar
- [ ] Ejecutar el script SQL en PHPMyAdmin

---

### **FASE 3: Autenticación** (3-4 horas)
**Qué haré yo:**
- [ ] Formulario de Registro con AJAX
- [ ] Validación de formularios (lado cliente + servidor)
- [ ] Sistema de login/logout
- [ ] Uso de sesiones y cookies
- [ ] Protección de rutas (solo usuarios logueados)

**Qué necesito de ti:**
- Probar los formularios en tu entorno local

---

### **FASE 4: Libreta de Direcciones Dinámica** (3-4 horas)
**Qué haré yo:**
- [ ] CRUD completo (Create, Read, Update, Delete) de contactos
- [ ] Integración con AJAX (sin recargar página)
- [ ] Búsqueda y filtrado dinámico
- [ ] Integración con GitHub API (persistente en BD)
- [ ] Tablas responsivas

**Qué necesito de ti:**
- Probar funcionalidad

---

### **FASE 5: Características Adicionales** (2-3 horas)
**Qué haré yo:**
- [ ] Contador de visitas con cookies
- [ ] Panel de estadísticas
- [ ] Estructuras de control PHP (if, else, while, for)
- [ ] Funciones modulares y reutilizables

**Qué necesito de ti:**
- Validar que todo funcione correctamente

---

### **FASE 6: Documentación y Presentación** (1-2 horas)
**Qué haré yo:**
- [ ] Documentación del código
- [ ] Guía de uso
- [ ] Diagramas MVC
- [ ] Diagrama Entidad-Relación (ER)

**Qué necesito de ti:**
- Revisar documentación

---

## 📊 Cronograma Estimado

| Fase | Duración | Estado |
|------|----------|--------|
| Configuración Base | 1-2h | ⏳ Pendiente |
| Base de Datos | 2-3h | ⏳ Pendiente |
| Autenticación | 3-4h | ⏳ Pendiente |
| Libreta de Direcciones | 3-4h | ⏳ Pendiente |
| Características Adicionales | 2-3h | ⏳ Pendiente |
| Documentación | 1-2h | ⏳ Pendiente |
| **TOTAL ESTIMADO** | **12-18 horas** | ⏳ Pendiente |

---

## 🔧 Checklist: Qué Tengo Listo

### Ya Completado (HTML/CSS/JS):
- ✅ Diseño responsivo (Flexbox/Grid)
- ✅ HTML5 semántico
- ✅ JavaScript modular
- ✅ Integración GitHub API
- ✅ Sistema de login básico (localStorage)
- ✅ Validación de formularios

### Lo Que Falta:
- [ ] Backend con PHP/CodeIgniter
- [ ] Base de datos MySQL
- [ ] Autenticación persistente
- [ ] CRUD completo
- [ ] AJAX mejorado
- [ ] Contador de visitas
- [ ] Sesiones y cookies

---

## 💾 Estructura del Proyecto (CodeIgniter 4)

```
it-connect/
├── app/
│   ├── Config/
│   ├── Controllers/
│   │   ├── Home.php
│   │   ├── Auth.php (login/registro)
│   │   ├── Contacts.php (libreta de direcciones)
│   │   ├── Users.php (perfil de usuario)
│   │   └── Ajax.php (peticiones AJAX)
│   ├── Models/
│   │   ├── UserModel.php
│   │   ├── ContactModel.php
│   │   ├── VisitModel.php
│   │   └── GithubModel.php
│   └── Views/
│       ├── layout/
│       ├── auth/
│       ├── contacts/
│       └── users/
├── public/
│   ├── css/
│   ├── js/
│   └── index.php
├── database/
│   └── migrations/
│       └── create_tables.php
└── README.md
```

---

## 🎓 Cumplimiento de Requisitos (2.5)

| Requisito | Cómo lo Implementaremos |
|-----------|------------------------|
| 2.5.1 Características PHP/SQL | Documentación + Código comentado |
| 2.5.2 Instalación CodeIgniter | Te guiaré paso a paso |
| 2.5.3 Patrón MVC | Estructura completa CodeIgniter 4 |
| 2.5.4 Tutorial News App | Adaptaremos para IT Connect |
| 2.5.5 Ciclo Scrum | Plan dividido en fases |
| 2.5.6 Identificar elementos dinámicos | Registro, login, contactos, GitHub |
| 2.5.7 Base datos relacional | Diseño ER completo |
| 2.5.8 MySQL en PHPMyAdmin | Scripts SQL listos |
| 2.5.9 Registro + Login + AJAX | Validación completa |
| 2.5.10 Libreta de direcciones AJAX | CRUD dinámico |
| 2.5.11 Contador de visitas | Con cookies |
| 2.5.12 Estructuras de control | PHP con if/else/while/for |
| 2.5.13 Cookies y sesiones | Sistema completo |

---

## ✅ PRÓXIMOS PASOS (TÚ)

### Ahora mismo:
1. [ ] Confirma tu sistema operativo (Windows/Mac)
2. [ ] Instala XAMPP si no lo tienes
3. [ ] Verifica que http://localhost/phpmyadmin funciona
4. [ ] Dime en qué ruta quieres el proyecto

### Una vez hayas hecho eso:
**¡Comenzaremos con FASE 1!** 🚀

---

**Creado**: 15 de noviembre de 2025  
**Para**: Presentación Guía 2 - Desarrollo Web Dinámico  
**Duración estimada**: 3-4 semanas (con dedicación)

¿Listo para comenzar?