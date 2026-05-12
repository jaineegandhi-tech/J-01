#!/bin/bash

echo "Starting Real Estate Admin Panel for Network Access..."
echo ""
echo "This will start the server on all network interfaces."
echo "Other devices on your network will be able to access the application."
echo ""

echo "Finding your IP address..."
if command -v ifconfig &> /dev/null; then
    IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
elif command -v ip &> /dev/null; then
    IP=$(ip route get 1 | awk '{print $NF;exit}')
else
    IP="Unable to detect IP"
fi

echo "Your IP Address: $IP"
echo ""
echo "Other devices can access the app at: http://$IP:3000"
echo ""

echo "Starting server..."
echo ""

HOST=0.0.0.0 npm start