/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { Header } from './components/layout/Header';
import { Sidebar, MainNavId } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { GlobalSearchDialog } from './components/layout/GlobalSearchDialog';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { CompanySwitcherModal } from './components/layout/CompanySwitcherModal';

// Modules
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { CrmModule } from './modules/crm/CrmModule';
import { AccountsModule } from './modules/accounts/AccountsModule';
import { EmployeesModule } from './modules/employees/EmployeesModule';
import { ComplianceModule } from './modules/compliance/ComplianceModule';
import { TemplatesModule } from './modules/templates/TemplatesModule';
import { ToolsModule } from './modules/tools/ToolsModule';
import { CompanyModule } from './modules/company/CompanyModule';
import { DataModule } from './modules/data/DataModule';
import { ReportsModule } from './modules/reports/ReportsModule';
import { PaymentsModule } from './modules/payments/PaymentsModule';
import { SettingsModule } from './modules/settings/SettingsModule';

export default function App() {
  // Navigation State
  const [currentModule, setCurrentModule] = useState<MainNavId>('dashboard');
  const [currentSubTab, setCurrentSubTab] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Storage synced state
  const [activeCompany, setActiveCompany] = useState(storage.getActiveCompany());
  const [companies, setCompanies] = useState(storage.getCompanies());
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());
  const [notifications, setNotifications] = useState(storage.getNotifications());

  // Dialog states
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setActiveCompany(storage.getActiveCompany());
      setCompanies(storage.getCompanies());
      setCurrentUser(storage.getCurrentUser());
      setNotifications(storage.getNotifications());
    });
    return () => unsubscribe();
  }, []);

  const handleNavigate = (module: string, subTab?: string) => {
    setCurrentModule(module as MainNavId);
    setCurrentSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCompany = (companyId: string) => {
    storage.setActiveCompanyId(companyId);
    setActiveCompany(storage.getActiveCompany());
  };

  // Quick Action Dispatcher from Dashboard
  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'customer':
        handleNavigate('crm', 'customers');
        break;
      case 'transaction':
        handleNavigate('accounts', 'transactions');
        break;
      case 'invoice':
        handleNavigate('accounts', 'invoices');
        break;
      case 'task':
        handleNavigate('crm', 'crm_tasks');
        break;
      case 'compliance':
        handleNavigate('compliance');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-[#202124] antialiased">
      {/* Top Universal Header */}
      <Header
        companies={companies}
        activeCompany={activeCompany}
        onSelectCompany={handleSelectCompany}
        onNewCompany={() => setCompanyModalOpen(true)}
        currentUser={currentUser}
        notifications={notifications}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={(mod) => handleNavigate(mod as MainNavId)}
      />

      {/* Main Body: Desktop Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar (Hidden on mobile) */}
        <div className="hidden md:block">
          <Sidebar
            currentModule={currentModule}
            currentSubTab={currentSubTab}
            onNavigate={(mod, sub) => handleNavigate(mod, sub)}
            collapsed={sidebarCollapsed}
          />
        </div>

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentModule === 'dashboard' && (
              <DashboardModule
                onNavigate={handleNavigate}
                onOpenQuickAction={handleQuickAction}
              />
            )}

            {currentModule === 'crm' && (
              <CrmModule
                initialSubTab={currentSubTab}
                onNavigateToInvoice={() => handleNavigate('accounts', 'invoices')}
                onNavigateToTransaction={() => handleNavigate('accounts', 'transactions')}
              />
            )}

            {currentModule === 'accounts' && (
              <AccountsModule initialSubTab={currentSubTab} />
            )}

            {currentModule === 'employees' && (
              <EmployeesModule initialSubTab={currentSubTab} />
            )}

            {currentModule === 'compliance' && <ComplianceModule />}

            {currentModule === 'templates' && <TemplatesModule />}

            {currentModule === 'tools' && (
              <ToolsModule initialSubTab={currentSubTab} />
            )}

            {currentModule === 'company' && <CompanyModule />}

            {currentModule === 'data' && <DataModule />}

            {currentModule === 'reports' && <ReportsModule />}

            {currentModule === 'payments' && <PaymentsModule />}

            {currentModule === 'settings' && <SettingsModule />}
          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation (Home, CRM, Accounts, Tools, Menu) */}
      <MobileBottomNav
        currentModule={currentModule}
        onNavigate={(mod) => handleNavigate(mod)}
      />

      {/* Global Search Dialog (Cmd/Ctrl + K) */}
      <GlobalSearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onNavigate={handleNavigate}
      />

      {/* New Company Switcher / Creator Modal */}
      <CompanySwitcherModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onCompanyCreated={(comp) => {
          setActiveCompany(comp);
          setCompanies(storage.getCompanies());
        }}
      />
    </div>
  );
}
