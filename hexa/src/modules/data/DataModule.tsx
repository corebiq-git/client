import React, { useState, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  History,
  Trash2,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  FileJson
} from 'lucide-react';
import { storage } from '../../services/storage';
import { AuditLog, DeletedRecord } from '../../types';
import { CoreTabs, CoreButton, CoreCard } from '../../components/common/CoreComponents';
import { CoreTable, Column } from '../../components/common/CoreTable';

export const DataModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('backup');
  const [auditLogs, setAuditLogs] = useState(storage.getAuditLogs());
  const [recycleBin, setRecycleBin] = useState(storage.getRecycleBin());
  const [message, setMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setAuditLogs(storage.getAuditLogs());
    setRecycleBin(storage.getRecycleBin());
  };

  const handleExportBackup = () => {
    const jsonStr = storage.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corebiq_backup_${storage.getActiveCompanyId()}_${Date.now()}.json`;
    a.click();
    setMessage('Backup downloaded successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = storage.importBackupJSON(content);
        if (success) {
          setMessage('Backup restored successfully! All data updated.');
          refresh();
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeedData = () => {
    if (confirm('Reset to initial demonstration seed data? Any custom records will be refreshed.')) {
      storage.resetToDemoSeed();
      refresh();
      setMessage('System reseeded with fresh demo records!');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRestoreRecycle = (item: any) => {
    storage.restoreFromRecycleBin(item.id);
    refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Data Management, Backup & Auditing</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Full system JSON snapshots, real-time audit trail logs, and deleted item recycling.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-[#e6f4ea] border border-[#a8dab5] rounded-xl text-xs text-[#137333] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <CoreTabs
        tabs={[
          { id: 'backup', label: 'Backup & Restore', icon: <Database className="w-4 h-4" /> },
          { id: 'audit', label: 'Audit Trail & Activity Log', count: auditLogs.length, icon: <History className="w-4 h-4" /> },
          { id: 'recycle', label: 'Recycle Bin', count: recycleBin.length, icon: <Trash2 className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 1. BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-[#1a73e8]" />
              <h3 className="text-sm font-semibold text-[#202124]">Export Full System Backup</h3>
            </div>
            <p className="text-xs text-[#5f6368]">
              Downloads a complete JSON snapshot containing all customers, transactions, invoices, compliance filings, employee attendance, and settings for this company.
            </p>
            <div className="pt-2">
              <CoreButton
                variant="primary"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportBackup}
              >
                Download JSON Backup
              </CoreButton>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#1a73e8]" />
              <h3 className="text-sm font-semibold text-[#202124]">Restore from JSON Backup</h3>
            </div>
            <p className="text-xs text-[#5f6368]">
              Upload a previously exported COREBIQ JSON file to restore the entire company workspace state.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <div className="pt-2">
              <CoreButton
                variant="outline"
                icon={<Upload className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Select Backup File (.json)
              </CoreButton>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="md:col-span-2 bg-[#f8f9fa] rounded-xl border border-[#dadce0] p-5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#202124]">Reload Demonstration Dataset</h4>
              <p className="text-[11px] text-[#5f6368]">
                Restores standard sample records across transactions, clients, invoices and compliance.
              </p>
            </div>
            <CoreButton
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetSeedData}
            >
              Reload Seed Data
            </CoreButton>
          </div>
        </div>
      )}

      {/* 2. AUDIT TRAIL LOG */}
      {activeTab === 'audit' && (
        <CoreTable<AuditLog>
          title="Security & Activity Audit Log"
          subtitle="Timestamped immutable log of user operations, entity mutations, and exports"
          data={auditLogs}
          columns={[
            { key: 'timestamp', header: 'Timestamp', sortable: true },
            {
              key: 'action',
              header: 'Action',
              render: (a) => (
                <span className="font-semibold text-xs text-[#202124]">{a.action}</span>
              )
            },
            {
              key: 'module',
              header: 'Module',
              render: (a) => (
                <span className="text-[11px] font-mono bg-[#f1f3f4] text-[#3c4043] px-2 py-0.5 rounded">
                  {a.module}
                </span>
              )
            },
            { key: 'user', header: 'Operator' },
            {
              key: 'recordTitle',
              header: 'Activity Details',
              render: (a) => <span>{a.details || a.recordTitle}</span>
            }
          ]}
          keyExtractor={(a) => a.id}
          searchFilter={(a, q) =>
            a.action.toLowerCase().includes(q.toLowerCase()) ||
            a.module.toLowerCase().includes(q.toLowerCase()) ||
            Boolean(a.recordTitle && a.recordTitle.toLowerCase().includes(q.toLowerCase()))
          }
        />
      )}

      {/* 3. RECYCLE BIN */}
      {activeTab === 'recycle' && (
        <CoreTable<DeletedRecord>
          title="Recycle Bin (Soft Deletions)"
          subtitle="Deleted items can be restored to active ledgers at any time"
          data={recycleBin}
          columns={[
            { key: 'deletedAt', header: 'Deleted On' },
            {
              key: 'module',
              header: 'Entity Type',
              render: (item) => <span>{item.module || item.entityType || 'Record'}</span>
            },
            {
              key: 'title',
              header: 'Item Summary',
              render: (item) => (
                <div className="font-medium text-xs text-[#202124]">
                  {item.title || item.data?.name || item.data?.party || item.data?.invoiceNumber || item.id}
                </div>
              )
            }
          ]}
          keyExtractor={(item) => item.id}
          actions={(item) => (
            <button
              onClick={() => handleRestoreRecycle(item)}
              className="text-xs font-semibold text-[#1a73e8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore
            </button>
          )}
        />
      )}
    </div>
  );
};
