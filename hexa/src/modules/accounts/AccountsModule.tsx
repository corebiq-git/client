import React, { useState } from 'react';
import {
  CreditCard,
  Landmark,
  Wallet,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Plus,
  Printer,
  Share2,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  FileCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { storage } from '../../services/storage';
import {
  Transaction,
  BankAccount,
  Invoice,
  BillPayment,
  Cheque,
  TransactionType,
  PaymentMode,
  InvoiceStatus,
  InvoiceItem
} from '../../types';
import { CoreTabs, CoreButton, CoreDialog, CoreInput, CoreSelect } from '../../components/common/CoreComponents';
import { CoreTable, Column } from '../../components/common/CoreTable';

interface AccountsModuleProps {
  initialSubTab?: string;
}

export const AccountsModule: React.FC<AccountsModuleProps> = ({
  initialSubTab = 'transactions'
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab || 'transactions');
  const company = storage.getActiveCompany();
  const currency = company?.currency || '₹';

  // State
  const [transactions, setTransactions] = useState(storage.getTransactions());
  const [bankAccounts, setBankAccounts] = useState(storage.getBankAccounts());
  const [invoices, setInvoices] = useState(storage.getInvoices());
  const [payables, setPayables] = useState(storage.getPayables());
  const [cheques, setCheques] = useState(storage.getCheques());

  const refreshAll = () => {
    setTransactions(storage.getTransactions());
    setBankAccounts(storage.getBankAccounts());
    setInvoices(storage.getInvoices());
    setPayables(storage.getPayables());
    setCheques(storage.getCheques());
  };

  // --- TRANSACTION MODAL & STATE ---
  const [txnModalOpen, setTxnModalOpen] = useState(false);
  const [txnForm, setTxnForm] = useState({
    type: 'Income' as TransactionType,
    category: 'Consulting Retainer',
    party: '',
    description: '',
    amount: 10000,
    paymentMode: 'Bank' as PaymentMode,
    account: bankAccounts[0]?.bankName || 'HDFC Bank Ltd',
    reference: '',
    date: new Date().toISOString().substring(0, 10),
    status: 'Completed' as Transaction['status']
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnForm.party.trim() || txnForm.amount <= 0) return;

    storage.saveTransaction({
      type: txnForm.type,
      category: txnForm.category,
      party: txnForm.party.trim(),
      description: txnForm.description.trim() || `${txnForm.type} - ${txnForm.party}`,
      amount: Number(txnForm.amount),
      paymentMode: txnForm.paymentMode,
      account: txnForm.account,
      reference: txnForm.reference.trim() || undefined,
      date: txnForm.date,
      status: txnForm.status
    });

    setTxnModalOpen(false);
    refreshAll();
  };

  // --- INVOICE MODAL & PREVIEW STATE ---
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const [invForm, setInvForm] = useState({
    customerName: '',
    customerAddress: '',
    customerTaxId: '',
    invoiceNumber: `${company.invoicePrefix}${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().substring(0, 10),
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
    items: [
      { id: '1', description: 'Professional Consulting / Service Deliverable', quantity: 1, unitPrice: 25000, taxPercent: 18, amount: 25000 }
    ],
    taxAmount: 4500,
    discountAmount: 0,
    notes: 'Payment due within 15 days.',
    terms: 'Please quote invoice number on remittance.'
  });

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invForm.customerName.trim() || invForm.items.length === 0) return;

    const subtotal = invForm.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const taxAmount = (subtotal * 18) / 100;
    const total = subtotal + taxAmount - (Number(invForm.discountAmount) || 0);

    storage.saveInvoice({
      invoiceNumber: invForm.invoiceNumber,
      customerId: `cust_${Date.now()}`,
      customerName: invForm.customerName.trim(),
      customerAddress: invForm.customerAddress.trim() || undefined,
      customerTaxId: invForm.customerTaxId.trim() || undefined,
      date: invForm.date,
      dueDate: invForm.dueDate,
      items: invForm.items,
      subtotal,
      taxAmount,
      discountAmount: Number(invForm.discountAmount) || 0,
      total,
      paidAmount: 0,
      balance: total,
      status: 'Sent',
      notes: invForm.notes,
      terms: invForm.terms
    });

    setInvoiceModalOpen(false);
    refreshAll();
  };

  // --- BANK ACCOUNT MODAL ---
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    branch: '',
    openingBalance: 100000
  });

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bankName.trim() || !bankForm.accountNumber.trim()) return;

    storage.saveBankAccount({
      bankName: bankForm.bankName.trim(),
      accountName: bankForm.accountName.trim() || `${bankForm.bankName} Current`,
      accountNumber: bankForm.accountNumber.trim(),
      ifsc: bankForm.ifsc.trim(),
      branch: bankForm.branch.trim(),
      openingBalance: Number(bankForm.openingBalance) || 0,
      currentBalance: Number(bankForm.openingBalance) || 0,
      status: 'Active'
    });

    setBankModalOpen(false);
    refreshAll();
  };

  // Transaction columns
  const txnColumns: Column<Transaction>[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'party',
      header: 'Party / Client',
      sortable: true,
      render: (t) => (
        <div>
          <div className="font-medium text-[#202124]">{t.party}</div>
          <div className="text-[11px] text-[#5f6368]">{t.description}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (t) => {
        const isPositive = t.type === 'Income' || t.type === 'Receipt';
        return (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
              isPositive ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'
            }`}
          >
            {isPositive ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
            {t.type}
          </span>
        );
      }
    },
    {
      key: 'category',
      header: 'Category'
    },
    {
      key: 'paymentMode',
      header: 'Mode',
      render: (t) => (
        <span className="text-[11px] bg-[#f1f3f4] text-[#3c4043] px-2 py-0.5 rounded font-mono">
          {t.paymentMode}
        </span>
      )
    },
    {
      key: 'account',
      header: 'Account'
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      align: 'right',
      render: (t) => {
        const isPositive = t.type === 'Income' || t.type === 'Receipt';
        return (
          <span
            className={`font-semibold ${
              isPositive ? 'text-[#1e8e3e]' : 'text-[#d93025]'
            }`}
          >
            {isPositive ? '+' : '-'}
            {currency}
            {t.amount.toLocaleString()}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            t.status === 'Completed'
              ? 'bg-[#e6f4ea] text-[#137333]'
              : 'bg-[#fef7e0] text-[#b06000]'
          }`}
        >
          {t.status}
        </span>
      )
    }
  ];

  // Invoice Columns
  const invoiceColumns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortable: true,
      render: (i) => (
        <span
          onClick={() => setViewInvoice(i)}
          className="font-medium text-[#1a73e8] hover:underline cursor-pointer"
        >
          {i.invoiceNumber}
        </span>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      align: 'right',
      render: (i) => (
        <span className="font-semibold text-[#202124]">
          {currency}
          {i.total.toLocaleString()}
        </span>
      )
    },
    {
      key: 'balance',
      header: 'Balance Due',
      sortable: true,
      align: 'right',
      render: (i) => (
        <span
          className={`font-semibold ${
            i.balance > 0 ? 'text-[#d93025]' : 'text-[#1e8e3e]'
          }`}
        >
          {currency}
          {i.balance.toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (i) => {
        const statusColors: Record<InvoiceStatus, string> = {
          Draft: 'bg-[#f1f3f4] text-[#5f6368]',
          Sent: 'bg-[#e8f0fe] text-[#1a73e8]',
          'Partially Paid': 'bg-[#fef7e0] text-[#b06000]',
          Paid: 'bg-[#e6f4ea] text-[#137333]',
          Overdue: 'bg-[#fce8e6] text-[#c5221f]',
          Cancelled: 'bg-[#f1f3f4] text-[#80868b]'
        };
        return (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusColors[i.status]}`}>
            {i.status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Accounts & Financial Ledger</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Real-time books of accounts, banking ledgers, cash flow registers, and billing.
          </p>
        </div>
      </div>

      <CoreTabs
        tabs={[
          { id: 'transactions', label: 'Transactions', count: transactions.length, icon: <CreditCard className="w-4 h-4" /> },
          { id: 'invoices', label: 'Invoices', count: invoices.length, icon: <FileText className="w-4 h-4" /> },
          { id: 'bank_accounts', label: 'Bank Accounts', count: bankAccounts.length, icon: <Landmark className="w-4 h-4" /> },
          { id: 'receivables', label: 'Receivables', icon: <ArrowDownRight className="w-4 h-4 text-[#e37400]" /> },
          { id: 'payables', label: 'Payables & Bills', count: payables.length, icon: <ArrowUpRight className="w-4 h-4 text-[#d93025]" /> },
          { id: 'cheques', label: 'Cheques', count: cheques.length, icon: <Receipt className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB CONTENT: Transactions Register */}
      {activeTab === 'transactions' && (
        <CoreTable
          title="Transaction Register"
          subtitle="All recorded business inflows, outflows, transfers and receipts"
          data={transactions}
          columns={txnColumns}
          keyExtractor={(t) => t.id}
          searchFilter={(t, q) =>
            t.party.toLowerCase().includes(q.toLowerCase()) ||
            t.description.toLowerCase().includes(q.toLowerCase()) ||
            t.category.toLowerCase().includes(q.toLowerCase())
          }
          addLabel="New Transaction"
          onAdd={() => setTxnModalOpen(true)}
          actions={(t) => (
            <button
              onClick={() => {
                if (confirm(`Delete transaction for ${t.party} (${currency}${t.amount})?`)) {
                  storage.deleteTransaction(t.id);
                  refreshAll();
                }
              }}
              className="p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        />
      )}

      {/* TAB CONTENT: Invoices */}
      {activeTab === 'invoices' && (
        <CoreTable
          title="Customer Invoices Register"
          subtitle="Commercial tax invoices, due dates, payments, and balances"
          data={invoices}
          columns={invoiceColumns}
          keyExtractor={(i) => i.id}
          searchFilter={(i, q) =>
            i.invoiceNumber.toLowerCase().includes(q.toLowerCase()) ||
            i.customerName.toLowerCase().includes(q.toLowerCase())
          }
          addLabel="Create Invoice"
          onAdd={() => setInvoiceModalOpen(true)}
          actions={(i) => (
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => setViewInvoice(i)}
                title="View & Print"
                className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] rounded transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              {i.status !== 'Paid' && (
                <button
                  onClick={() => {
                    const payAmt = Number(prompt(`Record payment for ${i.invoiceNumber}:`, String(i.balance)));
                    if (payAmt > 0) {
                      const newPaid = (i.paidAmount || 0) + payAmt;
                      const newBal = Math.max(0, i.total - newPaid);
                      storage.saveInvoice({
                        ...i,
                        paidAmount: newPaid,
                        balance: newBal,
                        status: newBal === 0 ? 'Paid' : 'Partially Paid'
                      });
                      storage.saveTransaction({
                        type: 'Receipt',
                        category: 'Invoice Clearance',
                        party: i.customerName,
                        description: `Payment against ${i.invoiceNumber}`,
                        amount: payAmt,
                        paymentMode: 'Bank',
                        account: bankAccounts[0]?.bankName || 'HDFC Bank Ltd',
                        date: new Date().toISOString().substring(0, 10),
                        status: 'Completed'
                      });
                      refreshAll();
                    }
                  }}
                  title="Record Payment"
                  className="px-2 py-1 text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] hover:bg-[#ceead6] rounded transition-colors"
                >
                  Pay
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(`Delete invoice ${i.invoiceNumber}?`)) {
                    storage.deleteInvoice(i.id);
                    refreshAll();
                  }
                }}
                className="p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      {/* TAB CONTENT: Bank Accounts */}
      {activeTab === 'bank_accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">Corporate Banking Accounts</h3>
              <p className="text-xs text-[#5f6368]">
                Real-time bank balances, IFSC credentials, and ledger reconciliation.
              </p>
            </div>
            <CoreButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setBankModalOpen(true)}
            >
              Add Bank Account
            </CoreButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="bg-white rounded-xl border border-[#e0e2e6] p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#202124]">{bank.bankName}</h4>
                    <p className="text-xs text-[#5f6368]">{bank.accountName}</p>
                  </div>
                  <span className="text-[10px] font-medium bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">
                    {bank.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#f1f3f4] space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Account Number:</span>
                    <span className="font-mono text-[#202124]">{bank.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">IFSC Code:</span>
                    <span className="font-mono text-[#202124]">{bank.ifsc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Branch:</span>
                    <span className="text-[#202124]">{bank.branch}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-between">
                  <span className="text-xs text-[#5f6368]">Current Balance</span>
                  <span className="text-base font-bold text-[#1a73e8]">
                    {currency}
                    {bank.currentBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Receivables */}
      {activeTab === 'receivables' && (
        <CoreTable
          title="Accounts Receivable Aging"
          subtitle="Customer invoice dues, pending balances and collection aging"
          data={invoices.filter((i) => i.balance > 0)}
          columns={[
            { key: 'customerName', header: 'Party / Client', sortable: true },
            { key: 'invoiceNumber', header: 'Invoice #' },
            { key: 'date', header: 'Invoice Date' },
            { key: 'dueDate', header: 'Due Date', sortable: true },
            {
              key: 'total',
              header: 'Total',
              align: 'right',
              render: (i) => `${currency}${i.total.toLocaleString()}`
            },
            {
              key: 'paidAmount',
              header: 'Paid',
              align: 'right',
              render: (i) => `${currency}${i.paidAmount.toLocaleString()}`
            },
            {
              key: 'balance',
              header: 'Outstanding Balance',
              align: 'right',
              sortable: true,
              render: (i) => (
                <span className="font-bold text-[#d93025]">
                  {currency}
                  {i.balance.toLocaleString()}
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              render: (i) => (
                <span className="text-[11px] font-semibold text-[#c5221f] bg-[#fce8e6] px-2 py-0.5 rounded">
                  {i.status}
                </span>
              )
            }
          ]}
          keyExtractor={(i) => i.id}
        />
      )}

      {/* TAB CONTENT: Payables */}
      {activeTab === 'payables' && (
        <CoreTable
          title="Vendor Payables & Bills"
          subtitle="Outstanding vendor bills, contractor payments and utilities"
          data={payables}
          columns={[
            { key: 'vendorName', header: 'Vendor / Supplier', sortable: true },
            { key: 'billNumber', header: 'Bill #' },
            { key: 'date', header: 'Bill Date' },
            { key: 'dueDate', header: 'Due Date' },
            {
              key: 'amount',
              header: 'Bill Amount',
              align: 'right',
              render: (p) => `${currency}${p.amount.toLocaleString()}`
            },
            {
              key: 'balance',
              header: 'Balance Due',
              align: 'right',
              render: (p) => (
                <span className="font-bold text-[#d93025]">
                  {currency}
                  {p.balance.toLocaleString()}
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              render: (p) => (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    p.status === 'Paid' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'
                  }`}
                >
                  {p.status}
                </span>
              )
            }
          ]}
          keyExtractor={(p) => p.id}
          addLabel="New Vendor Bill"
          onAdd={() => {
            const vendor = prompt('Vendor Name:');
            if (!vendor) return;
            const amount = Number(prompt('Bill Amount:')) || 5000;
            storage.savePayable({
              vendorName: vendor,
              billNumber: `BILL-${Date.now().toString().slice(-4)}`,
              date: new Date().toISOString().substring(0, 10),
              dueDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
              amount,
              paid: 0,
              balance: amount,
              status: 'Pending'
            });
            refreshAll();
          }}
        />
      )}

      {/* TAB CONTENT: Cheques */}
      {activeTab === 'cheques' && (
        <CoreTable
          title="Cheque Register"
          subtitle="Issued and received post-dated cheques, clearance and deposit tracking"
          data={cheques}
          columns={[
            { key: 'chequeNumber', header: 'Cheque #', sortable: true },
            { key: 'party', header: 'Party / Client', sortable: true },
            { key: 'bank', header: 'Bank' },
            { key: 'date', header: 'Cheque Date', sortable: true },
            {
              key: 'type',
              header: 'Type',
              render: (c) => (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    c.type === 'Received' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'
                  }`}
                >
                  {c.type}
                </span>
              )
            },
            {
              key: 'amount',
              header: 'Amount',
              align: 'right',
              sortable: true,
              render: (c) => (
                <span className="font-semibold text-[#202124]">
                  {currency}
                  {c.amount.toLocaleString()}
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              render: (c) => (
                <span className="text-[11px] font-semibold bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded">
                  {c.status}
                </span>
              )
            }
          ]}
          keyExtractor={(c) => c.id}
          addLabel="Record Cheque"
          onAdd={() => {
            const num = prompt('Cheque Number (6 digits):');
            if (!num) return;
            const party = prompt('Party Name:') || 'Client';
            const amount = Number(prompt('Amount:')) || 10000;
            storage.saveCheque({
              chequeNumber: num,
              party,
              bank: 'HDFC Bank',
              date: new Date().toISOString().substring(0, 10),
              type: 'Received',
              amount,
              status: 'Deposited'
            });
            refreshAll();
          }}
        />
      )}

      {/* New Transaction Dialog */}
      <CoreDialog
        open={txnModalOpen}
        onClose={() => setTxnModalOpen(false)}
        title="Record Financial Transaction"
        subtitle="Post income, expense, transfer, or client receipt into account ledgers"
        maxWidth="md"
      >
        <form onSubmit={handleSaveTransaction} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <CoreSelect
              label="Transaction Type"
              value={txnForm.type}
              onChange={(e) => setTxnForm({ ...txnForm, type: e.target.value as TransactionType })}
              options={[
                { value: 'Income', label: 'Income' },
                { value: 'Expense', label: 'Expense' },
                { value: 'Receipt', label: 'Receipt (Client Inflow)' },
                { value: 'Payment', label: 'Payment (Vendor Outflow)' },
                { value: 'Transfer', label: 'Bank / Cash Transfer' },
                { value: 'Adjustment', label: 'Adjustment' }
              ]}
            />
            <CoreInput
              label="Date"
              type="date"
              required
              value={txnForm.date}
              onChange={(e) => setTxnForm({ ...txnForm, date: e.target.value })}
            />
          </div>

          <CoreInput
            label="Party / Beneficiary"
            required
            value={txnForm.party}
            onChange={(e) => setTxnForm({ ...txnForm, party: e.target.value })}
            placeholder="e.g. Horizon Retail Global, Office Landlord, Google Cloud"
          />

          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label={`Amount (${currency})`}
              type="number"
              required
              value={txnForm.amount}
              onChange={(e) => setTxnForm({ ...txnForm, amount: Number(e.target.value) })}
            />
            <CoreSelect
              label="Payment Mode"
              value={txnForm.paymentMode}
              onChange={(e) => setTxnForm({ ...txnForm, paymentMode: e.target.value as PaymentMode })}
              options={[
                { value: 'Bank', label: 'Bank Transfer (NEFT/RTGS)' },
                { value: 'UPI', label: 'UPI / Instant QR' },
                { value: 'Cash', label: 'Cash Register' },
                { value: 'Card', label: 'Corporate Card' },
                { value: 'Cheque', label: 'Bank Cheque' },
                { value: 'Online', label: 'Payment Gateway' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CoreSelect
              label="Account Ledger"
              value={txnForm.account}
              onChange={(e) => setTxnForm({ ...txnForm, account: e.target.value })}
              options={[
                ...bankAccounts.map((b) => ({ value: b.bankName, label: b.bankName })),
                { value: 'Cash Register', label: 'Cash Register (Petty Cash)' }
              ]}
            />
            <CoreInput
              label="Category / Head"
              value={txnForm.category}
              onChange={(e) => setTxnForm({ ...txnForm, category: e.target.value })}
              placeholder="Rent, Consulting Retainer, Software"
            />
          </div>

          <CoreInput
            label="Reference / Cheque / UTR #"
            value={txnForm.reference}
            onChange={(e) => setTxnForm({ ...txnForm, reference: e.target.value })}
            placeholder="e.g. UTR-98218902 or UPI Ref"
          />

          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setTxnModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Save Transaction
            </CoreButton>
          </div>
        </form>
      </CoreDialog>

      {/* New Invoice Dialog */}
      <CoreDialog
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Create New Tax Invoice"
        subtitle="Generate itemized commercial billing invoice with automatic GST/tax math"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveInvoice} className="space-y-3.5">
          <div className="grid grid-cols-3 gap-3">
            <CoreInput
              label="Invoice Number"
              required
              value={invForm.invoiceNumber}
              onChange={(e) => setInvForm({ ...invForm, invoiceNumber: e.target.value })}
            />
            <CoreInput
              label="Invoice Date"
              type="date"
              required
              value={invForm.date}
              onChange={(e) => setInvForm({ ...invForm, date: e.target.value })}
            />
            <CoreInput
              label="Due Date"
              type="date"
              required
              value={invForm.dueDate}
              onChange={(e) => setInvForm({ ...invForm, dueDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Customer / Client Name"
              required
              value={invForm.customerName}
              onChange={(e) => setInvForm({ ...invForm, customerName: e.target.value })}
              placeholder="e.g. Horizon Retail Global"
            />
            <CoreInput
              label="Customer Tax ID / GSTIN"
              value={invForm.customerTaxId}
              onChange={(e) => setInvForm({ ...invForm, customerTaxId: e.target.value })}
              placeholder="e.g. 27AABCA1234F1Z8"
            />
          </div>

          <CoreInput
            label="Billing Address"
            value={invForm.customerAddress}
            onChange={(e) => setInvForm({ ...invForm, customerAddress: e.target.value })}
            placeholder="Tower B, Cyber City, Gurugram, Haryana"
          />

          {/* Line items */}
          <div className="border border-[#e0e2e6] rounded-lg p-3 bg-[#f8f9fa] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#202124]">
              <span>Line Item Deliverable</span>
              <span>Rate × Qty</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <input
                className="col-span-8 h-8 px-2 text-xs bg-white border border-[#dadce0] rounded"
                value={invForm.items[0].description}
                onChange={(e) => {
                  const updated = [...invForm.items];
                  updated[0].description = e.target.value;
                  setInvForm({ ...invForm, items: updated });
                }}
                placeholder="Description of service / milestone"
              />
              <input
                type="number"
                className="col-span-4 h-8 px-2 text-xs bg-white border border-[#dadce0] rounded text-right"
                value={invForm.items[0].unitPrice}
                onChange={(e) => {
                  const updated = [...invForm.items];
                  updated[0].unitPrice = Number(e.target.value);
                  updated[0].amount = updated[0].quantity * Number(e.target.value);
                  setInvForm({ ...invForm, items: updated });
                }}
                placeholder="Unit Rate"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-[#5f6368] pt-1">
              <span>GST Applied: 18%</span>
              <span className="font-semibold text-[#202124]">
                Total Payable: {currency}
                {((invForm.items[0].unitPrice * 1.18)).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setInvoiceModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Generate & Save Invoice
            </CoreButton>
          </div>
        </form>
      </CoreDialog>

      {/* Invoice View / Print Modal */}
      {viewInvoice && (
        <CoreDialog
          open={!!viewInvoice}
          onClose={() => setViewInvoice(null)}
          title={`Invoice: ${viewInvoice.invoiceNumber}`}
          subtitle={`${viewInvoice.customerName} · Due ${viewInvoice.dueDate}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-[#5f6368]">
                Status:{' '}
                <strong className={viewInvoice.balance > 0 ? 'text-[#d93025]' : 'text-[#1e8e3e]'}>
                  {viewInvoice.status}
                </strong>
              </span>
              <div className="flex items-center gap-2">
                <CoreButton
                  variant="outline"
                  size="sm"
                  icon={<Share2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Invoice ${viewInvoice.invoiceNumber} for ${viewInvoice.customerName} - Total: ${currency}${viewInvoice.total}. Due Date: ${viewInvoice.dueDate}`
                    );
                    alert('Invoice summary copied to clipboard for WhatsApp/Email sharing!');
                  }}
                >
                  Share Link
                </CoreButton>
                <CoreButton
                  variant="primary"
                  size="sm"
                  icon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => window.print()}
                >
                  Print / Save PDF
                </CoreButton>
              </div>
            </div>
          }
        >
          {/* Printable Invoice Container */}
          <div className="p-6 bg-white border border-[#e0e2e6] rounded-lg text-xs space-y-6 print:border-none print:p-0">
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between border-b border-[#e0e2e6] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1a73e8] tracking-tight">{company.name}</h2>
                <div className="text-[11px] text-[#5f6368] mt-1 space-y-0.5">
                  <div>{company.address}</div>
                  <div>{company.city}, {company.state} - {company.zipCode}</div>
                  <div>GSTIN/Tax ID: <span className="font-mono text-[#202124]">{company.taxId}</span></div>
                  <div>Email: {company.email} | Phone: {company.phone}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold uppercase text-[#202124]">TAX INVOICE</div>
                <div className="text-xs font-mono font-semibold text-[#1a73e8] mt-1">
                  {viewInvoice.invoiceNumber}
                </div>
                <div className="text-[11px] text-[#5f6368] mt-1">
                  Date: {viewInvoice.date}
                </div>
                <div className="text-[11px] font-semibold text-[#d93025]">
                  Due: {viewInvoice.dueDate}
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#5f6368] tracking-wider">
                  Billed To (Client):
                </span>
                <div className="font-bold text-sm text-[#202124] mt-1">{viewInvoice.customerName}</div>
                <div className="text-[11px] text-[#5f6368] mt-0.5 max-w-xs">
                  {viewInvoice.customerAddress || 'Client Registered Address'}
                </div>
                {viewInvoice.customerTaxId && (
                  <div className="text-[11px] text-[#5f6368] mt-0.5">
                    GSTIN/Tax ID: <span className="font-mono text-[#202124]">{viewInvoice.customerTaxId}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase text-[#5f6368] tracking-wider">
                  Payment Status:
                </span>
                <div className="font-bold text-sm text-[#1a73e8] mt-1">{viewInvoice.status}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full border-collapse border border-[#e0e2e6]">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e0e2e6] text-[#5f6368] font-semibold text-left">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Description of Services</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Unit Price</th>
                  <th className="py-2 px-3 text-right">Amount ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f4]">
                {viewInvoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3 text-[#5f6368]">{index + 1}</td>
                    <td className="py-2 px-3 font-medium text-[#202124]">{item.description}</td>
                    <td className="py-2 px-3 text-center text-[#5f6368]">{item.quantity}</td>
                    <td className="py-2 px-3 text-right text-[#5f6368]">
                      {currency}{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-[#202124]">
                      {currency}{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Calculation */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-right">
                <div className="flex justify-between text-[#5f6368]">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#202124]">
                    {currency}{viewInvoice.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#5f6368]">
                  <span>IGST / Tax (18%):</span>
                  <span className="font-medium text-[#202124]">
                    {currency}{viewInvoice.taxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-[#e0e2e6] pt-1 text-[#202124]">
                  <span>Total Amount:</span>
                  <span className="text-[#1a73e8]">
                    {currency}{viewInvoice.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#1e8e3e]">
                  <span>Amount Paid:</span>
                  <span>{currency}{viewInvoice.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-[#e0e2e6] pt-1 text-[#d93025]">
                  <span>Balance Due:</span>
                  <span>{currency}{viewInvoice.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bank details & Terms */}
            <div className="border-t border-[#e0e2e6] pt-4 grid grid-cols-2 gap-4 text-[11px] text-[#5f6368]">
              <div>
                <span className="font-semibold text-[#202124]">Bank Remittance Details:</span>
                <div>Bank: {bankAccounts[0]?.bankName || 'HDFC Bank Ltd'}</div>
                <div>A/c No: {bankAccounts[0]?.accountNumber || '50200045892110'}</div>
                <div>IFSC: {bankAccounts[0]?.ifsc || 'HDFC0000060'}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#202124]">For {company.name}</div>
                <div className="h-10" />
                <div className="text-[10px] text-[#80868b]">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </CoreDialog>
      )}

      {/* Add Bank Modal */}
      <CoreDialog
        open={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        title="Add Corporate Bank Account"
        subtitle="Configure institutional bank account credentials and ledger"
        maxWidth="md"
      >
        <form onSubmit={handleSaveBank} className="space-y-3">
          <CoreInput
            label="Bank Name"
            required
            value={bankForm.bankName}
            onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
            placeholder="e.g. HDFC Bank, ICICI Bank, State Bank of India"
          />
          <CoreInput
            label="Account Title / Purpose"
            value={bankForm.accountName}
            onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
            placeholder="e.g. Current Account - Main Operations"
          />
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Account Number"
              required
              value={bankForm.accountNumber}
              onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
              placeholder="e.g. 50200012345678"
            />
            <CoreInput
              label="IFSC Code"
              required
              value={bankForm.ifsc}
              onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value })}
              placeholder="e.g. HDFC0000060"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Branch Location"
              value={bankForm.branch}
              onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
              placeholder="e.g. BKC, Mumbai"
            />
            <CoreInput
              label={`Opening Balance (${currency})`}
              type="number"
              value={bankForm.openingBalance}
              onChange={(e) => setBankForm({ ...bankForm, openingBalance: Number(e.target.value) })}
            />
          </div>
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setBankModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Save Account
            </CoreButton>
          </div>
        </form>
      </CoreDialog>
    </div>
  );
};
