@echo off
echo ========================================
echo  ShadeSphere AI Theme Generator
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Check if package.json exists
if not exist package.json (
    echo ❌ package.json not found
    echo Please make sure you're in the correct directory
    pause
    exit /b 1
)

REM Check if node_modules exists, if not install dependencies
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found
    echo Creating .env from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file and add your OpenAI API key
    echo    The server will work with fallback themes if no API key is provided
    echo.
)

echo 🚀 Starting ShadeSphere AI Theme Generator...
echo.
echo 📍 Server will be available at: http://localhost:3000
echo 🎨 Theme Generator: http://localhost:3000/theme-generator.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start