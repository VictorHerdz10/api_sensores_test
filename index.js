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
    console.log('Datos recibidos:', req.body);
    
    // Validar datos
    if (!req.body.sensor_id || req.body.temperatura === undefined) {
        return res.status(400).json({ 
            success: false,
            error: 'Datos incompletos',
            required_fields: ['sensor_id', 'temperatura', 'humedad', 'presion']
        });
    }
    
    // Redondear valores a 2 decimales
    const temperatura = typeof req.body.temperatura === 'number' 
        ? parseFloat(req.body.temperatura.toFixed(2))
        : parseFloat(parseFloat(req.body.temperatura).toFixed(2));
    
    const humedad = typeof req.body.humedad === 'number'
        ? parseFloat(req.body.humedad.toFixed(2))
        : parseFloat(parseFloat(req.body.humedad).toFixed(2));
    
    const presion = typeof req.body.presion === 'number'
        ? parseFloat(req.body.presion.toFixed(2))
        : parseFloat(parseFloat(req.body.presion).toFixed(2));
    
    // Convertir timestamp (ya está en milisegundos)
    let timestampStr;
    let timestampDate;
    
    if (req.body.timestamp) {
        // El timestamp ya viene en milisegundos
        timestampDate = new Date(req.body.timestamp);
        timestampStr = timestampDate.toLocaleString();
    } else {
        timestampDate = new Date();
        timestampStr = timestampDate.toLocaleString();
    }
    
    // Log detallado con valores redondeados
    console.log('📋 Detalles del sensor:');
    console.log(`✅ Sensor ID: ${req.body.sensor_id}`);
    console.log(`⏰ Timestamp recibido: ${req.body.timestamp}`);
    console.log(`⏰ Fecha convertida: ${timestampStr}`);
    console.log(`🌡️  Temperatura: ${temperatura}°C`);
    console.log(`💧 Humedad: ${humedad}%`);
    console.log(`📊 Presión: ${presion} hPa`);
    console.log(`⚠️  Nivel de alerta: ${req.body.alerta}`);
    console.log(`🔧 Modo: ${req.body.modo || 'desconocido'}`);
    
    // Responder al cliente
    res.json({
        success: true,
        message: 'Datos recibidos correctamente',
        server_time: new Date().toISOString(),
        client_timestamp: req.body.timestamp,
        client_date: timestampStr,
        sensor_id: req.body.sensor_id,
        data_received: {
            temperatura: temperatura,
            humedad: humedad,
            presion: presion,
            alerta: req.body.alerta,
            modo: req.body.modo
        },
        alert_level: req.body.alerta,
        processing: {
            received_at: new Date().toISOString(),
            processing_time_ms: 0,
            values_rounded_to: 2
        }
    });
});

// Ruta GET para verificar que el servidor funciona
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor API funcionando correctamente',
        timestamp: new Date().toISOString(),
        timestamp_ms: Date.now(),
        version: '1.0.0',
        endpoints: {
            POST: '/api/sensores',
            GET: '/api/status'
        },
        note: 'Los timestamps deben enviarse en milisegundos desde 1970'
    });
});

// Ruta de prueba para POST
app.post('/api/test', (req, res) => {
    console.log('Test POST recibido:', req.body);
    
    // Redondear valores de prueba
    const roundedBody = { ...req.body };
    if (typeof roundedBody.temperatura === 'number') {
        roundedBody.temperatura = parseFloat(roundedBody.temperatura.toFixed(2));
    }
    if (typeof roundedBody.humedad === 'number') {
        roundedBody.humedad = parseFloat(roundedBody.humedad.toFixed(2));
    }
    if (typeof roundedBody.presion === 'number') {
        roundedBody.presion = parseFloat(roundedBody.presion.toFixed(2));
    }
    
    res.json({
        success: true,
        message: 'Test POST exitoso',
        received_data: roundedBody,
        server_time: new Date().toISOString(),
        server_timestamp_ms: Date.now(),
        note: 'Valores redondeados a 2 decimales automáticamente'
    });
});

// Ruta para probar timestamp
app.get('/api/timestamp', (req, res) => {
    const now = new Date();
    res.json({
        current_time: now.toISOString(),
        timestamp_ms: now.getTime(),
        timestamp_seconds: Math.floor(now.getTime() / 1000),
        locale_string: now.toLocaleString(),
        note: 'Usar timestamp_ms para enviar datos'
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Sensores Meteorológicos',
        version: '2.0.0',
        timestamp_format: 'milisegundos desde 1970-01-01',
        decimal_precision: '2 decimales',
        documentation: {
            endpoints: [
                {
                    method: 'POST',
                    path: '/api/sensores',
                    description: 'Enviar datos del sensor',
                    body_format: {
                        sensor_id: 'string (requerido)',
                        timestamp: 'number (milisegundos desde 1970)',
                        temperatura: 'number (2 decimales)',
                        humedad: 'number (2 decimales)',
                        presion: 'number (2 decimales)',
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
                },
                {
                    method: 'GET',
                    path: '/api/timestamp',
                    description: 'Obtener timestamp actual del servidor'
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
            'GET /api/timestamp',
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
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Servidor API ejecutándose en: http://localhost:${PORT}`);
    console.log(`📅 Servidor iniciado: ${new Date().toLocaleString()}`);
    console.log(`📊 Endpoints disponibles:`);
    console.log(`   POST  http://localhost:${PORT}/api/sensores`);
    console.log(`   GET   http://localhost:${PORT}/api/status`);
    console.log(`   GET   http://localhost:${PORT}/api/timestamp`);
    console.log(`   POST  http://localhost:${PORT}/api/test`);
    console.log(`   GET   http://localhost:${PORT}/`);
    console.log('='.repeat(50));
    console.log('📡 Esperando datos del simulador C++...');
    console.log('📝 Nota: Los valores se redondean automáticamente a 2 decimales');
    console.log('⏰ Timestamps deben enviarse en milisegundos');
    console.log('='.repeat(50));
});