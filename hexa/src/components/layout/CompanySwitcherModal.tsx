import React, { useState } from 'react';
import { Company } from '../../types';
import { storage } from '../../services/storage';
import { CoreDialog, CoreInput, CoreSelect, CoreButton } from '../common/CoreComponents';

interface CompanySwitcherModalProps {
  open: boolean;
  onClose: () => void;
  onCompanyCreated: (company: Company) => void;
}

export const CompanySwitcherModal: React.FC<CompanySwitcherModalProps> = ({
  open,
  onClose,
  onCompanyCreated
}) => {
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [taxId, setTaxId] = useState('');
  const [currency, setCurrency] = useState('₹');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCompany: Company = {
      id: `comp_${Date.now()}`,
      name: name.trim(),
      legalName: legalName.trim() || name.trim(),
      email: email.trim() || 'admin@' + name.toLowerCase().replace(/\s+/g, '') + '.com',
      phone: phone.trim() || '+91 98000 00000',
      address: address.trim() || 'Business Park',
      city: city.trim() || 'Mumbai',
      state: state.trim() || 'Maharashtra',
      country: 'India',
      zipCode: '400001',
      taxId: taxId.trim() || '27AAACA0000A1Z5',
      currency,
      currencyCode: currency === '₹' ? 'INR' : currency === '$' ? 'USD' : 'EUR',
      financialYearStart: '04-01',
      invoicePrefix: `${name.substring(0, 3).toUpperCase()}/26/`,
      receiptPrefix: 'REC/',
      estimatePrefix: 'EST/',
      branches: [
        {
          id: `br_${Date.now()}`,
          name: 'Main Office',
          code: 'MAIN',
          address: address.trim() || 'Headquarters',
          manager: 'Admin',
          status: 'Active'
        }
      ]
    };

    storage.saveCompany(newCompany);
    storage.setActiveCompanyId(newCompany.id);
    onCompanyCreated(newCompany);
    onClose();
  };

  return (
    <CoreDialog
      open={open}
      onClose={onClose}
      title="Create New Business Company"
      subtitle="COREBIQ multi-tenant isolation keeps all accounts, transactions, and customers strictly segregated."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <CoreInput
          label="Company Brand Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Apex Health Ventures, Veritas Legal LLP"
        />
        <CoreInput
          label="Legal Registered Name"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          placeholder="e.g. Apex Health Ventures Pvt. Ltd."
        />
        <div className="grid grid-cols-2 gap-3">
          <CoreInput
            label="Official Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="finance@company.com"
          />
          <CoreInput
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98200 00000"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CoreInput
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai / Delhi / Bengaluru"
          />
          <CoreInput
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Maharashtra / Karnataka"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CoreInput
            label="Tax ID / GSTIN"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="e.g. 27AABCA1234F1Z8"
          />
          <CoreSelect
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { value: '₹', label: '₹ (INR - Indian Rupee)' },
              { value: '$', label: '$ (USD - US Dollar)' },
              { value: '€', label: '€ (EUR - Euro)' },
              { value: '£', label: '£ (GBP - British Pound)' },
              { value: 'AED', label: 'AED (UAE Dirham)' }
            ]}
          />
        </div>

        <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
          <CoreButton variant="outline" type="button" onClick={onClose}>
            Cancel
          </CoreButton>
          <CoreButton variant="primary" type="submit" disabled={!name.trim()}>
            Create & Switch Workspace
          </CoreButton>
        </div>
      </form>
    </CoreDialog>
  );
};
