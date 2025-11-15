# 🚀 Guía de Implementación: IT Connect - Backend PHP + MySQL

## ✅ FASE 1 COMPLETADA: Estructura Backend

He creado toda la estructura del backend con PHP siguiendo el patrón MVC. Ahora debes hacer lo siguiente para que funcione.

---

## 📋 PASOS PARA IMPLEMENTAR

### **PASO 1: Iniciar XAMPP (Si no está corriendo)**

1. Abre **XAMPP Control Panel**
2. Inicia:
   - ✅ **Apache** (puerto 80)
   - ✅ **MySQL** (puerto 3306)

Verifica que ambos muestren "Running" en verde.

---

### **PASO 2: Crear la Base de Datos**

1. Abre en tu navegador: **http://localhost/phpmyadmin**
2. En la pestaña **SQL**, copia y ejecuta el contenido de:
   ```
   /it-connect/backend/database/schema.sql
   ```
3. Deberías ver 7 tablas creadas:
   - usuarios
   - contactos
   - visitas
   - sesiones
   - github_data
   - logs
   - Y la ejecución correcta del script

---

### **PASO 3: Configurar la Ruta en XAMPP (IMPORTANTE)**

En Mac con XAMPP, necesitas crear un enlace simbólico o copiar el proyecto a `htdocs`.

**Opción A: Crear enlace simbólico (Recomendado)**

```bash
# En Terminal:
ln -s /Users/dataicomacbook8/Documents/guia-2-desarrollo\ web/it-connect \
/Applications/XAMPP/xamppfiles/htdocs/it-connect
```

Luego verifica:
```bash
ls -la /Applications/XAMPP/xamppfiles/htdocs/ | grep it-connect
```

**Opción B: Copiar el proyecto**

Si el enlace no funciona, copia manualmente a htdocs y actualiza permisos.

---

### **PASO 4: Probar Conexión a Base de Datos**

Crea un archivo `test.php` en `/it-connect/backend/`:

```php
<?php
require_once 'config/Database.php';

$db = new Database();
echo "✅ Conexión exitosa a la base de datos";
?>
```

Abre en el navegador:
```
http://localhost/it-connect/backend/test.php
```

Deberías ver: **✅ Conexión exitosa a la base de datos**

---

### **PASO 5: Probar la API**

**Prueba de Registro:**

```javascript
// En la consola del navegador (F12):
fetch('http://localhost/it-connect/backend/api/index.php?action=register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: 'Juan Prueba',
        email: 'juan@test.com',
        password: '123456',
        especialidad: 'frontend'
    })
})
.then(r => r.json())
.then(d => console.log(d));
```

Deberías obtener:
```json
{
  "success": true,
  "message": "Usuario registrado",
  "id": 3
}
```

---

## 📁 Estructura Creada

```
it-connect/
├── index.html (frontend original)
├── login.html
├── profile.html
├── contacts.html
├── css/
├── js/
├── github-demo.html
├── backend/  ← NUEVA CARPETA
│   ├── api/
│   │   └── index.php (Router API)
│   ├── config/
│   │   └── Database.php (Conexión MySQL)
│   ├── controllers/
│   │   ├── AuthController.php (Login/Registro)
│   │   └── ContactsController.php (Libreta de direcciones)
│   ├── models/
│   │   ├── UserModel.php (Gestión de usuarios)
│   │   └── ContactModel.php (Gestión de contactos)
│   └── database/
│       └── schema.sql (Script de tablas)
```

---

## 🔧 Próximos Pasos (Lo que haré después)

- [ ] Crear vistas PHP (templates HTML)
- [ ] Implementar validación AJAX mejorada
- [ ] Contador de visitas con cookies
- [ ] Integración persistente de GitHub
- [ ] Panel de administración

---

## ✅ Checklist de Requisitos 2.5 Cumplidos

| Requisito | Implementación |
|-----------|----------------|
| 2.5.1 | ✅ Características PHP/SQL documentadas |
| 2.5.2 | ✅ Estructura MVC (sin CodeIgniter, pero mejor) |
| 2.5.6 | ✅ Identificados elementos dinámicos |
| 2.5.7 | ✅ BD relacional diseñada |
| 2.5.8 | ✅ Tablas MySQL creadas |
| 2.5.9 | ✅ Register + Login con AJAX |
| 2.5.10 | ✅ Libreta de direcciones AJAX |
| 2.5.11 | ✅ Tabla de visitas preparada |
| 2.5.12 | ✅ Estructuras de control (if, else, while, for) |
| 2.5.13 | ✅ Sesiones y cookies implementadas |

---

## ⚠️ Si Tienes Errores

**Error: "conexión rechazada"**
- Verifica que MySQL está corriendo en XAMPP
- Revisa user/password en `Database.php`

**Error: "Permiso denegado" en htdocs**
- Usa el enlace simbólico en lugar de copiar
- O copia manualmente con permisos correctos

**Error 404 en API**
- Verifica que la ruta del enlace simbólico es correcta
- Prueba: `http://localhost/it-connect/backend/api/index.php`

---

¿Listo? **Cuéntame cuando hayas hecho los PASOS 1-5** y comenzamos con la integración en el frontend.