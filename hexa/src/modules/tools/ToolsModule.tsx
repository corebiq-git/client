import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  Percent,
  Calendar,
  QrCode,
  FileSpreadsheet,
  Download,
  Copy,
  RefreshCw,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { storage } from '../../services/storage';
import { CoreTabs, CoreButton, CoreInput, CoreSelect, CoreCard } from '../../components/common/CoreComponents';

interface ToolsModuleProps {
  initialSubTab?: string;
}

export const ToolsModule: React.FC<ToolsModuleProps> = ({
  initialSubTab = 'tax_calc'
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab || 'tax_calc');
  const company = storage.getActiveCompany();
  const currency = company?.currency || '₹';

  // --- 1. TAX / GST CALCULATOR STATE ---
  const [taxAmount, setTaxAmount] = useState(10000);
  const [taxRate, setTaxRate] = useState(18);
  const [taxMode, setTaxMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // Calculations:
  const taxExclusiveMath = {
    base: taxAmount,
    tax: (taxAmount * taxRate) / 100,
    cgst: (taxAmount * (taxRate / 2)) / 100,
    sgst: (taxAmount * (taxRate / 2)) / 100,
    total: taxAmount + (taxAmount * taxRate) / 100
  };

  const taxInclusiveMath = {
    base: (taxAmount * 100) / (100 + taxRate),
    tax: taxAmount - (taxAmount * 100) / (100 + taxRate),
    cgst: (taxAmount - (taxAmount * 100) / (100 + taxRate)) / 2,
    sgst: (taxAmount - (taxAmount * 100) / (100 + taxRate)) / 2,
    total: taxAmount
  };

  const taxResult = taxMode === 'exclusive' ? taxExclusiveMath : taxInclusiveMath;

  // --- 2. STANDARD & FINANCIAL CALCULATOR STATE ---
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcMemory, setCalcMemory] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (calcWaitingForOperand) {
      setCalcDisplay(digit);
      setCalcWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const performOp = (nextOp: string) => {
    const inputVal = parseFloat(calcDisplay);
    if (calcMemory === null) {
      setCalcMemory(inputVal);
    } else if (calcOp) {
      const current = calcMemory || 0;
      let computed = inputVal;
      if (calcOp === '+') computed = current + inputVal;
      if (calcOp === '-') computed = current - inputVal;
      if (calcOp === '×') computed = current * inputVal;
      if (calcOp === '÷') computed = inputVal !== 0 ? current / inputVal : 0;
      setCalcMemory(computed);
      setCalcDisplay(String(computed));
    }
    setCalcWaitingForOperand(true);
    setCalcOp(nextOp);
  };

  // --- 3. DATE & WORKING DAYS CALCULATOR ---
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10)
  );

  const daysDifference = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate approximate business days (excluding Saturday & Sunday)
  const businessDays = (() => {
    let count = 0;
    const cur = new Date(startDate);
    const end = new Date(endDate);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  })();

  // --- 4. PAYMENT QR GENERATOR ---
  const [vpa, setVpa] = useState('apexsolutions@hdfcbank');
  const [payeeName, setPayeeName] = useState(company.name);
  const [qrAmount, setQrAmount] = useState(5000);
  const [note, setNote] = useState('Invoice Payment');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const upiPayload = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(
    payeeName
  )}&am=${qrAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    QRCode.toDataURL(upiPayload, { width: 280, margin: 1 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR error', err));
  }, [upiPayload]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Business Tools & Financial Utilities</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Instant GST & Tax calculators, UPI payment QR generator, date/working days math, and CSV tools.
          </p>
        </div>
      </div>

      <CoreTabs
        tabs={[
          { id: 'tax_calc', label: 'GST & Tax Calculator', icon: <Percent className="w-4 h-4" /> },
          { id: 'payment_qr', label: 'Payment QR (UPI)', icon: <QrCode className="w-4 h-4" /> },
          { id: 'calculator', label: 'Financial Calculator', icon: <Calculator className="w-4 h-4" /> },
          { id: 'date_calc', label: 'Date & Due Days', icon: <Calendar className="w-4 h-4" /> },
          { id: 'csv_tools', label: 'CSV Import & Export', icon: <FileSpreadsheet className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 1. TAX / GST CALCULATOR */}
      {activeTab === 'tax_calc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#202124]">Tax Rate & Amount Input</h3>
            <CoreInput
              label={`Amount (${currency})`}
              type="number"
              value={taxAmount}
              onChange={(e) => setTaxAmount(Number(e.target.value))}
            />
            <div className="grid grid-cols-2 gap-3">
              <CoreSelect
                label="GST / Tax Slab Rate"
                value={String(taxRate)}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                options={[
                  { value: '5', label: '5% (Essential Services)' },
                  { value: '12', label: '12% (Standard)' },
                  { value: '18', label: '18% (Corporate / Consulting)' },
                  { value: '28', label: '28% (Luxury / Specific)' },
                  { value: '0', label: '0% (Exempt / Nil)' }
                ]}
              />
              <CoreSelect
                label="Calculation Mode"
                value={taxMode}
                onChange={(e) => setTaxMode(e.target.value as any)}
                options={[
                  { value: 'exclusive', label: 'Tax Exclusive (Add Tax)' },
                  { value: 'inclusive', label: 'Tax Inclusive (Extract Tax)' }
                ]}
              />
            </div>
            <p className="text-xs text-[#5f6368]">
              Automated dual calculation computes split CGST (Central) and SGST (State) for intra-state supply or full IGST for inter-state transactions.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#202124] mb-3">Statutory Tax Breakdown</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2 rounded bg-[#f8f9fa]">
                  <span className="text-[#5f6368]">Net Base Amount:</span>
                  <span className="font-semibold text-[#202124]">
                    {currency}{taxResult.base.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#f8f9fa]">
                  <span className="text-[#5f6368]">CGST ({taxRate / 2}%):</span>
                  <span className="font-semibold text-[#1a73e8]">
                    {currency}{taxResult.cgst.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#f8f9fa]">
                  <span className="text-[#5f6368]">SGST ({taxRate / 2}%):</span>
                  <span className="font-semibold text-[#1a73e8]">
                    {currency}{taxResult.sgst.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#f8f9fa]">
                  <span className="text-[#5f6368]">Total Tax Portion:</span>
                  <span className="font-semibold text-[#e37400]">
                    {currency}{taxResult.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-[#e8f0fe] text-sm">
                  <span className="font-bold text-[#1a73e8]">Gross Total (Invoice Value):</span>
                  <span className="font-bold text-[#1a73e8]">
                    {currency}{taxResult.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENT QR GENERATOR */}
      {activeTab === 'payment_qr' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#202124]">Instant UPI Payment QR Builder</h3>
            <CoreInput
              label="Payee UPI VPA ID"
              value={vpa}
              onChange={(e) => setVpa(e.target.value)}
              placeholder="company@bank"
            />
            <CoreInput
              label="Payee Business Name"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="Apex Solutions Pvt Ltd"
            />
            <div className="grid grid-cols-2 gap-3">
              <CoreInput
                label="Payment Amount (₹)"
                type="number"
                value={qrAmount}
                onChange={(e) => setQrAmount(Number(e.target.value))}
              />
              <CoreInput
                label="Payment Note / Invoice Ref"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="pt-2 flex gap-2">
              <CoreButton
                variant="outline"
                size="sm"
                icon={copiedLink ? <Check className="w-4 h-4 text-[#1e8e3e]" /> : <Copy className="w-4 h-4" />}
                onClick={() => {
                  navigator.clipboard.writeText(upiPayload);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
              >
                {copiedLink ? 'URI Copied' : 'Copy UPI Intent'}
              </CoreButton>
              <CoreButton
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `UPI_QR_${qrAmount}_${Date.now()}.png`;
                  link.href = qrDataUrl;
                  link.click();
                }}
              >
                Download QR PNG
              </CoreButton>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-white border border-[#dadce0] rounded-xl shadow-xs inline-block">
              {qrDataUrl && <img src={qrDataUrl} alt="UPI QR Code" className="w-56 h-56" />}
            </div>
            <div className="mt-4">
              <div className="font-bold text-base text-[#202124]">Scan & Pay ₹{qrAmount.toLocaleString()}</div>
              <div className="text-xs text-[#5f6368] mt-0.5">
                Payee: <span className="font-semibold text-[#1a73e8]">{payeeName}</span> ({vpa})
              </div>
              <div className="text-[11px] text-[#80868b] mt-1">
                Compatible with Google Pay, PhonePe, Paytm, BHIM and all banking apps.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FINANCIAL CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="max-w-xs mx-auto bg-white rounded-2xl border border-[#dadce0] p-4 shadow-md space-y-3">
          <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-3 text-right">
            <div className="text-[10px] text-[#80868b] h-4">{calcOp ? `${calcMemory} ${calcOp}` : ''}</div>
            <div className="text-2xl font-mono font-bold text-[#202124] truncate">{calcDisplay}</div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
            {['C', '±', '%', '÷'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') {
                    setCalcDisplay('0');
                    setCalcMemory(null);
                    setCalcOp(null);
                  } else if (btn === '÷') {
                    performOp('÷');
                  }
                }}
                className="h-11 rounded-lg bg-[#f1f3f4] text-[#202124] hover:bg-[#e8eaed] active:bg-[#dadce0] transition-colors"
              >
                {btn}
              </button>
            ))}
            {['7', '8', '9', '×'].map((btn) => (
              <button
                key={btn}
                onClick={() => (btn === '×' ? performOp('×') : inputDigit(btn))}
                className={`h-11 rounded-lg transition-colors ${
                  btn === '×'
                    ? 'bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#d2e3fc]'
                    : 'bg-white border border-[#e0e2e6] hover:bg-[#f8f9fa]'
                }`}
              >
                {btn}
              </button>
            ))}
            {['4', '5', '6', '-'].map((btn) => (
              <button
                key={btn}
                onClick={() => (btn === '-' ? performOp('-') : inputDigit(btn))}
                className={`h-11 rounded-lg transition-colors ${
                  btn === '-'
                    ? 'bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#d2e3fc]'
                    : 'bg-white border border-[#e0e2e6] hover:bg-[#f8f9fa]'
                }`}
              >
                {btn}
              </button>
            ))}
            {['1', '2', '3', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => (btn === '+' ? performOp('+') : inputDigit(btn))}
                className={`h-11 rounded-lg transition-colors ${
                  btn === '+'
                    ? 'bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#d2e3fc]'
                    : 'bg-white border border-[#e0e2e6] hover:bg-[#f8f9fa]'
                }`}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => inputDigit('0')}
              className="col-span-2 h-11 rounded-lg bg-white border border-[#e0e2e6] hover:bg-[#f8f9fa]"
            >
              0
            </button>
            <button
              onClick={() => {
                if (!calcDisplay.includes('.')) inputDigit('.');
              }}
              className="h-11 rounded-lg bg-white border border-[#e0e2e6] hover:bg-[#f8f9fa]"
            >
              .
            </button>
            <button
              onClick={() => performOp('=')}
              className="h-11 rounded-lg bg-[#1a73e8] text-white hover:bg-[#1557b0] shadow-xs"
            >
              =
            </button>
          </div>
        </div>
      )}

      {/* 4. DATE & BUSINESS DAYS CALCULATOR */}
      {activeTab === 'date_calc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#202124]">Duration & Maturity Calculator</h3>
            <CoreInput
              label="Start Date / Agreement Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <CoreInput
              label="End Date / Maturity Due Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-[#202124]">Calculated Working Days</h3>
            <div className="p-4 bg-[#f8f9fa] rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5f6368]">Total Calendar Days:</span>
                <span className="font-bold text-[#202124]">{daysDifference} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f6368]">Estimated Business Days (Mon-Fri):</span>
                <span className="font-bold text-[#1a73e8]">{businessDays} working days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f6368]">Weeks:</span>
                <span className="font-bold text-[#202124]">
                  {(daysDifference / 7).toFixed(1)} weeks
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CSV TOOLS */}
      {activeTab === 'csv_tools' && (
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-[#202124]">CSV Data Import & Export Hub</h3>
          <p className="text-xs text-[#5f6368]">
            Directly export clean CSV files for accounting ledgers, customers, transactions and tax filing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <CoreButton
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={() => {
                const txns = storage.getTransactions();
                const headers = 'Date,Type,Party,Amount,PaymentMode,Account,Category,Status\n';
                const rows = txns
                  .map(
                    (t) =>
                      `"${t.date}","${t.type}","${t.party}",${t.amount},"${t.paymentMode}","${t.account}","${t.category}","${t.status}"`
                  )
                  .join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transactions_${Date.now()}.csv`;
                a.click();
              }}
            >
              Export Transactions CSV
            </CoreButton>

            <CoreButton
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={() => {
                const custs = storage.getCustomers();
                const headers = 'Name,CompanyName,Mobile,Email,City,State,OutstandingBalance,Status\n';
                const rows = custs
                  .map(
                    (c) =>
                      `"${c.name}","${c.companyName || ''}","${c.mobile}","${c.email}","${c.city}","${c.state}",${c.outstandingBalance},"${c.status}"`
                  )
                  .join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `customers_${Date.now()}.csv`;
                a.click();
              }}
            >
              Export Customers CSV
            </CoreButton>

            <CoreButton
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={() => {
                const comps = storage.getCompliance();
                const headers = 'Name,Category,Period,DueDate,AssignedTo,Status,ARN\n';
                const rows = comps
                  .map(
                    (c) =>
                      `"${c.name}","${c.category}","${c.period}","${c.dueDate}","${c.assignedTo}","${c.status}","${c.acknowledgementNumber || ''}"`
                  )
                  .join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compliance_${Date.now()}.csv`;
                a.click();
              }}
            >
              Export Compliance CSV
            </CoreButton>
          </div>
        </div>
      )}
    </div>
  );
};
