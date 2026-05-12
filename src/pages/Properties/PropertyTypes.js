import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { PROPERTY_TYPES } from '../../constants';
import toast from 'react-hot-toast';

const PropertyTypes = () => {
  const [propertyTypes, setPropertyTypes] = useState(PROPERTY_TYPES);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({ value: '', label: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTypes = propertyTypes.filter(type =>
    type.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingType) {
      setPropertyTypes(prev => prev.map(type => 
        type.value === editingType.value 
          ? { ...formData }
          : type
      ));
      toast.success('Property type updated successfully');
    } else {
      if (propertyTypes.some(type => type.value === formData.value)) {
        toast.error('Property type already exists');
        return;
      }
      setPropertyTypes(prev => [...prev, formData]);
      toast.success('Property type added successfully');
    }
    
    setShowModal(false);
    setEditingType(null);
    setFormData({ value: '', label: '' });
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData(type);
    setShowModal(true);
  };

  const handleDelete = (typeValue) => {
    if (window.confirm('Are you sure you want to delete this property type?')) {
      setPropertyTypes(prev => prev.filter(type => type.value !== typeValue));
      toast.success('Property type deleted successfully');
    }
  };

  const openAddModal = () => {
    setEditingType(null);
    setFormData({ value: '', label: '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Property Types</h1>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} />
          Add Type
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search property types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Property Types Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Value</th>
                <th>Label</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTypes.map(type => (
                <tr key={type.value}>
                  <td>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {type.value}
                    </code>
                  </td>
                  <td className="font-medium">{type.label}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleEdit(type)}
                        className="action-btn edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(type.value)}
                        className="action-btn delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingType ? 'Edit Property Type' : 'Add Property Type'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Value *</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="form-input"
                  placeholder="e.g., apartment"
                  required
                  disabled={editingType}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lowercase, no spaces (used in code)
                </p>
              </div>
              
              <div className="form-group">
                <label className="form-label">Label *</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  className="form-input"
                  placeholder="e.g., Apartment"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Display name for users
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingType ? 'Update' : 'Add'} Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTypes;