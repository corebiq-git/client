import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  Check,
  Smartphone,
  Mail,
  HardDrive
} from 'lucide-react';
import { storage } from '../../services/storage';
import { CoreTabs, CoreButton, CoreInput, CoreSelect } from '../../components/common/CoreComponents';

export const SettingsModule: React.FC = () => {
  const company = storage.getActiveCompany();
  const [activeTab, setActiveTab] = useState('general');

  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dueReminders, setDueReminders] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Platform & Business Settings</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            System defaults, statutory date formatting, security policies, and reminder notifications.
          </p>
        </div>
      </div>

      <CoreTabs
        tabs={[
          { id: 'general', label: 'General & Localization', icon: <Sliders className="w-4 h-4" /> },
          { id: 'security', label: 'Security & Auth Policies', icon: <Shield className="w-4 h-4" /> },
          { id: 'notifications', label: 'Alerts & Reminders', icon: <Bell className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-semibold text-[#202124] border-b border-[#f1f3f4] pb-2">
              Localization & Number Formatting
            </h3>
            <CoreSelect
              label="Standard System Date Format"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              options={[
                { value: 'YYYY-MM-DD', label: 'ISO Standard (YYYY-MM-DD)' },
                { value: 'DD/MM/YYYY', label: 'British / Indian (DD/MM/YYYY)' },
                { value: 'MM/DD/YYYY', label: 'US (MM/DD/YYYY)' }
              ]}
            />
            <CoreSelect
              label="Operating Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'Asia/Kolkata (IST +5:30)', label: 'India Standard Time (IST +5:30)' },
                { value: 'Asia/Dubai (GST +4:00)', label: 'Gulf Standard Time (GST +4:00)' },
                { value: 'UTC', label: 'Universal Coordinated Time (UTC)' },
                { value: 'America/New_York (EST)', label: 'Eastern Time (US/Canada)' }
              ]}
            />
            <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e0e2e6] text-xs text-[#5f6368] space-y-1">
              <span className="font-semibold text-[#202124] flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-[#1a73e8]" /> Progressive Web App (PWA) Offline Storage
              </span>
              <div>
                COREBIQ maintains full offline resilience via service worker caching and local indexed storage.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-semibold text-[#202124] border-b border-[#f1f3f4] pb-2">
              Corporate Governance & Access Security
            </h3>
            <CoreSelect
              label="Idle Session Timeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              options={[
                { value: '15', label: '15 Minutes' },
                { value: '30', label: '30 Minutes' },
                { value: '60', label: '60 Minutes (Recommended)' },
                { value: '480', label: '8 Hours (Full Shift)' }
              ]}
            />
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#e0e2e6]">
              <div>
                <span className="text-xs font-semibold text-[#202124] block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-[#5f6368]">Enforce OTP on user login</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 text-[#1a73e8] rounded"
              />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-semibold text-[#202124] border-b border-[#f1f3f4] pb-2">
              Automated Alerts & Statutory Reminders
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#e0e2e6]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#1a73e8]" />
                  <div>
                    <span className="text-xs font-semibold text-[#202124] block">Email Notifications</span>
                    <span className="text-[11px] text-[#5f6368]">Send receipts, invoices, and audit summaries</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#1a73e8] rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#e0e2e6]">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#1e8e3e]" />
                  <div>
                    <span className="text-xs font-semibold text-[#202124] block">WhatsApp Due Alerts</span>
                    <span className="text-[11px] text-[#5f6368]">Instant reminder for invoice receivables</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#1a73e8] rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#e0e2e6]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#e37400]" />
                  <div>
                    <span className="text-xs font-semibold text-[#202124] block">Compliance Deadlines Watch</span>
                    <span className="text-[11px] text-[#5f6368]">Alert assigned officers 7 days prior to statutory return due dates</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={dueReminders}
                  onChange={(e) => setDueReminders(e.target.checked)}
                  className="w-4 h-4 text-[#1a73e8] rounded"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#e0e2e6] flex items-center justify-between">
          {saved ? (
            <span className="text-xs font-semibold text-[#1e8e3e] flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences Saved
            </span>
          ) : (
            <div />
          )}
          <CoreButton variant="primary" type="submit">
            Save Preferences
          </CoreButton>
        </div>
      </form>
    </div>
  );
};
