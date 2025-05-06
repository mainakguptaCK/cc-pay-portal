import React from 'react';
import { Bell, X } from 'lucide-react';
import { PortalNotice } from '../../types';

interface NoticeAlertProps {
  notice: PortalNotice;
  onClose: () => void;
}

const NoticeAlert: React.FC<NoticeAlertProps> = ({ notice, onClose }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-700 p-4 mb-6 rounded-md shadow-sm relative">
      <div className="flex">
        <div className="flex-shrink-0">
          <Bell size={18} className="text-blue-700" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-900">{notice.title}</h3>
          <div className="mt-1 text-sm text-blue-700">
            <p>{notice.content}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-600 focus:outline-none transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NoticeAlert;