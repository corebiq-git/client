import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wrench,
  Menu,
  X,
  UserCheck,
  FileCheck2,
  FileText,
  Building,
  Database,
  BarChart3,
  BadgeDollarSign,
  Settings
} from 'lucide-react';
import { MainNavId } from './Sidebar';

interface MobileBottomNavProps {
  currentModule: MainNavId;
  onNavigate: (module: MainNavId) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentModule,
  onNavigate
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const mainItems: { id: MainNavId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'crm', label: 'CRM', icon: <Users className="w-5 h-5" /> },
    { id: 'accounts', label: 'Accounts', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'tools', label: 'Tools', icon: <Wrench className="w-5 h-5" /> }
  ];

  const drawerItems: { id: MainNavId; label: string; icon: React.ReactNode }[] = [
    { id: 'employees', label: 'Employees', icon: <UserCheck className="w-5 h-5 text-indigo-600" /> },
    { id: 'compliance', label: 'Compliance', icon: <FileCheck2 className="w-5 h-5 text-emerald-600" /> },
    { id: 'templates', label: 'Templates', icon: <FileText className="w-5 h-5 text-amber-600" /> },
    { id: 'company', label: 'Company Profile', icon: <Building className="w-5 h-5 text-sky-600" /> },
    { id: 'data', label: 'Data Management', icon: <Database className="w-5 h-5 text-teal-600" /> },
    { id: 'reports', label: 'Reports Hub', icon: <BarChart3 className="w-5 h-5 text-purple-600" /> },
    { id: 'payments', label: 'Payments & UPI', icon: <BadgeDollarSign className="w-5 h-5 text-blue-600" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 text-slate-600" /> }
  ];

  return (
    <>
      {/* Mobile Drawer Sheet */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowDrawer(false)}
          />
          <div className="fixed inset-x-0 bottom-14 bg-white rounded-t-2xl max-h-[75vh] overflow-y-auto p-4 border-t border-[#dadce0] shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e2e6]">
              <span className="text-sm font-semibold text-[#202124]">All Business Modules</span>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg text-[#5f6368] hover:bg-[#f1f3f4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-4">
              {drawerItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setShowDrawer(false);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                    currentModule === item.id
                      ? 'border-[#1a73e8] bg-[#e8f0fe] font-semibold text-[#1a73e8]'
                      : 'border-[#e0e2e6] bg-[#f8f9fa] hover:bg-white text-[#3c4043]'
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-xs">{item.icon}</div>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="fixed inset-x-0 bottom-0 h-14 bg-white border-t border-[#e0e2e6] flex items-center justify-around z-40 md:hidden shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        {mainItems.map((item) => {
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setShowDrawer(false);
                onNavigate(item.id);
              }}
              className={`flex flex-col items-center justify-center w-14 h-full gap-0.5 transition-colors ${
                isActive ? 'text-[#1a73e8] font-medium' : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#1a73e8] rounded-full" />
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        {/* Menu toggle button */}
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className={`flex flex-col items-center justify-center w-14 h-full gap-0.5 transition-colors ${
            showDrawer ? 'text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>
    </>
  );
};
