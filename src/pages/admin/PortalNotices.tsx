import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PortalNotice } from '../../types';

const PortalNotices: React.FC = () => {
  const [portalNotices, setPortalNotices] = useState<PortalNotice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<PortalNotice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetch('https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/admin/getAllAlertNotifications')
      .then(res => res.json())
      .then(data => {
        if (data.alerts) {
          const mappedNotices = data.alerts.map((alert: any) => ({
            id: alert.AlertID,
            title: alert.AlertType,
            content: alert.AlertMessage,
            startDate: alert.AlertStartDate,
            endDate: alert.AlertEndDate,
            isActive: alert.Status === 'Active'
          }));
          setPortalNotices(mappedNotices);
        }
      })
      .catch(err => {
        console.error('Failed to fetch portal notices:', err);
      });
  }, []);

  const handleEditClick = (notice: PortalNotice) => {
    setSelectedNotice(notice);
    setForm({
      title: notice.title,
      content: notice.content,
      startDate: notice.startDate.split('T')[0],
      endDate: notice.endDate.split('T')[0],
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (selectedNotice) {
      const updatedNotice: PortalNotice = {
        ...selectedNotice,
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };

      const updatedList = portalNotices.map(n => (n.id === selectedNotice.id ? updatedNotice : n));
      setPortalNotices(updatedList);
      setIsEditing(false);
    }
  };

  const handleCreateNotice = async () => {
    const payload = {
      AlertType: form.title,
      AlertMessage: form.content,
      AlertStartDate: new Date(form.startDate).toISOString(),
      AlertEndDate: new Date(form.endDate).toISOString(),
      DeliveryChannel: 'PortalAlert',
      Status: 'Active',
    };

    try {
      const response = await fetch('https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/admin/createAlertNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newId = Date.now(); // Placeholder ID until server returns created resource
        const newNotice: PortalNotice = {
          id: newId,
          title: payload.AlertType,
          content: payload.AlertMessage,
          startDate: payload.AlertStartDate,
          endDate: payload.AlertEndDate,
          isActive: payload.Status === 'Active',
        };

        setPortalNotices([newNotice, ...portalNotices]);
        setIsCreating(false);
        setForm({ title: '', content: '', startDate: '', endDate: '' });
      } else {
        console.error('Failed to create alert');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Portal Notices</h1>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setIsCreating(true);
            setIsEditing(false);
            setSelectedNotice(null);
            setForm({ title: '', content: '', startDate: '', endDate: '' });
          }}
        >
          Create New Notice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Active Notices</h2>
              <div className="bg-blue-100 p-2 rounded-full">
                <Bell size={18} className="text-blue-700" />
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-200">
                {portalNotices.map(notice => (
                  <div
                    key={notice.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      selectedNotice?.id === notice.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{notice.title}</h3>
                          <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notice.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notice.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notice.content}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {new Date(notice.startDate).toLocaleDateString()} - {new Date(notice.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit size={14} />}
                          onClick={() => handleEditClick(notice)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash2 size={14} />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Create/Edit Form */}
        <div>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {isCreating ? 'Create Notice' : isEditing ? 'Edit Notice' : 'Notice Details'}
              </h2>
            </CardHeader>
            <CardBody>
              {(isCreating || isEditing) ? (
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    fullWidth
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Start Date"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    fullWidth
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    fullWidth
                  />
                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={isCreating ? handleCreateNotice : handleSave}
                    >
                      {isCreating ? 'Create' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : selectedNotice ? (
                <div>
                  <h3 className="font-medium text-gray-900">{selectedNotice.title}</h3>
                  <p className="mt-2 text-gray-600">{selectedNotice.content}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-500">
                      Start Date: {new Date(selectedNotice.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      End Date: {new Date(selectedNotice.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className={selectedNotice.isActive ? 'text-green-600' : 'text-gray-600'}>
                        {selectedNotice.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Bell size={32} className="mx-auto mb-3 text-gray-400" />
                  <p>Select a notice to view details</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortalNotices;
