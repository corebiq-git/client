import React from 'react';
import { X, CheckCheck, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { NotificationItem } from '../../types';
import { storage } from '../../services/storage';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNavigate: (module: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  open,
  onClose,
  notifications,
  onNavigate
}) => {
  if (!open) return null;

  const handleMarkAll = () => {
    storage.markAllNotificationsRead();
  };

  const handleItemClick = (item: NotificationItem) => {
    storage.markNotificationRead(item.id);
    if (item.linkModule) {
      onNavigate(item.linkModule);
      onClose();
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#1e8e3e]" />;
      case 'warning':
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#d93025]" />;
      default:
        return <Info className="w-4 h-4 text-[#1a73e8]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 border-l border-[#dadce0]">
        {/* Header */}
        <div className="p-4 border-b border-[#e0e2e6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1a73e8]" />
            <h3 className="text-sm font-semibold text-[#202124]">Notifications</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleMarkAll}
              title="Mark all as read"
              className="text-[#5f6368] hover:text-[#1a73e8] p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-[#f1f3f4] cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#5f6368] hover:text-[#202124] p-1.5 rounded-lg hover:bg-[#f1f3f4] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f1f3f4]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5f6368]">No notifications. You are all caught up!</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-4 transition-colors cursor-pointer hover:bg-[#f8f9fa] flex items-start gap-3 ${
                  !item.read ? 'bg-[#f1f8ff]/50' : 'bg-white'
                }`}
              >
                <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#202124] truncate">{item.title}</span>
                    <span className="text-[10px] text-[#80868b] shrink-0 ml-2">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#5f6368] mt-1 leading-snug">{item.message}</p>
                </div>
                {!item.read && <span className="w-2 h-2 rounded-full bg-[#1a73e8] shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
