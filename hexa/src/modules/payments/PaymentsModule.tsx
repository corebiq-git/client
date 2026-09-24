import React, { useState } from 'react';
import {
  BadgeDollarSign,
  QrCode,
  Link2,
  CheckCircle,
  Copy,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { storage } from '../../services/storage';
import { PaymentGatewayConfig, PaymentLink } from '../../types';
import { CoreTabs, CoreButton, CoreDialog, CoreInput, CoreSelect } from '../../components/common/CoreComponents';
import { CoreTable, Column } from '../../components/common/CoreTable';

export const PaymentsModule: React.FC = () => {
  const company = storage.getActiveCompany();
  const currency = company?.currency || '₹';

  const [activeTab, setActiveTab] = useState('gateways');
  const [gateways, setGateways] = useState(storage.getPaymentGateways());
  const [paymentLinks, setPaymentLinks] = useState(storage.getPaymentLinks());

  // Link Modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [party, setParty] = useState('');
  const [amount, setAmount] = useState(15000);
  const [purpose, setPurpose] = useState('Consulting Retainer Milestone');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refresh = () => {
    setGateways(storage.getPaymentGateways());
    setPaymentLinks(storage.getPaymentLinks());
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!party.trim() || amount <= 0) return;

    const linkId = `pl_${Date.now().toString().slice(-6)}`;
    const newLink: PaymentLink = {
      id: linkId,
      customerName: party.trim(),
      amount: Number(amount),
      currency: currency === '₹' ? 'INR' : 'USD',
      description: purpose.trim(),
      url: `https://pay.corebiq.io/l/${linkId}`,
      status: 'Active',
      createdAt: new Date().toISOString().substring(0, 10),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10)
    };

    storage.savePaymentLink(newLink);
    setLinkModalOpen(false);
    setParty('');
    refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Digital Payments & Gateway Integration</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Generic payment adapter connecting Razorpay, Stripe, UPI Intent, and client payment links.
          </p>
        </div>
        <CoreButton
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setLinkModalOpen(true)}
        >
          Generate Payment Link
        </CoreButton>
      </div>

      <CoreTabs
        tabs={[
          { id: 'gateways', label: 'Payment Gateways & UPI', count: gateways.length, icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'links', label: 'Active Payment Links', count: paymentLinks.length, icon: <Link2 className="w-4 h-4" /> },
          { id: 'reconciliation', label: 'Gateway Reconciliation', icon: <RefreshCw className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 1. GATEWAYS */}
      {activeTab === 'gateways' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gateways.map((gw) => (
            <div
              key={gw.id}
              className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[#202124]">{gw.provider}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      gw.status === 'Active'
                        ? 'bg-[#e6f4ea] text-[#137333]'
                        : 'bg-[#f1f3f4] text-[#5f6368]'
                    }`}
                  >
                    {gw.status}
                  </span>
                </div>
                <p className="text-xs text-[#5f6368]">{gw.name}</p>
                <div className="mt-3 p-2 bg-[#f8f9fa] rounded text-[11px] font-mono text-[#5f6368] truncate">
                  Key: {gw.merchantId || gw.keyId || 'live_api_key_****'}
                </div>
              </div>

              <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-between">
                <span className="text-[11px] text-[#5f6368]">Auto Webhook Sync</span>
                <span className="text-xs font-semibold text-[#1e8e3e]">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. PAYMENT LINKS */}
      {activeTab === 'links' && (
        <CoreTable<PaymentLink>
          title="Generated Payment Links"
          subtitle="Instant checkout URLs for invoice settlement and customer advance retainers"
          data={paymentLinks}
          columns={[
            { key: 'customerName', header: 'Client / Debtor', sortable: true },
            {
              key: 'amount',
              header: 'Payable Amount',
              sortable: true,
              render: (l) => (
                <span className="font-bold text-[#1a73e8]">
                  {currency}{l.amount.toLocaleString()}
                </span>
              )
            },
            { key: 'description', header: 'Description / Purpose' },
            {
              key: 'url',
              header: 'Payment URL',
              render: (l) => (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#5f6368] truncate max-w-[200px]">
                    {l.url}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(l.url);
                      setCopiedId(l.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="p-1 hover:bg-[#f1f3f4] rounded text-[#1a73e8]"
                    title="Copy Link"
                  >
                    {copiedId === l.id ? <CheckCircle className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )
            },
            { key: 'expiresAt', header: 'Expires' },
            {
              key: 'status',
              header: 'Status',
              render: (l) => (
                <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">
                  {l.status}
                </span>
              )
            }
          ]}
          keyExtractor={(l) => l.id}
          addLabel="Generate Link"
          onAdd={() => setLinkModalOpen(true)}
        />
      )}

      {/* 3. RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#e0e2e6] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">Automated Settlement Reconciliation</h3>
              <p className="text-xs text-[#5f6368]">
                Match gateway payouts directly with corporate bank ledger entries.
              </p>
            </div>
            <CoreButton
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => alert('All gateway settlements matched with bank credit transactions.')}
            >
              Sync Gateway Payouts
            </CoreButton>
          </div>

          <div className="p-4 bg-[#f8f9fa] rounded-lg border border-[#dadce0] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#5f6368]">Total Gateway Collections this Month:</span>
              <span className="font-semibold text-[#202124]">{currency}142,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5f6368]">Settled to HDFC Current Account:</span>
              <span className="font-semibold text-[#1e8e3e]">{currency}142,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5f6368]">Unreconciled Variance:</span>
              <span className="font-semibold text-[#137333]">{currency}0.00 (Balanced)</span>
            </div>
          </div>
        </div>
      )}

      {/* Generate Link Dialog */}
      <CoreDialog
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        title="Create Customer Payment Link"
        subtitle="Generate instant payment URL with predefined amount and purpose"
        maxWidth="md"
      >
        <form onSubmit={handleCreateLink} className="space-y-3">
          <CoreInput
            label="Client / Debtor Name"
            required
            value={party}
            onChange={(e) => setParty(e.target.value)}
            placeholder="e.g. Horizon Retail Global"
          />
          <CoreInput
            label={`Payable Amount (${currency})`}
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <CoreInput
            label="Purpose / Milestone Reference"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Milestone 2 Deliverable"
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setLinkModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Generate & Copy Link
            </CoreButton>
          </div>
        </form>
      </CoreDialog>
    </div>
  );
};
