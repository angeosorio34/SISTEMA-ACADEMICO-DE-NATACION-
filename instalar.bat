@echo off
chcp 65001 > nul
color 0B
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        INSTALADOR - SISTEMA ACADEMIA DE NATACIÓN           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Verificar si Node.js está instalado
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠  Node.js no está instalado.
    echo.
    echo    Por favor instale Node.js desde:
    echo    https://nodejs.org  (descargue la versión LTS)
    echo.
    echo    Luego vuelva a ejecutar este archivo.
    echo.
    pause
    start https://nodejs.org
    exit /b 1
)

echo ✓ Node.js detectado:
node --version
echo.

:: Ir al directorio del script
cd /d "%~dp0"

echo ► Instalando dependencias (puede tomar 1-2 minutos)...
echo.
npm install

if %errorlevel% neq 0 (
    echo.
    echo ✗ Error al instalar dependencias.
    echo   Verifique su conexión a internet e intente de nuevo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  ✓ INSTALACIÓN COMPLETA                   ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║  Para iniciar el sistema, ejecute:  iniciar.bat           ║
echo ║                                                            ║
echo ║  Credenciales por defecto:                                 ║
echo ║  Usuario:     admin                                        ║
echo ║  Contraseña:  admin123                                     ║
echo ║                                                            ║
echo ║  ⚠ Cambie la contraseña al primer inicio de sesión        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
