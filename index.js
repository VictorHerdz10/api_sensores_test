import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configurar __dirname para ES6 Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 4000;

// Middleware para parsing JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    next();
});

// Ruta POST para recibir datos del sensor
app.post('/api/sensores', (req, res) => {
    console.log('📡 Datos recibidos:', req.body);
    
    // Validar datos
    if (!req.body.sensor_id || !req.body.temperatura) {
        return res.status(400).json({ 
            success: false,
            error: 'Datos incompletos',
            required_fields: ['sensor_id', 'temperatura', 'humedad', 'presion']
        });
    }
    
    // Convertir timestamp si existe
    const timestamp = req.body.timestamp 
        ? new Date(req.body.timestamp).toLocaleString()
        : new Date().toLocaleString();
    
    // Log detallado
    console.log('📋 Detalles del sensor:');
    console.log(`✅ Sensor ID: ${req.body.sensor_id}`);
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log(`🌡️  Temperatura: ${req.body.temperatura}°C`);
    console.log(`💧 Humedad: ${req.body.humedad}%`);
    console.log(`📊 Presión: ${req.body.presion} hPa`);
    console.log(`⚠️  Nivel de alerta: ${req.body.alerta}`);
    console.log(`🔧 Modo: ${req.body.modo || 'desconocido'}`);
    
    // Responder al cliente
    res.json({
        success: true,
        message: '✅ Datos recibidos correctamente',
        server_time: new Date().toISOString(),
        client_timestamp: req.body.timestamp,
        sensor_id: req.body.sensor_id,
        alert_level: req.body.alerta,
        processing: {
            received_at: new Date().toISOString(),
            processing_time_ms: 0
        }
    });
});

// Ruta GET para verificar que el servidor funciona
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: '🚀 Servidor API funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        endpoints: {
            POST: '/api/sensores',
            GET: '/api/status'
        }
    });
});

// Ruta de prueba para POST
app.post('/api/test', (req, res) => {
    console.log('🧪 Test POST recibido:', req.body);
    res.json({
        success: true,
        message: 'Test POST exitoso',
        received_data: req.body,
        server_time: new Date().toISOString()
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Sensores Meteorológicos',
        documentation: {
            endpoints: [
                {
                    method: 'POST',
                    path: '/api/sensores',
                    description: 'Enviar datos del sensor',
                    body_format: {
                        sensor_id: 'string',
                        timestamp: 'number (milliseconds)',
                        temperatura: 'number',
                        humedad: 'number',
                        presion: 'number',
                        alerta: 'number (0-2)',
                        modo: 'string'
                    }
                },
                {
                    method: 'GET',
                    path: '/api/status',
                    description: 'Verificar estado del servidor'
                },
                {
                    method: 'POST',
                    path: '/api/test',
                    description: 'Endpoint de prueba'
                }
            ]
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        available_routes: [
            'GET /',
            'GET /api/status',
            'POST /api/sensores',
            'POST /api/test'
        ]
    });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(' Error en el servidor:', err);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`Servidor API ejecutándose en: http://localhost:${PORT}`);
    console.log(` Endpoints disponibles:`);
    console.log(`   POST  http://localhost:${PORT}/api/sensores`);
    console.log(`   GET   http://localhost:${PORT}/api/status`);
    console.log(`   POST  http://localhost:${PORT}/api/test`);
    console.log(`   GET   http://localhost:${PORT}/`);
    console.log('='.repeat(50));
    console.log('Esperando datos del simulador C++...');
});