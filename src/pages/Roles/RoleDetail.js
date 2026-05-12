import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Shield, Users, Calendar, Activity, Check, X } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const RoleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRole();
  }, [id]);

  const loadRole = async () => {
    try {
      const roleData = await APIService.getRoleById(id);
      if (roleData) {
        setRole(roleData);
      } else {
        toast.error('Role not found');
        navigate('/admin/roles');
      }
    } catch (error) {
      toast.error('Failed to load role');
      navigate('/roles');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: status === 'active' ? '#10b98120' : '#ef444420',
          color: status === 'active' ? '#10b981' : '#ef4444'
        }}
      >
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      }`}>
        {type}
      </span>
    );
  };



  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Role not found</h3>
        <button 
          onClick={() => navigate('/admin/roles')}
          className="btn btn-primary"
        >
          Back to Roles
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/roles')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to Roles
          </button>
          <h1 className="page-title">Role Details</h1>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
          >
            <Edit size={16} />
            Edit Role
          </button>
        </div>
      </div>

      {/* Role Profile Card */}
      <div className="card">
        <div className="user-profile-header">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h2 className="user-name">{role.name}</h2>
              <div className="user-meta">
                <div className="flex items-center gap-4 mb-2">
                  {getTypeBadge(role.type)}
                  {getStatusBadge(role.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{role.userCount || 0} users assigned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Created {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield size={20} className="inline mr-2" />
              Basic Information
            </h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Role Name</label>
                <span className="info-value">{role.name}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Role ID</label>
                <span className="info-value">#{role.id}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Type</label>
                <span className="info-value">{getTypeBadge(role.type)}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Status</label>
                <span className="info-value">{getStatusBadge(role.status)}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Description</label>
                <span className="info-value">{role.description || 'No description provided'}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Users Assigned</label>
                <span className="info-value font-semibold">{role.userCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={20} className="inline mr-2" />
              Statistics
            </h3>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div 
                className="stat-item cursor-pointer hover:bg-gray-50 rounded-lg p-3 transition-colors"
                onClick={() => navigate(`/admin/users?roleId=${role.id}`)}
                title="View assigned users"
              >
                <div className="stat-value text-blue-600">{role.userCount || 0}</div>
                <div className="stat-label">Users Assigned</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {role.permissions ? Object.values(role.permissions).reduce((total, perms) => 
                    total + Object.values(perms).filter(p => p === true).length, 0
                  ) : 0}
                </div>
                <div className="stat-label">Total Permissions</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {role.createdAt ? Math.floor((new Date() - new Date(role.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
                </div>
                <div className="stat-label">Days Since Created</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Details */}
      {role.permissions && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Shield size={20} className="inline mr-2" />
              Permission Details
            </h3>
          </div>
          <div className="card-content">
            <div className="data-table-container">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>View</th>
                      <th>Create/Edit</th>
                      <th>Delete</th>
                      <th>Manage</th>
                      <th>Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="font-medium">Dashboard</span></td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.dashboard?.view ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center text-gray-400">-</td>
                    </tr>
                    <tr>
                      <td><span className="font-medium">Users</span></td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.users?.view ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.users?.edit ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.users?.delete ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center text-gray-400">-</td>
                    </tr>
                    <tr>
                      <td><span className="font-medium">Properties</span></td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.properties?.view ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.properties?.edit ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.properties?.delete ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-1">
                          {role.permissions.properties?.approve ? 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full" title="Approve">
                              <Check size={12} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full" title="Approve">
                              <X size={12} />
                            </span>
                          }
                          {role.permissions.properties?.reject ? 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full" title="Reject">
                              <Check size={12} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full" title="Reject">
                              <X size={12} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center text-gray-400">-</td>
                    </tr>
                    <tr>
                      <td><span className="font-medium">Transactions</span></td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.transactions?.view ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.transactions?.manage ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.transactions?.export ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><span className="font-medium">Promotions</span></td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-1">
                          {role.permissions.promotions?.create ? 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full" title="Create">
                              <Check size={12} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full" title="Create">
                              <X size={12} />
                            </span>
                          }
                          {role.permissions.promotions?.edit ? 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full" title="Edit">
                              <Check size={12} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full" title="Edit">
                              <X size={12} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.promotions?.delete ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.promotions?.deactivate ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center text-gray-400">-</td>
                    </tr>
                    <tr>
                      <td><span className="font-medium">Reports</span></td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.reports?.view ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center text-gray-400">-</td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          {role.permissions.reports?.export ? 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <Check size={14} />
                            </span> : 
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <X size={14} />
                            </span>
                          }
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Settings Access */}
            {role.permissions.settings && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Settings Access</h4>
                <div className="flex items-center gap-2">
                  {role.permissions.settings.full && (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-900">Full Access</span>
                      <span className="text-sm text-gray-500">- Complete control over system settings</span>
                    </>
                  )}
                  {role.permissions.settings.limited && (
                    <>
                      <Check size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900">Limited Access</span>
                      <span className="text-sm text-gray-500">- Access to basic settings only</span>
                    </>
                  )}
                  {role.permissions.settings.none && (
                    <>
                      <X size={16} className="text-red-600" />
                      <span className="text-sm font-medium text-gray-900">No Access</span>
                      <span className="text-sm text-gray-500">- Cannot access any settings</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDetail;