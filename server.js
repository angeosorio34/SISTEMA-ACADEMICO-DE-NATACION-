// server.js — Servidor principal del Sistema Academia de Natación
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const os = require('os');
const { obtenerSessionSecret } = require('./middleware/session-secret');
const { requireAuth } = require('./middleware/permisos');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
// Cabeceras de seguridad. CSP se desactiva porque toda la interfaz usa
// atributos onclick= y <style> en línea; HSTS se desactiva porque el sistema
// corre por HTTP en la red local, sin certificado TLS.
app.use(helmet({ contentSecurityPolicy: false, hsts: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: obtenerSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000  // 8 horas
    }
}));

// ===== RUTAS DE API =====
const configRouter = require('./routes/config');
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/alumnos',     [requireAuth], require('./routes/alumnos'));
app.use('/api/asistencia',  [requireAuth], require('./routes/asistencia'));
app.use('/api/horarios',    [requireAuth], require('./routes/horarios'));
app.use('/api/facturacion', [requireAuth], require('./routes/facturacion'));
app.use('/api/alquileres',  [requireAuth], require('./routes/alquileres'));
app.use('/api/usuarios',    [requireAuth], require('./routes/usuarios'));
app.use('/api/reportes',    [requireAuth], require('./routes/reportes'));
app.use('/api/config',      [requireAuth], configRouter);
app.use('/api/backups',     [requireAuth], require('./routes/backups'));

// ===== TASA DEL DÍA: actualización automática =====
// Al iniciar el servidor, y luego cada hora (por si cambia el día mientras queda abierto)
configRouter.actualizarTasaAutomatica();
setInterval(() => configRouter.actualizarTasaAutomatica(), 60 * 60 * 1000);

// ===== COPIAS DE SEGURIDAD: semanal y anual automáticas =====
// Al iniciar el servidor, y luego cada 6 horas (por si el servidor queda encendido varios días)
const { revisarBackupsAutomaticos } = require('./database/backups');
revisarBackupsAutomaticos();
setInterval(revisarBackupsAutomaticos, 6 * 60 * 60 * 1000);

// ===== RUTA INFO DEL SERVIDOR (PARA PANTALLA DE LOGIN) =====
app.get('/api/info', (req, res) => {
    const { getAllConfig } = require('./database/db');
    const cfg = getAllConfig();
    res.json({
        nombre_academia: cfg.nombre_academia || 'Escuela de Natación',
        logo_url: cfg.logo_url || null,
        version: '1.0.0',
        ip_red: obtenerIPLocal(),
        puerto: PORT
    });
});

function obtenerIPLocal() {
    const interfaces = os.networkInterfaces();
    let localIP = null;
    Object.keys(interfaces).forEach(name => {
        interfaces[name].forEach(iface => {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIP = iface.address;
            }
        });
    });
    return localIP;
}

// ===== SESIÓN ACTUAL =====
app.get('/api/session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            loggedIn: true,
            userId: req.session.userId,
            nombre: req.session.nombre,
            nivel: req.session.nivel,
            puede_consultar: req.session.puede_consultar,
            puede_modificar: req.session.puede_modificar,
            puede_registrar: req.session.puede_registrar
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// ===== SPA FALLBACK =====
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Endpoint no encontrado' });
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== MANEJADOR DE ERRORES GLOBAL =====
// Atrapa errores que ocurren antes de llegar a una ruta (ej. multer rechazando un
// archivo por tamaño o tipo) para que SIEMPRE se responda JSON y nunca se filtre
// el detalle interno (ruta de archivos, stack trace) al cliente.
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    console.error('[Error]', err);
    if (err && err.name === 'MulterError') {
        const mensajes = {
            LIMIT_FILE_SIZE: 'El archivo es demasiado grande (máximo 10 MB).',
        };
        return res.status(400).json({ error: mensajes[err.code] || 'No se pudo procesar el archivo.' });
    }
    if (err && err.status === 400) {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
});

// ===== INICIO DEL SERVIDOR =====
app.listen(PORT, '0.0.0.0', () => {
    const localIP = obtenerIPLocal() || 'localhost';

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   SISTEMA ACADEMIA DE NATACIÓN - ACTIVO        ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║  Local:    http://localhost:${PORT}               ║`);
    console.log(`║  Red:      http://${localIP}:${PORT}        ║`);
    console.log('╠════════════════════════════════════════════════╣');
    console.log('║  Usuario: admin  |  Contraseña: admin123       ║');
    console.log('║  (Cambia la contraseña al primer inicio)       ║');
    console.log('╚════════════════════════════════════════════════╝\n');
});

module.exports = app;
