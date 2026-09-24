import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Users,
  CreditCard,
  FileText,
  UserCheck,
  FileCheck2,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { storage } from '../../services/storage';

interface GlobalSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (module: string, subTab?: string) => void;
}

export const GlobalSearchDialog: React.FC<GlobalSearchDialogProps> = ({
  open,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const customers = storage.getCustomers().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        (c.companyName && c.companyName.toLowerCase().includes(q))
    );

    const leads = storage.getLeads().filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.requirement.toLowerCase().includes(q)
    );

    const transactions = storage.getTransactions().filter(
      (t) =>
        t.party.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.reference && t.reference.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    );

    const invoices = storage.getInvoices().filter(
      (i) =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q)
    );

    const employees = storage.getEmployees().filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );

    const compliance = storage.getCompliance().filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );

    const tasks = storage.getTasks().filter(
      (t) => t.title.toLowerCase().includes(q) || (t.relatedTo && t.relatedTo.toLowerCase().includes(q))
    );

    return {
      customers: customers.slice(0, 4),
      leads: leads.slice(0, 4),
      transactions: transactions.slice(0, 4),
      invoices: invoices.slice(0, 4),
      employees: employees.slice(0, 4),
      compliance: compliance.slice(0, 4),
      tasks: tasks.slice(0, 4)
    };
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div
          className="relative w-full max-w-2xl bg-white rounded-xl border border-[#dadce0] shadow-2xl overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header Input */}
          <div className="p-3 border-b border-[#e0e2e6] flex items-center gap-3 bg-white">
            <Search className="w-5 h-5 text-[#5f6368]" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all modules (e.g. 'Horizon', 'GSTR', 'Invoice', 'Consulting')..."
              className="w-full text-sm bg-transparent outline-none text-[#202124] placeholder-[#80868b]"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#80868b] hover:text-[#202124]">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#f1f3f4] text-[#5f6368] rounded">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {!query.trim() ? (
              <div className="text-center py-8 text-xs text-[#5f6368]">
                Type to search across Customers, Leads, Transactions, Invoices, Compliance, and Employees.
              </div>
            ) : results &&
              Object.values(results).every((arr) => arr.length === 0) ? (
              <div className="text-center py-8 text-xs text-[#5f6368]">
                No records matching "<span className="font-semibold text-[#202124]">{query}</span>"
              </div>
            ) : (
              results && (
                <>
                  {/* Customers */}
                  {results.customers.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#1a73e8]" /> Customers ({results.customers.length})
                      </div>
                      <div className="space-y-1">
                        {results.customers.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              onNavigate('crm', 'customers');
                              onClose();
                            }}
                            className="p-2.5 rounded-lg hover:bg-[#f8f9fa] flex items-center justify-between cursor-pointer group transition-colors"
                          >
                            <div>
                              <div className="text-xs font-medium text-[#202124] group-hover:text-[#1a73e8]">
                                {c.name}
                              </div>
                              <div className="text-[11px] text-[#5f6368]">
                                {c.companyName || c.email} · {c.city}
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#80868b] group-hover:text-[#1a73e8]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transactions */}
                  {results.transactions.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#1e8e3e]" /> Transactions ({results.transactions.length})
                      </div>
                      <div className="space-y-1">
                        {results.transactions.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              onNavigate('accounts', 'transactions');
                              onClose();
                            }}
                            className="p-2.5 rounded-lg hover:bg-[#f8f9fa] flex items-center justify-between cursor-pointer group transition-colors"
                          >
                            <div>
                              <div className="text-xs font-medium text-[#202124] group-hover:text-[#1a73e8]">
                                {t.party} - ₹{t.amount.toLocaleString()} ({t.type})
                              </div>
                              <div className="text-[11px] text-[#5f6368]">
                                {t.description} · {t.date}
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#80868b] group-hover:text-[#1a73e8]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Invoices */}
                  {results.invoices.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#e37400]" /> Invoices ({results.invoices.length})
                      </div>
                      <div className="space-y-1">
                        {results.invoices.map((inv) => (
                          <div
                            key={inv.id}
                            onClick={() => {
                              onNavigate('accounts', 'invoices');
                              onClose();
                            }}
                            className="p-2.5 rounded-lg hover:bg-[#f8f9fa] flex items-center justify-between cursor-pointer group transition-colors"
                          >
                            <div>
                              <div className="text-xs font-medium text-[#202124] group-hover:text-[#1a73e8]">
                                {inv.invoiceNumber} - {inv.customerName}
                              </div>
                              <div className="text-[11px] text-[#5f6368]">
                                Total: ₹{inv.total.toLocaleString()} · Due: {inv.dueDate} · {inv.status}
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#80868b] group-hover:text-[#1a73e8]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compliance */}
                  {results.compliance.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-[#1a73e8]" /> Compliance ({results.compliance.length})
                      </div>
                      <div className="space-y-1">
                        {results.compliance.map((comp) => (
                          <div
                            key={comp.id}
                            onClick={() => {
                              onNavigate('compliance');
                              onClose();
                            }}
                            className="p-2.5 rounded-lg hover:bg-[#f8f9fa] flex items-center justify-between cursor-pointer group transition-colors"
                          >
                            <div>
                              <div className="text-xs font-medium text-[#202124] group-hover:text-[#1a73e8]">
                                {comp.name}
                              </div>
                              <div className="text-[11px] text-[#5f6368]">
                                {comp.category} · Due: {comp.dueDate} · {comp.status}
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#80868b] group-hover:text-[#1a73e8]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
