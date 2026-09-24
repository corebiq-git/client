import React, { useState } from 'react';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  Filter,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { storage } from '../../services/storage';
import { CoreTabs, CoreButton, CoreSelect, CoreInput } from '../../components/common/CoreComponents';

export const ReportsModule: React.FC = () => {
  const company = storage.getActiveCompany();
  const currency = company?.currency || '₹';

  const [activeReport, setActiveReport] = useState('pnl');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState(new Date().toISOString().substring(0, 10));

  const transactions = storage.getTransactions();
  const invoices = storage.getInvoices();
  const payables = storage.getPayables();
  const compliance = storage.getCompliance();

  // Filtered transactions
  const filteredTxns = transactions.filter((t) => t.date >= fromDate && t.date <= toDate);

  const totalIncome = filteredTxns
    .filter((t) => t.type === 'Income' || t.type === 'Receipt')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTxns
    .filter((t) => t.type === 'Expense' || t.type === 'Payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSurplus = totalIncome - totalExpense;

  const totalReceivables = invoices
    .filter((i) => i.balance > 0)
    .reduce((sum, i) => sum + i.balance, 0);

  const totalPayables = payables
    .filter((p) => p.balance > 0)
    .reduce((sum, p) => sum + p.balance, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Financial & Operational Reporting Hub</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Audit-ready statement generation, P&L summaries, and tax returns for {company.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CoreButton
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => {
              const rows = filteredTxns.map(
                (t) => `"${t.date}","${t.party}","${t.type}",${t.amount},"${t.category}"`
              );
              const csv = `Date,Party,Type,Amount,Category\n${rows.join('\n')}`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `report_${activeReport}_${Date.now()}.csv`;
              a.click();
            }}
          >
            Export CSV
          </CoreButton>
          <CoreButton
            variant="primary"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            Print Report
          </CoreButton>
        </div>
      </div>

      {/* Date Range Filter Bar */}
      <div className="bg-white rounded-xl border border-[#e0e2e6] p-3 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-[#202124] flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#1a73e8]" /> Report Period:
        </span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-2.5 py-1 border border-[#dadce0] rounded-md outline-none focus:border-[#1a73e8]"
          />
          <span className="text-[#5f6368]">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-2.5 py-1 border border-[#dadce0] rounded-md outline-none focus:border-[#1a73e8]"
          />
        </div>
      </div>

      <CoreTabs
        tabs={[
          { id: 'pnl', label: 'Income vs Expense (P&L)', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'receivables', label: 'Receivables & Aging', icon: <ArrowDownRight className="w-4 h-4" /> },
          { id: 'payables', label: 'Payables Report', icon: <ArrowUpRight className="w-4 h-4" /> },
          { id: 'compliance', label: 'Statutory Compliance Audit', icon: <Calendar className="w-4 h-4" /> }
        ]}
        activeTab={activeReport}
        onChange={setActiveReport}
      />

      {/* 1. P&L REPORT */}
      {activeReport === 'pnl' && (
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs space-y-6 print:border-none print:p-0">
          <div className="border-b border-[#e0e2e6] pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-[#202124]">{company.name}</h2>
              <div className="text-xs text-[#5f6368]">Statement of Income and Operational Outflows</div>
              <div className="text-[11px] text-[#80868b] mt-0.5">
                Period: {fromDate} to {toDate}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#5f6368]">Net Operating Result</div>
              <div
                className={`text-lg font-bold ${
                  netSurplus >= 0 ? 'text-[#1e8e3e]' : 'text-[#d93025]'
                }`}
              >
                {netSurplus >= 0 ? '+' : '-'}
                {currency}
                {Math.abs(netSurplus).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inflows breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#1e8e3e] uppercase tracking-wider border-b border-[#e0e2e6] pb-1.5 flex justify-between">
                <span>Revenue & Inflows</span>
                <span>{currency}{totalIncome.toLocaleString()}</span>
              </h3>
              <div className="space-y-2 text-xs">
                {filteredTxns
                  .filter((t) => t.type === 'Income' || t.type === 'Receipt')
                  .map((t) => (
                    <div key={t.id} className="flex justify-between py-1 border-b border-[#f1f3f4]">
                      <div>
                        <span className="font-medium text-[#202124]">{t.party}</span>
                        <span className="text-[10px] text-[#5f6368] block">{t.category}</span>
                      </div>
                      <span className="font-semibold text-[#1e8e3e]">
                        +{currency}{t.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Outflows breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#d93025] uppercase tracking-wider border-b border-[#e0e2e6] pb-1.5 flex justify-between">
                <span>Operational Expenses</span>
                <span>{currency}{totalExpense.toLocaleString()}</span>
              </h3>
              <div className="space-y-2 text-xs">
                {filteredTxns
                  .filter((t) => t.type === 'Expense' || t.type === 'Payment')
                  .map((t) => (
                    <div key={t.id} className="flex justify-between py-1 border-b border-[#f1f3f4]">
                      <div>
                        <span className="font-medium text-[#202124]">{t.party}</span>
                        <span className="text-[10px] text-[#5f6368] block">{t.category}</span>
                      </div>
                      <span className="font-semibold text-[#d93025]">
                        -{currency}{t.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RECEIVABLES REPORT */}
      {activeReport === 'receivables' && (
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#e0e2e6] pb-3">
            <h3 className="text-sm font-semibold text-[#202124]">Outstanding Client Dues</h3>
            <span className="text-sm font-bold text-[#d93025]">
              Total Receivable: {currency}{totalReceivables.toLocaleString()}
            </span>
          </div>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e0e2e6] text-[#5f6368]">
                <th className="py-2 px-3">Client</th>
                <th className="py-2 px-3">Invoice #</th>
                <th className="py-2 px-3">Due Date</th>
                <th className="py-2 px-3 text-right">Invoice Total</th>
                <th className="py-2 px-3 text-right">Balance Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4]">
              {invoices
                .filter((i) => i.balance > 0)
                .map((i) => (
                  <tr key={i.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#202124]">{i.customerName}</td>
                    <td className="py-2.5 px-3 font-mono text-[#1a73e8]">{i.invoiceNumber}</td>
                    <td className="py-2.5 px-3 text-[#5f6368]">{i.dueDate}</td>
                    <td className="py-2.5 px-3 text-right">{currency}{i.total.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#d93025]">
                      {currency}{i.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. PAYABLES REPORT */}
      {activeReport === 'payables' && (
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#e0e2e6] pb-3">
            <h3 className="text-sm font-semibold text-[#202124]">Vendor Bills & Payables</h3>
            <span className="text-sm font-bold text-[#d93025]">
              Total Payable: {currency}{totalPayables.toLocaleString()}
            </span>
          </div>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e0e2e6] text-[#5f6368]">
                <th className="py-2 px-3">Vendor</th>
                <th className="py-2 px-3">Bill #</th>
                <th className="py-2 px-3">Due Date</th>
                <th className="py-2 px-3 text-right">Amount</th>
                <th className="py-2 px-3 text-right">Outstanding Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4]">
              {payables
                .filter((p) => p.balance > 0)
                .map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#202124]">{p.vendorName}</td>
                    <td className="py-2.5 px-3 font-mono text-[#5f6368]">{p.billNumber}</td>
                    <td className="py-2.5 px-3 text-[#5f6368]">{p.dueDate}</td>
                    <td className="py-2.5 px-3 text-right">{currency}{p.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#d93025]">
                      {currency}{p.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. COMPLIANCE AUDIT */}
      {activeReport === 'compliance' && (
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-[#202124] border-b border-[#e0e2e6] pb-3">
            Statutory Filings Audit Report
          </h3>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e0e2e6] text-[#5f6368]">
                <th className="py-2 px-3">Obligation</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Period</th>
                <th className="py-2 px-3">Due Date</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Acknowledgement / ARN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4]">
              {compliance.map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 px-3 font-semibold text-[#202124]">{c.name}</td>
                  <td className="py-2.5 px-3 text-[#1a73e8]">{c.category}</td>
                  <td className="py-2.5 px-3 text-[#5f6368]">{c.period}</td>
                  <td className="py-2.5 px-3 text-[#5f6368]">{c.dueDate}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        c.status === 'Completed'
                          ? 'bg-[#e6f4ea] text-[#137333]'
                          : 'bg-[#fef7e0] text-[#b06000]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#5f6368]">
                    {c.acknowledgementNumber || 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
