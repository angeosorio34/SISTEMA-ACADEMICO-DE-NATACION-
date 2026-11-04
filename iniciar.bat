@echo off
chcp 65001 > nul
color 0B
echo.

:: Ir al directorio del script
cd /d "%~dp0"

:: Verificar si está instalado
if not exist "node_modules" (
    echo ⚠ Las dependencias no están instaladas.
    echo   Ejecute primero:  instalar.bat
    echo.
    pause
    exit /b 1
)

:: Obtener IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set LOCAL_IP=%%a
    goto :found_ip
)
:found_ip
set LOCAL_IP=%LOCAL_IP: =%

echo ╔════════════════════════════════════════════════════════════╗
echo ║        SISTEMA ACADEMIA DE NATACIÓN - INICIANDO...        ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  Acceso LOCAL:    http://localhost:3000                    ║
echo ║  Acceso en RED:   http://%LOCAL_IP%:3000              ║
echo ║                                                            ║
echo ║  Comparte la URL de RED con los demás PCs                 ║
echo ║  de la misma red para acceder al sistema.                 ║
echo ║                                                            ║
echo ║  Para detener el servidor presione Ctrl+C                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Abrir el navegador automáticamente
timeout /t 2 /nobreak > nul
start http://localhost:3000

:: Iniciar el servidor
node server.js

pause
