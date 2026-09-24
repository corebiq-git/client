import React, { useState } from 'react';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  Menu,
  ShieldCheck,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Company, AppUser, NotificationItem } from '../../types';
import { CoreIconButton, CoreButton } from '../common/CoreComponents';

interface HeaderProps {
  companies: Company[];
  activeCompany: Company;
  onSelectCompany: (id: string) => void;
  onNewCompany: () => void;
  currentUser: AppUser;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onToggleSidebar?: () => void;
  onNavigate: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  companies,
  activeCompany,
  onSelectCompany,
  onNewCompany,
  currentUser,
  notifications,
  onOpenNotifications,
  onOpenSearch,
  onToggleSidebar,
  onNavigate
}) => {
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 bg-white border-b border-[#e0e2e6] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(60,64,67,0.04)]">
      {/* Left section: Hamburger (mobile/desktop) + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] p-2 rounded-lg transition-colors cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* COREBIQ Logo */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
            CQ
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none text-[#202124]">
              CORE<span className="text-[#1a73e8]">BIQ</span>
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-[#5f6368] uppercase leading-none mt-0.5">
              Business OS
            </span>
          </div>
        </div>

        {/* Company Switcher Pill */}
        <div className="relative ml-2 sm:ml-4">
          <button
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#3c4043] bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-lg transition-colors cursor-pointer max-w-[180px] sm:max-w-[240px]"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1a73e8] shrink-0" />
            <span className="truncate text-left">{activeCompany?.name || 'Select Company'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#5f6368] shrink-0" />
          </button>

          {showCompanyMenu && (
            <div
              className="absolute left-0 mt-1 w-64 bg-white rounded-xl border border-[#dadce0] shadow-lg py-1.5 z-50 text-xs"
              onClick={() => setShowCompanyMenu(false)}
            >
              <div className="px-3 py-1.5 font-semibold text-[#5f6368] uppercase text-[10px] tracking-wider border-b border-[#f1f3f4]">
                Select Business Workspace
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {companies.map((c) => {
                  const isSelected = c.id === activeCompany?.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onSelectCompany(c.id)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f8f9fa] transition-colors ${
                        isSelected ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium' : 'text-[#202124]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{c.name}</div>
                        <div className="text-[10px] text-[#5f6368] truncate">{c.taxId || c.city}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1a73e8] shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-[#f1f3f4] p-1.5">
                <button
                  onClick={onNewCompany}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-[#1a73e8] hover:bg-[#e8f0fe] rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create / Add Company</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368] rounded-lg text-xs transition-colors border border-transparent hover:border-[#dadce0]"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#5f6368]" />
            <span>Search transactions, customers, invoices, tasks...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#dadce0] rounded text-[#5f6368] shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: Search button (mobile), Notifications, Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="lg:hidden text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] p-2 rounded-lg transition-colors cursor-pointer"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className="text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] p-2 rounded-lg transition-colors cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d93025] rounded-full" />
            )}
          </button>
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#f1f3f4] transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#dadce0]"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-[#202124] leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#5f6368] leading-tight flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#1e8e3e]" />
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5f6368] hidden md:block" />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-1 w-56 bg-white rounded-xl border border-[#dadce0] shadow-lg py-2 z-50 text-xs"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="px-4 py-2 border-b border-[#f1f3f4]">
                <div className="font-semibold text-[#202124]">{currentUser.name}</div>
                <div className="text-[11px] text-[#5f6368] truncate">{currentUser.email}</div>
                <div className="mt-1 inline-block text-[10px] font-medium text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded">
                  Role: {currentUser.role}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => onNavigate('company')}
                  className="w-full px-4 py-2 text-left hover:bg-[#f8f9fa] text-[#3c4043]"
                >
                  Company Profile & Settings
                </button>
                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full px-4 py-2 text-left hover:bg-[#f8f9fa] text-[#3c4043]"
                >
                  System & User Preferences
                </button>
                <button
                  onClick={() => onNavigate('data')}
                  className="w-full px-4 py-2 text-left hover:bg-[#f8f9fa] text-[#3c4043]"
                >
                  Data Backup & Activity Log
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
