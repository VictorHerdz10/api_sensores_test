# 📡 API de Prueba para Simulador de Sensores Meteorológicos

## 📋 Descripción
API REST minimalista para recibir y procesar datos de sensores meteorológicos desde un simulador escrito en C++. Diseñada específicamente para pruebas de integración entre el simulador nativo y un backend.

## 🚀 Características
- ✅ Recepción de datos vía POST en formato JSON
- ✅ Validación básica de datos del sensor
- ✅ Logging detallado en consola
- ✅ Respuestas estructuradas en JSON
- ✅ Configuración mínima y fácil de usar
- ✅ Soporte para CORS (Cross-Origin Resource Sharing)

## 🏗️ Estructura del Proyecto
```
backend-de-prueba/
├── index.js          # Servidor principal
├── package.json      # Dependencias y configuración
├── README.md         # Esta documentación
└── node_modules/     # Dependencias (generado automáticamente)
```

## 📦 Instalación

### **Requisitos Previos**
- Node.js (versión 14.0.0 o superior)
- npm (viene con Node.js)

### **Paso 1: Clonar/Descargar el proyecto**
```bash
# Crear carpeta del proyecto
mkdir backend-de-prueba
cd backend-de-prueba
```

### **Paso 2: Inicializar proyecto (si aún no tienes package.json)**
```bash
npm init -y
```

### **Paso 3: Instalar dependencias**
```bash
# Instalar Express (dependencia principal)
npm install express

# Instalar Nodemon (para desarrollo - opcional pero recomendado)
npm install --save-dev nodemon
```

### **Paso 4: Configurar package.json**
Asegúrate de que tu `package.json` incluya:
```json
{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

## 🚀 Ejecución

### **Modo Desarrollo (con recarga automática)**
```bash
npm run dev
```

### **Modo Producción**
```bash
npm start
```

### **Directamente con Node.js**
```bash
node index.js
```

## 🔧 Uso de la API

### **1. Verificar estado del servidor**
```bash
GET http://localhost:4000/api/status
```

**Respuesta:**
```json
{
  "success": true,
  "message": "🚀 Servidor API funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### **2. Enviar datos del sensor (desde el simulador C++)**
```bash
POST http://localhost:4000/api/sensores
Content-Type: application/json

{
  "sensor_id": "ARDUINO_TROPICAL_01",
  "timestamp": 1700000000000,
  "temperatura": 25.5,
  "humedad": 75.3,
  "presion": 1013.25,
  "alerta": 2,
  "modo": "simulacion_nativo"
}
```

### **3. Endpoint de prueba**
```bash
POST http://localhost:4000/api/test
Content-Type: application/json

{
  "test": "data"
}
```

### **4. Documentación de la API**
```bash
GET http://localhost:4000/
```

## 📡 Formato de Datos Requerido

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| `sensor_id` | string | Identificador único del sensor | ✅ |
| `temperatura` | number | Temperatura en grados Celsius | ✅ |
| `humedad` | number | Humedad relativa en porcentaje | ✅ |
| `presion` | number | Presión atmosférica en hPa | ✅ |
| `alerta` | number | Nivel de alerta (0-2) | ❌ |
| `timestamp` | number | Marca de tiempo en milisegundos | ❌ |
| `modo` | string | Modo de operación | ❌ |

## 🔍 Validación Implementada
La API valida automáticamente:
- ✅ Campos requeridos (`sensor_id`, `temperatura`, `humedad`, `presion`)
- ✅ Formato JSON correcto
- ✅ Tipos de datos básicos

## 🧪 Pruebas Manuales

### **Usando curl (desde terminal)**
```bash
curl -X POST http://localhost:4000/api/sensores \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_id": "TEST_01",
    "temperatura": 25.5,
    "humedad": 80.0,
    "presion": 1013.0,
    "alerta": 1
  }'
```

### **Usando PowerShell**
```powershell
$body = @{
    sensor_id = "TEST_01"
    temperatura = 25.5
    humedad = 80.0
    presion = 1013.0
    alerta = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/sensores" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### **Usando Python**
```python
import requests

data = {
    "sensor_id": "TEST_01",
    "temperatura": 25.5,
    "humedad": 80.0,
    "presion": 1013.0,
    "alerta": 1
}

response = requests.post("http://localhost:4000/api/sensores", json=data)
print(response.json())
```

## 🐛 Solución de Problemas

### **Error: Puerto 4000 en uso**
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :4000

# Terminar proceso (Windows)
taskkill /PID [PID] /F

# Cambiar puerto en index.js
const PORT = 5000; // o cualquier otro puerto
```

### **Error: npm no reconoce el comando**
```bash
# Asegúrate de estar en la carpeta correcta
cd /ruta/a/backend-de-prueba

# Verificar que package.json existe
dir package.json
```

### **Error: Cannot find module**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### **Error en Windows con PowerShell**
```bash
# Usar Command Prompt (CMD) en lugar de PowerShell
# O ejecutar PowerShell como administrador
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📊 Salida Esperada en Consola

Cuando el servidor está funcionando correctamente:
```
==================================================
🚀 Servidor API ejecutándose en: http://localhost:4000
📡 Endpoints disponibles:
   POST  http://localhost:4000/api/sensores
   GET   http://localhost:4000/api/status
   POST  http://localhost:4000/api/test
   GET   http://localhost:4000/
==================================================
📝 Esperando datos del simulador C++...
```

Cuando recibe datos:
```
📡 Datos recibidos: { sensor_id: 'ARDUINO_TROPICAL_01', ... }
📋 Detalles del sensor:
✅ Sensor ID: ARDUINO_TROPICAL_01
⏰ Timestamp: 15/1/2024 10:30:00
🌡️  Temperatura: 25.5°C
💧 Humedad: 75.3%
📊 Presión: 1013.25 hPa
⚠️  Nivel de alerta: 2
🔧 Modo: simulacion_nativo
```

## 🔗 Integración con Simulador C++

### **Configuración en el código C++:**
```cpp
const string API_URL = "http://localhost:4000/api/sensores";
```

### **Verificar conexión:**
1. Ejecuta el servidor Node.js primero
2. Verifica que responde en: http://localhost:4000/api/status
3. Ejecuta tu simulador C++
4. Deberías ver los logs en ambas consolas

## 📝 Personalización

### **Cambiar puerto:**
Edita la línea en `index.js`:
```javascript
const PORT = 5000; // Cambia 4000 por el puerto deseado
```

### **Agregar autenticación:**
```javascript
// Middleware básico de API Key
app.use('/api/sensores', (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== 'tu-clave-secreta') {
        return res.status(401).json({ error: 'API Key inválida' });
    }
    next();
});
```

## 📄 Licencia
ISC License - Ver archivo LICENSE para más detalles

## 👨‍💻 Autor
Victor Hernandez

## 🤝 Contribución
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte
Para soporte o preguntas:
- Revisa la sección de solución de problemas
- Crea un issue en el repositorio

---

**¡Listo para recibir datos de tu simulador!** 🎉