import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, PROPERTY_STATUS } from '../../constants';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: '',
    category: '',
    status: 'pending_approval',
    price: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    lotSize: '',
    yearBuilt: '',
    parking: '',
    features: [],
    images: [],
    agentId: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});

  const commonFeatures = [
    'Swimming Pool', 'Garage', 'Garden', 'Balcony', 'Fireplace',
    'Air Conditioning', 'Heating', 'Hardwood Floors', 'Updated Kitchen',
    'Walk-in Closet', 'Laundry Room', 'Security System', 'Gym',
    'Elevator', 'Terrace', 'Storage', 'Pet Friendly'
  ];

  useEffect(() => {
    if (isEdit) {
      loadProperty();
    }
  }, [isEdit, id]);

  const loadProperty = async () => {
    try {
      const property = await APIService.getPropertyById(id);
      if (property) {
        setFormData({
          ...property,
          price: property.price.toString(),
          bedrooms: property.bedrooms.toString(),
          bathrooms: property.bathrooms.toString(),
          area: property.area.toString(),
          lotSize: property.lotSize || '',
          yearBuilt: property.yearBuilt || '',
          parking: property.parking || '',
          features: property.features || []
        });
        setExistingImages(property.images || []);
      }
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/admin/properties');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleAddCustomFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.listingType) newErrors.listingType = 'Listing type is required';
    if (!formData.category) newErrors.category = 'Property category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (imageFiles.length === 0 && existingImages.length === 0) newErrors.images = 'At least one property image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        location: `${formData.city}, ${formData.state}`,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseInt(formData.area) || 0,
        lotSize: parseInt(formData.lotSize) || 0,
        yearBuilt: parseInt(formData.yearBuilt) || null,
        parking: parseInt(formData.parking) || 0,
        images: [...existingImages, ...imageFiles.map(file => URL.createObjectURL(file))],
        agent: 'Admin User',
        agentName: 'Admin User',
        views: formData.views || 0,
        inquiries: formData.inquiries || 0
      };
      
      if (isEdit) {
        await APIService.updateProperty(id, propertyData);
        toast.success('Property updated successfully!');
      } else {
        await APIService.createProperty(propertyData);
        toast.success('Property created successfully!');
      }
      
      navigate('/admin/properties');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/properties')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="page-title">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Information */}
        <div className="form-container" style={{marginBottom: '3rem'}}>
          <div className="form-header">
            <h2 className="form-title">Basic Information</h2>
          </div>
          
          <div className="form-grid" style={{marginTop: '1.5rem'}}>
            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter property title"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Listing Type *</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select listing type</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Property Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select category</option>
                {PROPERTY_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                {PROPERTY_STATUS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter price"
                required
              />
            </div>
          </div>
          
          <div className="form-group" style={{marginTop: '1.5rem'}}>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              placeholder="Enter property description"
            />
          </div>
        </div>

        {/* Location */}
        <div className="form-container" style={{marginBottom: '3rem'}}>
          <div className="form-header">
            <h2 className="form-title">Location</h2>
          </div>
          
          <div className="form-grid" style={{marginTop: '1.5rem'}}>
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter street address"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter city"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter state"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter ZIP code"
                required
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="form-container" style={{marginBottom: '3rem'}}>
          <div className="form-header">
            <h2 className="form-title">Property Details</h2>
          </div>
          
          <div className="form-grid" style={{marginTop: '1.5rem'}}>
            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="form-input"
                placeholder="Number of bedrooms"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="form-input"
                placeholder="Number of bathrooms"
                min="0"
                step="0.5"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Area (sq ft)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="form-input"
                placeholder="Property area"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Lot Size (sq ft)</label>
              <input
                type="number"
                name="lotSize"
                value={formData.lotSize}
                onChange={handleChange}
                className="form-input"
                placeholder="Lot size"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Year Built</label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                className="form-input"
                placeholder="Year built"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Parking Spaces</label>
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                className="form-input"
                placeholder="Number of parking spaces"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="form-container" style={{marginBottom: '3rem'}}>
          <div className="form-header">
            <h2 className="form-title">Features & Amenities</h2>
          </div>
          
          <div className="space-y-4" style={{marginTop: '1.5rem'}}>
            {/* Common Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Custom Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Add Custom Feature</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="form-input flex-1"
                  placeholder="Enter custom feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomFeature())}
                />
                <button
                  type="button"
                  onClick={handleAddCustomFeature}
                  className="btn btn-secondary"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
            
            {/* Selected Features */}
            {formData.features.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Features</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map(feature => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="form-container" style={{marginBottom: '3rem'}}>
          <div className="form-header">
            <h2 className="form-title">Property Images *</h2>
          </div>
          
          <div className="space-y-4" style={{marginTop: '1.5rem'}}>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                <label htmlFor="images" className="cursor-pointer text-blue-600 hover:text-blue-500">
                  Click to upload
                </label>
                <span> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB (Required)</p>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                required={!isEdit}
              />
            </div>
            {errors.images && <p style={{color: 'red'}} className="text-sm mt-1">{errors.images}</p>}
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                <div className="flex gap-2 overflow-x-auto mb-4">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images */}
            {imageFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">New Images</h3>
                <div className="flex gap-2 overflow-x-auto">
                  {imageFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-container" style={{marginBottom: '3rem'}}>
          <div className="form-header">
            <h2 className="form-title">Contact Information</h2>
          </div>
          
          <div className="form-grid" style={{marginTop: '1.5rem'}}>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter contact email"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter contact phone"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              isEdit ? 'Update Property' : 'Create Property'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;