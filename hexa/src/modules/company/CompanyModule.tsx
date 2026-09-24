import React, { useState } from 'react';
import {
  Building2,
  GitBranch,
  Users,
  Shield,
  Check,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Company, CompanyBranch, AppUser, RolePermission, UserRole } from '../../types';
import { CoreTabs, CoreButton, CoreInput, CoreSelect, CoreDialog } from '../../components/common/CoreComponents';
import { CoreTable, Column } from '../../components/common/CoreTable';

export const CompanyModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [company, setCompany] = useState(storage.getActiveCompany());
  const [users, setUsers] = useState(storage.getUsers());
  const [roles, setRoles] = useState(storage.getRoles());

  // Company Profile Form state
  const [name, setName] = useState(company.name);
  const [legalName, setLegalName] = useState(company.legalName);
  const [email, setEmail] = useState(company.email);
  const [phone, setPhone] = useState(company.phone);
  const [website, setWebsite] = useState(company.website || '');
  const [address, setAddress] = useState(company.address);
  const [city, setCity] = useState(company.city);
  const [state, setState] = useState(company.state);
  const [zipCode, setZipCode] = useState(company.zipCode);
  const [taxId, setTaxId] = useState(company.taxId);
  const [currency, setCurrency] = useState(company.currency);
  const [invoicePrefix, setInvoicePrefix] = useState(company.invoicePrefix);
  const [receiptPrefix, setReceiptPrefix] = useState(company.receiptPrefix);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Branch Modal
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchManager, setBranchManager] = useState('');

  // User Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<UserRole>('Manager');

  const branchColumns: Column<CompanyBranch>[] = [
    { key: 'name', header: 'Branch Name', sortable: true },
    { key: 'code', header: 'Branch Code' },
    { key: 'address', header: 'Address' },
    { key: 'manager', header: 'Branch Head' },
    {
      key: 'status',
      header: 'Status',
      render: (b) => (
        <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">
          {b.status}
        </span>
      )
    }
  ];

  const userColumns: Column<AppUser>[] = [
    {
      key: 'name',
      header: 'User Name',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2">
          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-[#202124]">{u.name}</div>
            <div className="text-[11px] text-[#5f6368]">{u.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u) => (
        <span className="text-[11px] font-semibold bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded">
          {u.role}
        </span>
      )
    },
    { key: 'lastActive', header: 'Last Active' },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">
          {u.status}
        </span>
      )
    }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Company = {
      ...company,
      name,
      legalName,
      email,
      phone,
      website,
      address,
      city,
      state,
      zipCode,
      taxId,
      currency,
      invoicePrefix,
      receiptPrefix
    };
    storage.saveCompany(updated);
    setCompany(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    const newBranch: CompanyBranch = {
      id: `br_${Date.now()}`,
      name: branchName.trim(),
      code: branchCode.trim().toUpperCase() || 'BR',
      address: branchAddress.trim() || 'Regional Office',
      manager: branchManager.trim() || 'Branch In-Charge',
      status: 'Active'
    };

    const updated = {
      ...company,
      branches: [...company.branches, newBranch]
    };
    storage.saveCompany(updated);
    setCompany(updated);
    setBranchModalOpen(false);
    setBranchName('');
    setBranchCode('');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uName.trim() || !uEmail.trim()) return;

    const newUser: AppUser = {
      id: `usr_${Date.now()}`,
      name: uName.trim(),
      email: uEmail.trim(),
      role: uRole,
      status: 'Active',
      lastActive: 'Just now',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces`
    };

    storage.saveUser(newUser);
    setUsers(storage.getUsers());
    setUserModalOpen(false);
    setUName('');
    setUEmail('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Organization, Branches & Governance</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Configure legal entity profiles, multi-location branches, and user permission matrices.
          </p>
        </div>
      </div>

      <CoreTabs
        tabs={[
          { id: 'profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
          { id: 'branches', label: 'Branches & Locations', count: company.branches.length, icon: <GitBranch className="w-4 h-4" /> },
          { id: 'users', label: 'Users & Staff Logins', count: users.length, icon: <Users className="w-4 h-4" /> },
          { id: 'roles', label: 'Roles & RBAC Matrix', count: roles.length, icon: <Shield className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 1. COMPANY PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">Corporate Information</h3>
              <p className="text-xs text-[#5f6368]">Used on tax invoices, letterheads, and government filings</p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-[#1e8e3e] flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved Successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CoreInput
              label="Company Trade Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CoreInput
              label="Legal Registered Name"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CoreInput
              label="Official Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CoreInput
              label="Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <CoreInput
              label="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <CoreInput
            label="Corporate Headquarters Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CoreInput
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <CoreInput
              label="State / Province"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <CoreInput
              label="Postal Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#f1f3f4]">
            <CoreInput
              label="Tax ID / GSTIN"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
            />
            <CoreInput
              label="Invoice Number Prefix"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
            />
            <CoreSelect
              label="Default Currency"
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

          <div className="pt-4 border-t border-[#e0e2e6] flex justify-end">
            <CoreButton variant="primary" type="submit">
              Save Profile Changes
            </CoreButton>
          </div>
        </form>
      )}

      {/* 2. BRANCHES */}
      {activeTab === 'branches' && (
        <CoreTable
          title="Multi-Location Corporate Branches"
          subtitle="Operating locations, branch codes, and local branch managers"
          data={company.branches}
          columns={branchColumns}
          keyExtractor={(b) => b.id}
          addLabel="Add Branch"
          onAdd={() => setBranchModalOpen(true)}
        />
      )}

      {/* 3. USERS */}
      {activeTab === 'users' && (
        <CoreTable
          title="System Users & Operators"
          subtitle="Active user credentials, roles, and administrative access"
          data={users}
          columns={userColumns}
          keyExtractor={(u) => u.id}
          addLabel="Invite User"
          onAdd={() => setUserModalOpen(true)}
        />
      )}

      {/* 4. ROLES & RBAC */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e0e2e6] p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-[#202124]">Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-[#5f6368] mb-4">
              Configured security permissions per role across system modules.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-[#e0e2e6]">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#e0e2e6] text-[#5f6368]">
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Modules Permitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f4]">
                  {roles.map((r) => (
                    <tr key={r.role}>
                      <td className="py-2.5 px-3 font-semibold text-[#1a73e8]">{r.role}</td>
                      <td className="py-2.5 px-3 text-[#5f6368]">{r.description}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {r.modules.map((m) => (
                            <span key={m} className="px-2 py-0.5 bg-[#f1f3f4] text-[#3c4043] rounded text-[10px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      <CoreDialog
        open={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        title="Add Corporate Branch"
        subtitle="Establish regional operating branch for transactions"
        maxWidth="md"
      >
        <form onSubmit={handleSaveBranch} className="space-y-3">
          <CoreInput
            label="Branch Name"
            required
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="e.g. Pune Tech Hub, Delhi Liaison Office"
          />
          <CoreInput
            label="Branch Code"
            required
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
            placeholder="e.g. PN01"
          />
          <CoreInput
            label="Branch Address"
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value)}
            placeholder="Building 4, Hinjewadi Phase 1"
          />
          <CoreInput
            label="Branch In-Charge / Manager"
            value={branchManager}
            onChange={(e) => setBranchManager(e.target.value)}
            placeholder="Vikram Malhotra"
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setBranchModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Save Branch
            </CoreButton>
          </div>
        </form>
      </CoreDialog>

      {/* User Modal */}
      <CoreDialog
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="Invite App User"
        subtitle="Authorize team member access to company operations"
        maxWidth="md"
      >
        <form onSubmit={handleSaveUser} className="space-y-3">
          <CoreInput
            label="Full Name"
            required
            value={uName}
            onChange={(e) => setUName(e.target.value)}
            placeholder="e.g. Maya Swaminathan"
          />
          <CoreInput
            label="Corporate Email"
            type="email"
            required
            value={uEmail}
            onChange={(e) => setUEmail(e.target.value)}
            placeholder="maya@company.com"
          />
          <CoreSelect
            label="Assigned Role"
            value={uRole}
            onChange={(e) => setURole(e.target.value as UserRole)}
            options={[
              { value: 'Admin', label: 'Admin (Full Access)' },
              { value: 'Manager', label: 'Manager' },
              { value: 'Accountant', label: 'Accountant (Financial Ledgers)' },
              { value: 'Sales', label: 'Sales (CRM & Invoices)' },
              { value: 'Compliance Officer', label: 'Compliance Officer' },
              { value: 'Viewer', label: 'Viewer (Read-Only)' }
            ]}
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setUserModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Grant Access
            </CoreButton>
          </div>
        </form>
      </CoreDialog>
    </div>
  );
};
