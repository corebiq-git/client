import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  FileCheck2,
  FileText,
  Wrench,
  Building,
  Database,
  BarChart3,
  BadgeDollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
  Receipt,
  Landmark,
  Wallet,
  ArrowRightLeft,
  UserSquare2,
  CalendarCheck,
  Clock,
  Sparkles,
  Calculator,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';

export type MainNavId =
  | 'dashboard'
  | 'crm'
  | 'accounts'
  | 'employees'
  | 'compliance'
  | 'templates'
  | 'tools'
  | 'company'
  | 'data'
  | 'reports'
  | 'payments'
  | 'settings';

interface SidebarProps {
  currentModule: MainNavId;
  currentSubTab?: string;
  onNavigate: (module: MainNavId, subTab?: string) => void;
  collapsed: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: MainNavId;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  currentSubTab,
  onNavigate,
  collapsed,
  onCloseMobile
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    crm: true,
    accounts: true
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: <Users className="w-5 h-5 shrink-0" />,
      children: [
        { id: 'customers', label: 'Customers' },
        { id: 'leads', label: 'Leads Pipeline' },
        { id: 'contacts', label: 'Contacts Directory' },
        { id: 'followups', label: 'Follow-ups' },
        { id: 'crm_tasks', label: 'CRM Tasks' }
      ]
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: <CreditCard className="w-5 h-5 shrink-0" />,
      children: [
        { id: 'transactions', label: 'Transactions Register' },
        { id: 'bank_accounts', label: 'Bank Accounts' },
        { id: 'cash_books', label: 'Cash Books' },
        { id: 'invoices', label: 'Invoices' },
        { id: 'receivables', label: 'Receivables' },
        { id: 'payables', label: 'Payables & Bills' },
        { id: 'cheques', label: 'Cheques' },
        { id: 'expenses', label: 'Expenses' },
        { id: 'transfers', label: 'Fund Transfers' }
      ]
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <UserCheck className="w-5 h-5 shrink-0" />,
      children: [
        { id: 'master', label: 'Employee Master' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'leave', label: 'Leave Requests' },
        { id: 'payroll', label: 'Payroll & Salaries' }
      ]
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: <FileCheck2 className="w-5 h-5 shrink-0" />
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <FileText className="w-5 h-5 shrink-0" />
    },
    {
      id: 'tools',
      label: 'Tools & Utilities',
      icon: <Wrench className="w-5 h-5 shrink-0" />,
      children: [
        { id: 'calculator', label: 'Financial Calculator' },
        { id: 'tax_calc', label: 'GST & Tax Calculator' },
        { id: 'date_calc', label: 'Date Calculator' },
        { id: 'payment_qr', label: 'Payment QR Generator' },
        { id: 'csv_tools', label: 'CSV Import & Export' }
      ]
    },
    {
      id: 'company',
      label: 'Company Profile',
      icon: <Building className="w-5 h-5 shrink-0" />
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: <Database className="w-5 h-5 shrink-0" />
    },
    {
      id: 'reports',
      label: 'Reports Hub',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />
    },
    {
      id: 'payments',
      label: 'Payments & UPI',
      icon: <BadgeDollarSign className="w-5 h-5 shrink-0" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />
    }
  ];

  return (
    <aside
      className={`h-[calc(100vh-3.5rem)] bg-white border-r border-[#e0e2e6] transition-all duration-200 flex flex-col justify-between shrink-0 select-none z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="overflow-y-auto py-3 px-2 flex-1 space-y-1">
        {navItems.map((item) => {
          const isCurrent = currentModule === item.id;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openGroups[item.id] ?? false;

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => {
                  if (hasChildren && !collapsed) {
                    toggleGroup(item.id);
                  }
                  onNavigate(item.id, hasChildren ? item.children![0].id : undefined);
                  if (onCloseMobile) onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-semibold'
                    : 'text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#202124]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={isCurrent ? 'text-[#1a73e8]' : 'text-[#5f6368]'}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && hasChildren && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(item.id);
                    }}
                    className="p-1 hover:bg-[#dadce0]/40 rounded cursor-pointer"
                  >
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#5f6368]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#5f6368]" />
                    )}
                  </span>
                )}
              </button>

              {/* Sub items */}
              {!collapsed && hasChildren && isOpen && (
                <div className="pl-9 pr-1 py-0.5 space-y-0.5">
                  {item.children!.map((child) => {
                    const isSubActive = isCurrent && currentSubTab === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => {
                          onNavigate(item.id, child.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                          isSubActive
                            ? 'text-[#1a73e8] font-semibold bg-[#e8f0fe]/70'
                            : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa]'
                        }`}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info in Sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-[#f1f3f4] bg-[#f8f9fa] text-[11px] text-[#5f6368] flex items-center justify-between">
          <span>COREBIQ v1.0 Enterprise</span>
          <span className="inline-flex items-center gap-1 text-[#1e8e3e] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e]" />
            Online
          </span>
        </div>
      )}
    </aside>
  );
};
