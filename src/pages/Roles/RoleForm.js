import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Shield, Check, X } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'external',
    status: 'active',
    permissions: {
      dashboard: { view: false },
      users: { view: false, edit: false, delete: false },
      properties: { view: false, approve: false, reject: false, edit: false, delete: false },
      transactions: { view: false, manage: false, export: false },
      promotions: { create: false, edit: false, deactivate: false, delete: false },
      reports: { view: false, export: false },
      settings: { full: false, limited: false, none: true }
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadRole();
    }
  }, [id, isEdit]);

  const loadRole = async () => {
    try {
      const role = await APIService.getRoleById(id);
      if (role) {
        setFormData(role);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionChange = (module, permission, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [permission]: checked
        }
      }
    }));
  };

  const handleFullAccess = (checked) => {
    const fullPermissions = {
      dashboard: { view: checked },
      users: { view: checked, edit: checked, delete: checked },
      properties: { view: checked, approve: checked, reject: checked, edit: checked, delete: checked },
      transactions: { view: checked, manage: checked, export: checked },
      promotions: { create: checked, edit: checked, deactivate: checked, delete: checked },
      reports: { view: checked, export: checked },
      settings: { full: checked, limited: false, none: !checked }
    };
    setFormData(prev => ({ ...prev, permissions: fullPermissions }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Role name must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 300) {
      newErrors.description = 'Description must be less than 300 characters';
    }

    const hasPermissions = Object.values(formData.permissions).some(module =>
      Object.values(module).some(permission => permission === true)
    );
    
    if (!hasPermissions) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSaving(true);

    try {
      if (isEdit) {
        await APIService.updateRole(id, formData);
        toast.success('Role updated successfully');
      } else {
        await APIService.createRole(formData);
        toast.success('Role created successfully');
      }
      navigate('/roles');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} role`);
    } finally {
      setSaving(false);
    }
  };

  const isFullAccess = Object.values(formData.permissions).every(module =>
    Object.values(module).every(permission => permission === true)
  );

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/roles')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to Roles
          </button>
          <h1 className="page-title">{isEdit ? 'Edit Role' : 'Create New Role'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter role name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input"
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input ${errors.description ? 'border-red-500' : ''}`}
              rows="3"
              placeholder="Enter role description (optional)"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Permission Matrix</h2>
            <label className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
              <input
                type="checkbox"
                checked={isFullAccess}
                onChange={(e) => handleFullAccess(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Full Access</span>
            </label>
          </div>

          {errors.permissions && <p className="text-red-500 text-sm mb-6">{errors.permissions}</p>}

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Access</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.dashboard.view}
                    onChange={(e) => handlePermissionChange('dashboard', 'view', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">View Dashboard</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.users.view}
                    onChange={(e) => handlePermissionChange('users', 'view', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">View Users</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.users.edit}
                    onChange={(e) => handlePermissionChange('users', 'edit', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Edit Users</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.users.delete}
                    onChange={(e) => handlePermissionChange('users', 'delete', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Delete Users</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.properties.view}
                    onChange={(e) => handlePermissionChange('properties', 'view', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">View Properties</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.properties.edit}
                    onChange={(e) => handlePermissionChange('properties', 'edit', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Edit Properties</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.properties.delete}
                    onChange={(e) => handlePermissionChange('properties', 'delete', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Delete Properties</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.properties.approve}
                    onChange={(e) => handlePermissionChange('properties', 'approve', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Approve Properties</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.properties.reject}
                    onChange={(e) => handlePermissionChange('properties', 'reject', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Reject Properties</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.transactions.view}
                    onChange={(e) => handlePermissionChange('transactions', 'view', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">View Transactions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.transactions.manage}
                    onChange={(e) => handlePermissionChange('transactions', 'manage', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Manage Transactions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.transactions.export}
                    onChange={(e) => handlePermissionChange('transactions', 'export', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Export Data</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Promotions & Discounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.promotions.create}
                    onChange={(e) => handlePermissionChange('promotions', 'create', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Create Promotions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.promotions.edit}
                    onChange={(e) => handlePermissionChange('promotions', 'edit', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Edit Promotions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.promotions.delete}
                    onChange={(e) => handlePermissionChange('promotions', 'delete', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Delete Promotions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.promotions.deactivate}
                    onChange={(e) => handlePermissionChange('promotions', 'deactivate', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Deactivate Promotions</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports & Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.reports.view}
                    onChange={(e) => handlePermissionChange('reports', 'view', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">View Reports</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.reports.export}
                    onChange={(e) => handlePermissionChange('reports', 'export', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Export Reports</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Settings Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="settings"
                  checked={formData.permissions.settings.full}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      settings: { full: true, limited: false, none: false }
                    }
                  }))}
                  className="w-4 h-4 mr-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-base text-gray-900">Full Access</div>
                  <div className="text-sm text-gray-500 mt-1">Complete control</div>
                </div>
              </label>
              <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="settings"
                  checked={formData.permissions.settings.limited}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      settings: { full: false, limited: true, none: false }
                    }
                  }))}
                  className="w-4 h-4 mr-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-base text-gray-900">Limited Access</div>
                  <div className="text-sm text-gray-500 mt-1">Basic settings only</div>
                </div>
              </label>
              <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="settings"
                  checked={formData.permissions.settings.none}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      settings: { full: false, limited: false, none: true }
                    }
                  }))}
                  className="w-4 h-4 mr-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-base text-gray-900">No Access</div>
                  <div className="text-sm text-gray-500 mt-1">Cannot access settings</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/roles')}
            className="btn btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner w-4 h-4 mr-2"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? 'Update Role' : 'Create Role'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;