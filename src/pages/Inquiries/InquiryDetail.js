import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import APIService from '../../services/api';
import toast from 'react-hot-toast';

const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');

  useEffect(() => {
    loadInquiry();
    window.scrollTo(0, 0);
  }, [id]);

  const loadInquiry = async () => {
    try {
      const data = await APIService.getInquiryById(id);
      setInquiry(data);
    } catch (error) {
      toast.error('Failed to load inquiry details');
      navigate('/inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await APIService.updateInquiry(id, { status: newStatus });
      setInquiry(prev => ({ ...prev, status: newStatus }));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSendResponse = async () => {
    if (!response.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    try {
      await APIService.updateInquiry(id, { 
        status: 'Responded',
        response: response,
        respondedAt: new Date().toISOString()
      });
      setInquiry(prev => ({ 
        ...prev, 
        status: 'Responded',
        response: response,
        respondedAt: new Date().toISOString()
      }));
      setResponse('');
      toast.success('Response sent successfully');
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Inquiry not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/inquiries')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to Inquiries
          </button>
          <h1 className="page-title">Inquiry Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Inquiry Information</h2>
              <span className="text-sm text-gray-500">ID: #{inquiry.id.toString().padStart(3, '0')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{inquiry.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{inquiry.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{inquiry.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Property</p>
                    <p className="font-medium">{inquiry.property}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Inquiry Date</p>
                    <p className="font-medium">{new Date(inquiry.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AlertCircle className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <span className={`status-badge ${
                      inquiry.priority === 'High' ? 'bg-red-100 text-red-800' :
                      inquiry.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Inquiry Message</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{inquiry.message}</p>
            </div>
          </div>

          {inquiry.status !== 'Closed' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Send Response</h3>
              <div className="space-y-4">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="form-textarea"
                  rows={4}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSendResponse}
                    className="btn btn-primary"
                  >
                    <Mail size={16} />
                    Send Response
                  </button>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="btn btn-secondary"
                  >
                    <Mail size={16} />
                    Open Email Client
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Status Management</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <span className={`status-badge ${
                  inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                  inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                  inquiry.status === 'Responded' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {inquiry.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatus('Contacted')}
                    className="btn btn-sm btn-outline"
                    disabled={inquiry.status === 'Contacted'}
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => updateStatus('Responded')}
                    className="btn btn-sm btn-outline"
                    disabled={inquiry.status === 'Responded'}
                  >
                    Mark Responded
                  </button>
                  <button
                    onClick={() => updateStatus('Closed')}
                    className="btn btn-sm btn-outline"
                    disabled={inquiry.status === 'Closed'}
                  >
                    Close Inquiry
                  </button>
                  <button
                    onClick={() => updateStatus('New')}
                    className="btn btn-sm btn-outline"
                    disabled={inquiry.status === 'New'}
                  >
                    Reset to New
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Inquiry Type</h3>
            <div className="flex items-center gap-3">
              <MessageSquare className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <span className={`status-badge ${
                  inquiry.type === 'Sale' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {inquiry.type}
                </span>
              </div>
            </div>
          </div>

          {inquiry.response && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Previous Response</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm text-green-600">
                    Responded on {new Date(inquiry.respondedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{inquiry.response}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;