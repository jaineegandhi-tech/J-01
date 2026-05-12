import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Monitor, MapPin, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const ActivityLogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const loadActivityLogs = async () => {
    try {
      // Mock data for demonstration
      const mockSessions = [
        {
          id: 1,
          device: 'Chrome on Windows',
          ipAddress: '192.168.1.100',
          loginTime: new Date().toISOString(),
          logoutTime: null,
          status: 'Active',
          location: 'Phnom Penh, Cambodia'
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          ipAddress: '192.168.1.101',
          loginTime: new Date(Date.now() - 86400000).toISOString(),
          logoutTime: new Date(Date.now() - 82800000).toISOString(),
          status: 'Expired',
          location: 'Phnom Penh, Cambodia'
        },
        {
          id: 3,
          device: 'Firefox on Mac',
          ipAddress: '192.168.1.102',
          loginTime: new Date(Date.now() - 172800000).toISOString(),
          logoutTime: new Date(Date.now() - 169200000).toISOString(),
          status: 'Expired',
          location: 'Siem Reap, Cambodia'
        }
      ];
      setSessions(mockSessions);
    } catch (error) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogout = async (sessionId) => {
    if (window.confirm('Are you sure you want to end this session?')) {
      try {
        // Mock API call
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'Terminated', logoutTime: new Date().toISOString() }
            : session
        ));
        toast.success('Session terminated successfully');
      } catch (error) {
        toast.error('Failed to terminate session');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/profile')} className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to Profile
          </button>
          <h1 className="page-title">Activity Logs</h1>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Activity size={20} />
            Login Sessions
          </h2>
        </div>
        <div className="card-content p-0">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Device & Browser</th>
                  <th>IP Address</th>
                  <th>Location</th>
                  <th>Login Time</th>
                  <th>Logout Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Monitor size={16} className="text-gray-400" />
                        <span>{session.device}</span>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{session.ipAddress}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{session.location}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(session.loginTime).toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      {session.logoutTime ? (
                        <span>{new Date(session.logoutTime).toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        session.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : session.status === 'Terminated'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                    </td>
                    <td>
                      {session.status === 'Active' && (
                        <button
                          onClick={() => handleForceLogout(session.id)}
                          className="btn-icon-sm text-red-600 hover:bg-red-50"
                          title="Force Logout"
                        >
                          <LogOut size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Security Information</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="info-item">
              <label className="info-label">Total Active Sessions</label>
              <span className="info-value text-2xl font-bold text-green-600">
                {sessions.filter(s => s.status === 'Active').length}
              </span>
            </div>
            <div className="info-item">
              <label className="info-label">Last Login</label>
              <span className="info-value">
                {sessions.length > 0 ? new Date(sessions[0].loginTime).toLocaleString() : 'Never'}
              </span>
            </div>
            <div className="info-item">
              <label className="info-label">Account Status</label>
              <span className="status-badge bg-green-100 text-green-800">Active</span>
            </div>
            <div className="info-item">
              <label className="info-label">Two-Factor Authentication</label>
              <span className="status-badge bg-yellow-100 text-yellow-800">Not Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;