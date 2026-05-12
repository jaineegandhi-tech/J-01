# Real-Time Data Synchronization Setup

This document explains how to set up real-time data synchronization between the Admin Panel and User App.

## Architecture Overview

```
Admin Panel (Port 3000) ←→ WebSocket Server (Port 3001) ←→ User App (Port 3002)
```

## Components

### 1. Shared Services (`/shared-services/`)
- **WebSocket Server**: Handles real-time communication
- **Shared API**: Common API service for both applications
- **Event Broadcasting**: Notifies all connected clients of data changes

### 2. Admin Panel Integration
- Broadcasts changes when agents/properties are created/updated
- Uses shared API service for consistent data handling

### 3. User App Integration
- Subscribes to real-time updates via WebSocket
- Automatically updates UI when data changes
- Shows toast notifications for live updates

## Setup Instructions

### 1. Install Dependencies

```bash
# Install shared services dependencies
cd shared-services
npm install

# Install user app dependencies (if not already done)
cd ../user-app
npm install
```

### 2. Start the WebSocket Server

```bash
cd shared-services
npm start
```

This starts the WebSocket server on port 3001.

### 3. Start Admin Panel

```bash
# From the main directory
npm start
```

Admin panel runs on port 3000.

### 4. Start User App

```bash
cd user-app
npm start
```

User app runs on port 3002 (or next available port).

## Real-Time Events

### Agent Events
- `AGENT_CREATED`: New agent added in admin panel → appears in user app
- `AGENT_UPDATED`: Agent profile updated → reflects in user app instantly

### Property Events
- `PROPERTY_CREATED`: New property listed → shows in agent's active listings
- `PROPERTY_UPDATED`: Property details changed → updates in real-time

### User Events
- `USER_CREATED`: New user registered → updates user counts

## Data Flow

1. **Admin Action**: Admin creates/updates agent in admin panel
2. **API Call**: Admin panel calls shared API service
3. **Database Update**: Data is saved to database
4. **WebSocket Broadcast**: Server broadcasts change to all connected clients
5. **User App Update**: User app receives update and refreshes UI
6. **Notification**: User sees toast notification about the change

## Testing Real-Time Sync

1. Open Admin Panel in one browser tab
2. Open User App in another browser tab
3. Create a new agent in Admin Panel
4. Watch the agent appear instantly in User App
5. Update agent details in Admin Panel
6. See changes reflect immediately in User App

## Configuration

### WebSocket Server Settings
- **Port**: 3001 (configurable in `websocket-server.js`)
- **Reconnection**: Auto-reconnect with exponential backoff
- **Max Clients**: Unlimited (can be configured)

### API Endpoints
- **Base URL**: `http://localhost:3001/api`
- **WebSocket URL**: `ws://localhost:3001/ws`

## Error Handling

### Connection Issues
- Auto-reconnection with retry logic
- Graceful degradation when WebSocket is unavailable
- Fallback to manual refresh if real-time fails

### Data Consistency
- Optimistic updates with rollback on failure
- Conflict resolution for simultaneous edits
- Data validation on both client and server

## Production Deployment

### Environment Variables
```bash
# WebSocket Server
WS_PORT=3001
API_BASE_URL=https://your-api.com

# Admin Panel
REACT_APP_WS_URL=wss://your-websocket.com
REACT_APP_API_URL=https://your-api.com

# User App
REACT_APP_WS_URL=wss://your-websocket.com
REACT_APP_API_URL=https://your-api.com
```

### Security Considerations
- Implement authentication for WebSocket connections
- Validate all incoming messages
- Rate limiting for WebSocket events
- CORS configuration for cross-origin requests

## Monitoring

### WebSocket Health
- Connection count monitoring
- Message throughput tracking
- Error rate monitoring
- Reconnection statistics

### Performance Metrics
- Message delivery latency
- Client connection duration
- Memory usage tracking
- CPU utilization monitoring

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if port 3001 is available
   - Verify firewall settings
   - Ensure WebSocket server is running

2. **Updates Not Syncing**
   - Check browser console for WebSocket errors
   - Verify admin panel is using shared API
   - Confirm event types match between sender/receiver

3. **Performance Issues**
   - Monitor WebSocket message frequency
   - Check for memory leaks in event listeners
   - Optimize data payload sizes

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'websocket');
```

## Future Enhancements

- **Message Queuing**: Implement Redis for message persistence
- **Horizontal Scaling**: Support multiple WebSocket server instances
- **Advanced Filtering**: Subscribe to specific data types only
- **Offline Support**: Queue updates when connection is lost
- **Real-time Analytics**: Live dashboard metrics and charts