import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Landmark,
  FileCheck2,
  ListTodo,
  Users,
  CreditCard,
  FileText,
  Clock,
  Plus,
  ArrowRight,
  ShieldAlert,
  Calendar,
  DollarSign
} from 'lucide-react';
import { storage } from '../../services/storage';
import { CoreButton, CoreCard, CoreStatCard } from '../../components/common/CoreComponents';

interface DashboardProps {
  onNavigate: (module: string, subTab?: string) => void;
  onOpenQuickAction: (actionType: string) => void;
}

export const DashboardModule: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenQuickAction
}) => {
  const company = storage.getActiveCompany();
  const transactions = storage.getTransactions();
  const invoices = storage.getInvoices();
  const bankAccounts = storage.getBankAccounts();
  const customers = storage.getCustomers();
  const tasks = storage.getTasks();
  const compliance = storage.getCompliance();
  const payables = storage.getPayables();
  const currency = company?.currency || '₹';

  // Calculate Metrics
  const todayStr = new Date().toISOString().substring(0, 10);
  const todayTxns = transactions.filter((t) => t.date === todayStr);

  const todayIncome = todayTxns
    .filter((t) => t.type === 'Income' || t.type === 'Receipt')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayExpense = todayTxns
    .filter((t) => t.type === 'Expense' || t.type === 'Payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayNet = todayIncome - todayExpense;

  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);

  const totalReceivables = invoices
    .filter((i) => i.status !== 'Paid' && i.status !== 'Cancelled')
    .reduce((sum, i) => sum + i.balance, 0);

  const totalPayables = payables
    .filter((p) => p.status !== 'Paid')
    .reduce((sum, p) => sum + p.balance, 0);

  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const pendingComplianceCount = compliance.filter((c) => c.status !== 'Completed' && c.status !== 'Filed').length;

  // Recent data
  const recentTransactions = transactions.slice(0, 5);
  const recentCustomers = customers.slice(0, 4);
  const pendingTasksList = tasks.filter((t) => t.status !== 'Completed').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner with Company Context & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
            Business Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Real-time operations, cash flow, customer activity, and regulatory compliance for{' '}
            <span className="font-semibold text-[#202124]">{company.name}</span>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <CoreButton
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onOpenQuickAction('customer')}
          >
            Customer
          </CoreButton>
          <CoreButton
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onOpenQuickAction('transaction')}
          >
            Transaction
          </CoreButton>
          <CoreButton
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onOpenQuickAction('invoice')}
          >
            Invoice
          </CoreButton>
          <CoreButton
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onOpenQuickAction('task')}
          >
            Task
          </CoreButton>
          <CoreButton
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onOpenQuickAction('compliance')}
          >
            Compliance
          </CoreButton>
        </div>
      </div>

      {/* Primary KPI Metric Cards (3x3 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        <CoreStatCard
          title="Today's Income"
          value={`${currency}${todayIncome.toLocaleString()}`}
          trend={{ value: '14.2%', positive: true }}
          subtitle="Cleared revenue today"
          icon={<TrendingUp className="w-5 h-5 text-[#1e8e3e]" />}
          onClick={() => onNavigate('accounts', 'transactions')}
        />
        <CoreStatCard
          title="Today's Expense"
          value={`${currency}${todayExpense.toLocaleString()}`}
          trend={{ value: '3.1%', positive: false }}
          subtitle="Operational outflows"
          icon={<TrendingDown className="w-5 h-5 text-[#d93025]" />}
          onClick={() => onNavigate('accounts', 'expenses')}
        />
        <CoreStatCard
          title="Net Cash Position"
          value={`${currency}${todayNet.toLocaleString()}`}
          subtitle="Daily net surplus"
          icon={<Wallet className="w-5 h-5 text-[#1a73e8]" />}
          onClick={() => onNavigate('accounts', 'cash_books')}
        />
        <CoreStatCard
          title="Total Bank Balance"
          value={`${currency}${totalBankBalance.toLocaleString()}`}
          subtitle={`${bankAccounts.length} active corporate accounts`}
          icon={<Landmark className="w-5 h-5 text-[#1a73e8]" />}
          onClick={() => onNavigate('accounts', 'bank_accounts')}
        />
        <CoreStatCard
          title="Customer Receivables"
          value={`${currency}${totalReceivables.toLocaleString()}`}
          subtitle="Pending invoice dues"
          icon={<ArrowDownRight className="w-5 h-5 text-[#e37400]" />}
          onClick={() => onNavigate('accounts', 'receivables')}
        />
        <CoreStatCard
          title="Vendor Payables"
          value={`${currency}${totalPayables.toLocaleString()}`}
          subtitle="Pending vendor bills"
          icon={<ArrowUpRight className="w-5 h-5 text-[#d93025]" />}
          onClick={() => onNavigate('accounts', 'payables')}
        />
        <CoreStatCard
          title="Pending Compliance"
          value={pendingComplianceCount}
          subtitle="GST, TDS & ROC due"
          icon={<FileCheck2 className="w-5 h-5 text-[#d93025]" />}
          onClick={() => onNavigate('compliance')}
        />
        <CoreStatCard
          title="Pending Tasks"
          value={pendingTasksCount}
          subtitle="Across sales & operations"
          icon={<ListTodo className="w-5 h-5 text-[#1a73e8]" />}
          onClick={() => onNavigate('crm', 'crm_tasks')}
        />
      </div>

      {/* Financial Analytics & Compliance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Flow Comparison */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">
                Cash Flow Overview & Monthly Inflows
              </h3>
              <p className="text-xs text-[#5f6368]">Income vs Outflows comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#202124]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#1e8e3e]" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-[#202124]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#d93025]" />
                Expense
              </span>
            </div>
          </div>

          {/* Graphical Bar Breakdown */}
          <div className="space-y-4 pt-2">
            {[
              { month: 'Apr 2026', inc: 320000, exp: 180000 },
              { month: 'May 2026', inc: 410000, exp: 210000 },
              { month: 'Jun 2026', inc: 480000, exp: 260000 },
              { month: 'Jul 2026', inc: 540000, exp: 290000 },
              { month: 'Aug 2026', inc: 590000, exp: 310000 },
              { month: 'Sep 2026 (MTD)', inc: 430000, exp: 215000 }
            ].map((item) => {
              const max = 700000;
              const incPercent = Math.min(100, Math.round((item.inc / max) * 100));
              const expPercent = Math.min(100, Math.round((item.exp / max) * 100));
              return (
                <div key={item.month} className="space-y-1">
                  <div className="flex justify-between text-xs text-[#5f6368]">
                    <span className="font-medium text-[#202124]">{item.month}</span>
                    <span className="text-[11px]">
                      {currency}
                      {(item.inc / 1000).toFixed(0)}k in / {currency}
                      {(item.exp / 1000).toFixed(0)}k out
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#f1f3f4] rounded-full overflow-hidden flex gap-1">
                    <div
                      style={{ width: `${incPercent}%` }}
                      className="h-full bg-[#1e8e3e] rounded-l-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${expPercent}%` }}
                      className="h-full bg-[#d93025] rounded-r-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#f1f3f4] flex items-center justify-between text-xs">
            <span className="text-[#5f6368]">
              Operating margin this quarter:{' '}
              <span className="font-semibold text-[#1e8e3e]">46.8%</span>
            </span>
            <button
              onClick={() => onNavigate('reports')}
              className="text-[#1a73e8] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Full Financial Reports <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Regulatory & Compliance Radar */}
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#202124]">Compliance Watch</h3>
              <button
                onClick={() => onNavigate('compliance')}
                className="text-xs text-[#1a73e8] hover:underline font-medium"
              >
                View all
              </button>
            </div>
            <p className="text-xs text-[#5f6368] mb-4">
              Upcoming statutory returns and tax deadlines.
            </p>

            <div className="space-y-3">
              {compliance.slice(0, 4).map((comp) => {
                const isOverdue = comp.status === 'Overdue';
                const isCompleted = comp.status === 'Completed';
                return (
                  <div
                    key={comp.id}
                    onClick={() => onNavigate('compliance')}
                    className="p-3 rounded-lg border border-[#e0e2e6] hover:border-[#bdc1c6] transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#202124]">{comp.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-[#e6f4ea] text-[#137333]'
                            : isOverdue
                            ? 'bg-[#fce8e6] text-[#c5221f]'
                            : 'bg-[#fef7e0] text-[#b06000]'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#5f6368]">
                      <span>Due: {comp.dueDate}</span>
                      <span>Assigned: {comp.assignedTo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#f1f3f4] mt-4">
            <CoreButton
              variant="outline"
              size="sm"
              className="w-full"
              icon={<Calendar className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('compliance')}
            >
              Open Compliance Calendar
            </CoreButton>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections (Recent Transactions & High Priority Tasks) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">Recent Transactions</h3>
              <p className="text-xs text-[#5f6368]">Latest money movements in active accounts</p>
            </div>
            <button
              onClick={() => onNavigate('accounts', 'transactions')}
              className="text-xs text-[#1a73e8] hover:underline font-medium inline-flex items-center gap-1"
            >
              View Register <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#f1f3f4]">
            {recentTransactions.map((t) => {
              const isPositive = t.type === 'Income' || t.type === 'Receipt';
              return (
                <div key={t.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isPositive ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#202124]">{t.party}</div>
                      <div className="text-[11px] text-[#5f6368]">
                        {t.category} · {t.paymentMode} · {t.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-semibold ${
                        isPositive ? 'text-[#1e8e3e]' : 'text-[#d93025]'
                      }`}
                    >
                      {isPositive ? '+' : '-'}
                      {currency}
                      {t.amount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#80868b]">{t.account}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Operational Tasks */}
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">High Priority Tasks</h3>
              <p className="text-xs text-[#5f6368]">Action items requiring immediate follow-up</p>
            </div>
            <button
              onClick={() => onNavigate('crm', 'crm_tasks')}
              className="text-xs text-[#1a73e8] hover:underline font-medium inline-flex items-center gap-1"
            >
              All Tasks <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasksList.map((task) => (
              <div
                key={task.id}
                onClick={() => onNavigate('crm', 'crm_tasks')}
                className="p-3 rounded-lg border border-[#e0e2e6] hover:bg-[#f8f9fa] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-[#202124]">{task.title}</div>
                  <div className="text-[11px] text-[#5f6368] mt-0.5">
                    {task.relatedTo} · Due {task.dueDate} · Assigned to {task.assignedTo}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    task.priority === 'Urgent'
                      ? 'bg-[#fce8e6] text-[#c5221f]'
                      : task.priority === 'High'
                      ? 'bg-[#fef7e0] text-[#b06000]'
                      : 'bg-[#e8f0fe] text-[#1a73e8]'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
