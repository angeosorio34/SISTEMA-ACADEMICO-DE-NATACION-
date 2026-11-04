# 🏊 Sistema de Gestión Academia de Natación

Sistema web local completo para la gestión integral de academias de natación. Accesible desde cualquier PC conectada a la misma red.

---

## 🚀 Instalación Rápida

### Requisitos
- **Windows** 7/8/10/11
- **Node.js** LTS ([descargar aquí](https://nodejs.org))
- Conexión a internet (solo para la instalación)

### Pasos

1. **Instalar dependencias** (solo la primera vez):
   ```
   Doble-click en: instalar.bat
   ```

2. **Iniciar el sistema** (cada vez que lo use):
   ```
   Doble-click en: iniciar.bat
   ```

3. **Acceder desde el navegador**:
   - En la misma PC: `http://localhost:3000`
   - Desde otras PCs en la red: `http://[IP-DEL-SERVIDOR]:3000`

---

## 🔐 Credenciales por Defecto

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `admin123` |

> ⚠️ **Cambie la contraseña** la primera vez que inicie sesión.

---

## 📋 Módulos del Sistema

### Módulo A — Control de Asistencia y Horarios
- Registro de asistencia por clase/fecha/entrenador
- Marcado rápido "Asistió / Faltó" con observaciones
- Guardado por lotes (toda la clase)
- Exportación Excel (`Asistencia_Natacion.csv`) con encabezados exactos
- Reporte mensual con % de asistencia

### Módulo B — Historial del Alumno
- Registro completo de nadadores con ID único (Cédula-Sufijo)
- Vista de perfil con calendario de asistencia mensual
- Historial de pagos
- **Planilla de Promoción de Nivel** (Niveles I-IV con checkboxes En Proc / Logrado)
- Impresión de perfil en PDF

### Módulo C — Facturación y Caja
- Registro de pagos con múltiples formas de pago
- Desglose: Débito, Transferencia, Bolívares, Efectivo Divisa
- **Ticket de pago** imprimible
- Reporte de caja diaria con cierre en Bs y USD
- Exportación CSV para Saint Enterprise (ACLIST y AARRECP)

### Módulo D — Alquileres de Espacios
- Calendario visual mensual con código de colores
- Horarios permitidos validados automáticamente:
  - L-V: 6:00 PM — 11:00 PM
  - S-D: 9:00 PM — 11:00 PM
- Detección de conflictos de horario
- Estados: Pagado (verde), Abonado (amarillo), Reservado (rojo), Reprogramado (azul)

### Módulo E — Administración y Seguridad
- Gestión completa de usuarios con roles
- Sistema de permisos (Solo Consultar / Modificar / Registrar)
- Configuración del sistema (nombre academia, RIF, tasa del día)
- Cambio de contraseña

---

## 🌐 Acceso en Red

El sistema funciona como un servidor local. Para acceder desde otros PCs:

1. Inicie el servidor en el **PC principal** (servidor)
2. El `iniciar.bat` muestra la **IP de red** automáticamente
3. En los demás PCs, abra el navegador y escriba: `http://[IP]:3000`

---

## 📊 Mapeo con Saint Enterprise

### ACLIST (Clientes)
- `ID_Cliente` = Cédula/RIF del representante
- Exportar desde: **Facturación → Exportar ACLIST**

### AARRECP (Cuentas por Cobrar)
- `ID_Factura` = Cédula + Mes + Año (Ej: V12345678-0726)
- Exportar desde: **Facturación → Exportar AARRECP**

---

## 📁 Estructura del Proyecto

```
natacion-sistema/
├── instalar.bat       ← Instalador (ejecutar 1 sola vez)
├── iniciar.bat        ← Iniciar el sistema
├── server.js          ← Servidor Express
├── natacion.db        ← Base de datos SQLite (se crea automáticamente)
├── database/
│   ├── schema.sql     ← Estructura de la DB
│   └── db.js          ← Conexión y helpers
├── routes/            ← API del backend
└── public/            ← Interfaz web (HTML, CSS, JS)
```

---

## 🆘 Solución de Problemas

**"No se puede conectar"**
→ Verifique que el servidor esté corriendo (el `iniciar.bat` debe estar abierto)

**"Error de Node.js no encontrado"**
→ Instale Node.js desde https://nodejs.org y reinicie el equipo

**"No puedo acceder desde otra PC"**
→ Verifique que ambas PCs estén en la misma red WiFi o LAN
→ En la PC donde corre el servidor, la primera vez que inicia puede aparecer un aviso de "Firewall de Windows Defender" pidiendo permiso para Node.js — debe presionar "Permitir acceso" (al menos para redes privadas). Si ya lo bloqueó por error, vaya a Panel de Control → Firewall de Windows Defender → "Permitir una aplicación" y habilite Node.js para redes privadas.

**Olvidé la contraseña del admin**
→ Borre el archivo `natacion.db` y reinicie (perderá todos los datos, haga respaldo antes)

---

*v1.0.0 — Sistema Academia de Natación*
