# Network Configuration Guide

This guide will help you run the Real Estate Admin Panel on another system using an IP address.

## Configuration Files Created

### 1. `.env` file
Contains environment variables for network configuration:
- `HOST=0.0.0.0` - Allows connections from any IP address
- `PORT=3000` - Default port (can be changed)
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Disables host checking for development

### 2. Updated `package.json`
Added new scripts for network access:
- `start:network` - For Unix/Linux/Mac systems
- `start:host` - For Windows systems

## How to Run on Network

### Method 1: Using Environment Variables (Recommended)
Since the `.env` file is configured, simply run:
```bash
npm start
```

### Method 2: Using Specific Scripts

**For Windows:**
```bash
npm run start:host
```

**For Mac/Linux:**
```bash
npm run start:network
```

### Method 3: Manual Command
```bash
# Windows
set HOST=0.0.0.0 && npm start

# Mac/Linux
HOST=0.0.0.0 npm start
```

## Finding Your IP Address

### Windows:
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

### Mac/Linux:
```bash
ifconfig
# or
ip addr show
```

## Accessing from Other Devices

Once the server is running, you'll see output like:
```
Local:            http://localhost:3000
On Your Network:  http://192.168.1.100:3000
```

Other devices on the same network can access the application using:
```
http://YOUR_IP_ADDRESS:3000
```

Example: `http://192.168.1.100:3000`

## Firewall Configuration

### Windows Firewall:
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change Settings" then "Allow another app"
4. Browse to Node.js executable or add port 3000
5. Check both "Private" and "Public" networks

### Mac Firewall:
1. System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Add Node.js or allow incoming connections

### Linux (Ubuntu/Debian):
```bash
sudo ufw allow 3000
```

## Troubleshooting

### Common Issues:

1. **Cannot access from other devices:**
   - Check firewall settings
   - Ensure devices are on the same network
   - Verify the IP address is correct

2. **Port already in use:**
   - Change PORT in `.env` file to another port (e.g., 3001, 8080)
   - Or kill the process using the port

3. **Network not showing in terminal:**
   - Try restarting the development server
   - Check network adapter settings

### Alternative Ports:
If port 3000 is busy, update `.env`:
```
PORT=3001
```
Then access via: `http://YOUR_IP:3001`

## Security Notes

⚠️ **Important:** The `DANGEROUSLY_DISABLE_HOST_CHECK=true` setting is for development only. 
For production deployments, remove this setting and implement proper security measures.

## Production Deployment

For production deployment on a server:

1. Build the application:
```bash
npm run build
```

2. Serve the built files using a web server like Nginx, Apache, or a Node.js server.

3. Configure proper domain names and SSL certificates.

4. Remove development-only settings from environment variables.