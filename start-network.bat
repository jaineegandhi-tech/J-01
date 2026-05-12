@echo off
echo Starting Real Estate Admin Panel for Network Access...
echo.
echo This will start the server on all network interfaces.
echo Other devices on your network will be able to access the application.
echo.
echo Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set ip=%%a
    set ip=!ip: =!
    echo Your IP Address: !ip!
    echo.
    echo Other devices can access the app at: http://!ip!:3000
    echo.
)

echo Starting server...
echo.
set HOST=0.0.0.0
npm start

pause