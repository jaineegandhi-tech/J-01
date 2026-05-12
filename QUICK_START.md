# Quick Start Guide - Network Access

## 🚀 Easy Setup for Network Access

### Windows Users:
1. **Double-click** `start-network.bat`
2. The script will automatically:
   - Show your IP address
   - Start the server for network access
   - Display the URL for other devices

### Mac/Linux Users:
1. **Open Terminal** in this directory
2. **Run:** `chmod +x start-network.sh` (first time only)
3. **Run:** `./start-network.sh`

### Manual Method:
```bash
# Install dependencies (if not done already)
npm install

# Start with network access
npm start
```

## 📱 Accessing from Other Devices

Once the server starts, you'll see something like:
```
Local:            http://localhost:3000
On Your Network:  http://192.168.1.100:3000
```

**Use the "On Your Network" URL** to access from other devices.

## 🔧 Common Issues & Solutions

### Issue: "Cannot access from phone/tablet"
**Solution:** Check your firewall settings and ensure both devices are on the same WiFi network.

### Issue: "Port 3000 is already in use"
**Solution:** 
1. Edit `.env` file
2. Change `PORT=3000` to `PORT=3001` (or any other port)
3. Restart the server

### Issue: "Network URL not showing"
**Solution:** 
1. Make sure `HOST=0.0.0.0` is in your `.env` file
2. Restart the development server

## 🛡️ Firewall Configuration

### Windows:
- Windows may ask for firewall permission when you first start
- Click "Allow access" for both private and public networks

### Mac:
- Go to System Preferences → Security & Privacy → Firewall
- Allow Node.js or the specific port

## 📋 What's Been Configured

✅ `.env` file created with network settings  
✅ Package.json updated with network scripts  
✅ Batch file for Windows users  
✅ Shell script for Mac/Linux users  
✅ Firewall and troubleshooting guide  

## 🌐 Testing the Setup

1. Start the server using any method above
2. Open the "On Your Network" URL on your computer
3. Try the same URL on another device (phone, tablet, another computer)
4. You should see the Real Estate Admin Panel login page

## 📞 Need Help?

If you encounter issues:
1. Check the `NETWORK_SETUP.md` file for detailed instructions
2. Ensure all devices are on the same network
3. Verify firewall settings
4. Try a different port if 3000 is busy