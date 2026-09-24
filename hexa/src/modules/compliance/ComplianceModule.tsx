import React, { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  FileText
} from 'lucide-react';
import { storage } from '../../services/storage';
import { ComplianceRecord, ComplianceStatus, Priority } from '../../types';
import { CoreButton, CoreDialog, CoreInput, CoreSelect } from '../../components/common/CoreComponents';
import { CoreTable, Column } from '../../components/common/CoreTable';

export const ComplianceModule: React.FC = () => {
  const [complianceList, setComplianceList] = useState(storage.getCompliance());
  const [modalOpen, setModalOpen] = useState(false);
  const [markFiledModal, setMarkFiledModal] = useState<ComplianceRecord | null>(null);
  const [ackNumber, setAckNumber] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'GST' as ComplianceRecord['category'],
    frequency: 'Monthly' as ComplianceRecord['frequency'],
    period: 'September 2026',
    dueDate: new Date().toISOString().substring(0, 10),
    assignedTo: 'Pooja Iyer',
    priority: 'High' as Priority,
    notes: ''
  });

  const refresh = () => setComplianceList(storage.getCompliance());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    storage.saveCompliance({
      name: form.name.trim(),
      category: form.category,
      frequency: form.frequency,
      period: form.period.trim(),
      dueDate: form.dueDate,
      assignedTo: form.assignedTo.trim() || 'Compliance Officer',
      status: 'Pending',
      priority: form.priority,
      notes: form.notes.trim() || undefined
    });

    setModalOpen(false);
    refresh();
  };

  const handleMarkFiled = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markFiledModal) return;

    storage.saveCompliance({
      ...markFiledModal,
      status: 'Completed',
      acknowledgementNumber: ackNumber.trim() || `ARN${Date.now()}`
    });

    setMarkFiledModal(null);
    setAckNumber('');
    refresh();
  };

  const columns: Column<ComplianceRecord>[] = [
    {
      key: 'name',
      header: 'Compliance Requirement',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-semibold text-[#202124]">{c.name}</div>
          <div className="text-[11px] text-[#5f6368]">
            Category: <span className="font-medium text-[#1a73e8]">{c.category}</span> · Period: {c.period}
          </div>
        </div>
      )
    },
    {
      key: 'frequency',
      header: 'Frequency',
      render: (c) => (
        <span className="text-[11px] bg-[#f1f3f4] text-[#3c4043] px-2 py-0.5 rounded font-medium">
          {c.frequency}
        </span>
      )
    },
    {
      key: 'dueDate',
      header: 'Statutory Due Date',
      sortable: true,
      render: (c) => {
        const isOverdue = new Date(c.dueDate) < new Date() && c.status !== 'Completed';
        return (
          <span className={`font-semibold ${isOverdue ? 'text-[#d93025]' : 'text-[#202124]'}`}>
            {c.dueDate}
          </span>
        );
      }
    },
    {
      key: 'assignedTo',
      header: 'Assigned Officer'
    },
    {
      key: 'status',
      header: 'Filing Status',
      render: (c) => {
        const statusClass =
          c.status === 'Completed' || c.status === 'Filed'
            ? 'bg-[#e6f4ea] text-[#137333]'
            : c.status === 'Overdue'
            ? 'bg-[#fce8e6] text-[#c5221f]'
            : 'bg-[#fef7e0] text-[#b06000]';
        return (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusClass}`}>
            {c.status}
          </span>
        );
      }
    },
    {
      key: 'acknowledgementNumber',
      header: 'ARN / Reference #',
      render: (c) => (
        <span className="font-mono text-[11px] text-[#5f6368]">
          {c.acknowledgementNumber || '—'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Compliance & Regulatory Engine</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Configurable regulatory tracker for GST returns, TDS payments, ROC filings, and license renewals.
          </p>
        </div>
      </div>

      <CoreTable
        title="Statutory Returns & Filings Calendar"
        subtitle="Jurisdiction-agnostic compliance workflows with due dates and acknowledgement audits"
        data={complianceList}
        columns={columns}
        keyExtractor={(c) => c.id}
        searchFilter={(c, q) =>
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.category.toLowerCase().includes(q.toLowerCase()) ||
          c.period.toLowerCase().includes(q.toLowerCase())
        }
        addLabel="Add Compliance Rule"
        onAdd={() => setModalOpen(true)}
        actions={(c) => (
          <div className="flex items-center justify-end gap-1.5">
            {c.status !== 'Completed' && (
              <button
                onClick={() => {
                  setMarkFiledModal(c);
                  setAckNumber('');
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] hover:bg-[#ceead6] rounded transition-colors"
              >
                Mark Filed
              </button>
            )}
            <button
              onClick={() => {
                if (confirm(`Delete compliance rule ${c.name}?`)) {
                  storage.deleteCompliance(c.id);
                  refresh();
                }
              }}
              className="p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Add Compliance Dialog */}
      <CoreDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Regulatory Compliance Obligation"
        subtitle="Define statutory frequency, category, and due date rules"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-3">
          <CoreInput
            label="Compliance Obligation Title"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. GSTR-1 Monthly Return, Advance Tax Q3, Trade License"
          />

          <div className="grid grid-cols-2 gap-3">
            <CoreSelect
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              options={[
                { value: 'GST', label: 'GST (Goods & Services Tax)' },
                { value: 'TDS', label: 'TDS (Tax Deducted at Source)' },
                { value: 'Income Tax', label: 'Income Tax / Corporate Tax' },
                { value: 'ROC / Corporate', label: 'ROC / Corporate Secretarial' },
                { value: 'Labor & PF', label: 'Labor Laws, PF & ESI' },
                { value: 'Licenses & Renewals', label: 'Licenses & Annual Renewals' },
                { value: 'Custom', label: 'Internal Audit & Custom' }
              ]}
            />
            <CoreSelect
              label="Frequency"
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value as any })}
              options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Half-Yearly', label: 'Half-Yearly' },
                { value: 'Annual', label: 'Annual' },
                { value: 'One-Time', label: 'One-Time' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Applicable Period"
              required
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              placeholder="e.g. September 2026 or Q2 2026-27"
            />
            <CoreInput
              label="Statutory Due Date"
              type="date"
              required
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Assigned Officer"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              placeholder="Pooja Iyer"
            />
            <CoreSelect
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
              options={[
                { value: 'Urgent', label: 'Urgent' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
              ]}
            />
          </div>

          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Save Compliance
            </CoreButton>
          </div>
        </form>
      </CoreDialog>

      {/* Mark Filed Dialog */}
      <CoreDialog
        open={!!markFiledModal}
        onClose={() => setMarkFiledModal(null)}
        title="Record Compliance Filing"
        subtitle={`Record government filing proof for ${markFiledModal?.name}`}
        maxWidth="sm"
      >
        <form onSubmit={handleMarkFiled} className="space-y-3">
          <CoreInput
            label="Acknowledgement / ARN / Challan Reference"
            required
            value={ackNumber}
            onChange={(e) => setAckNumber(e.target.value)}
            placeholder="e.g. ARN2709202699801"
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setMarkFiledModal(null)}>
              Cancel
            </CoreButton>
            <CoreButton variant="success" type="submit">
              Confirm & Mark Completed
            </CoreButton>
          </div>
        </form>
      </CoreDialog>
    </div>
  );
};
