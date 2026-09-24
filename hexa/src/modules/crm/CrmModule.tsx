import React, { useState } from 'react';
import {
  Users,
  Target,
  Contact2,
  CalendarClock,
  ListTodo,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  DollarSign,
  Eye,
  Trash2,
  Edit2,
  Building,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Customer, Lead, Contact, FollowUp, Task, LeadStage } from '../../types';
import { CoreTabs, CoreButton, CoreDialog, CoreInput, CoreSelect } from '../../components/common/CoreComponents';
import { CoreTable, Column } from '../../components/common/CoreTable';

interface CrmModuleProps {
  initialSubTab?: string;
  onNavigateToInvoice?: (customerId: string) => void;
  onNavigateToTransaction?: (partyName: string) => void;
}

export const CrmModule: React.FC<CrmModuleProps> = ({
  initialSubTab = 'customers',
  onNavigateToInvoice,
  onNavigateToTransaction
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab || 'customers');
  const company = storage.getActiveCompany();
  const currency = company?.currency || '₹';

  // State
  const [customers, setCustomers] = useState(storage.getCustomers());
  const [leads, setLeads] = useState(storage.getLeads());
  const [contacts, setContacts] = useState(storage.getContacts());
  const [followups, setFollowups] = useState(storage.getFollowUps());
  const [tasks, setTasks] = useState(storage.getTasks());

  // Dialogs
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewCustomerProfile, setViewCustomerProfile] = useState<Customer | null>(null);

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [followupModalOpen, setFollowupModalOpen] = useState(false);

  // Sync state on change
  const refreshAll = () => {
    setCustomers(storage.getCustomers());
    setLeads(storage.getLeads());
    setContacts(storage.getContacts());
    setFollowups(storage.getFollowUps());
    setTasks(storage.getTasks());
  };

  // --- CUSTOMER FORM STATE ---
  const [custForm, setCustForm] = useState({
    name: '',
    companyName: '',
    customerType: 'Business' as Customer['customerType'],
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    taxId: '',
    industry: '',
    source: 'Website',
    status: 'Active' as Customer['status'],
    notes: '',
    outstandingBalance: 0
  });

  const openCustomerModal = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setCustForm({
        name: customer.name,
        companyName: customer.companyName || '',
        customerType: customer.customerType,
        mobile: customer.mobile,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        zipCode: customer.zipCode,
        taxId: customer.taxId || '',
        industry: customer.industry,
        source: customer.source,
        status: customer.status,
        notes: customer.notes || '',
        outstandingBalance: customer.outstandingBalance || 0
      });
    } else {
      setSelectedCustomer(null);
      setCustForm({
        name: '',
        companyName: '',
        customerType: 'Business',
        mobile: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        taxId: '',
        industry: '',
        source: 'Website',
        status: 'Active',
        notes: '',
        outstandingBalance: 0
      });
    }
    setCustomerModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name.trim()) return;

    storage.saveCustomer({
      ...(selectedCustomer ? { id: selectedCustomer.id } : {}),
      name: custForm.name.trim(),
      companyName: custForm.companyName.trim() || undefined,
      customerType: custForm.customerType,
      mobile: custForm.mobile.trim(),
      email: custForm.email.trim(),
      address: custForm.address.trim(),
      city: custForm.city.trim(),
      state: custForm.state.trim(),
      country: custForm.country,
      zipCode: custForm.zipCode,
      taxId: custForm.taxId.trim() || undefined,
      industry: custForm.industry.trim() || 'General',
      source: custForm.source,
      status: custForm.status,
      notes: custForm.notes.trim() || undefined,
      outstandingBalance: Number(custForm.outstandingBalance) || 0
    });

    setCustomerModalOpen(false);
    refreshAll();
  };

  // --- LEAD FORM STATE ---
  const [leadForm, setLeadForm] = useState({
    name: '',
    company: '',
    mobile: '',
    email: '',
    source: 'Google Search',
    requirement: '',
    value: 50000,
    stage: 'New' as LeadStage,
    priority: 'Medium' as Lead['priority'],
    assignedTo: 'Rahul Sharma',
    notes: ''
  });

  const openLeadModal = (lead?: Lead) => {
    if (lead) {
      setSelectedLead(lead);
      setLeadForm({
        name: lead.name,
        company: lead.company,
        mobile: lead.mobile,
        email: lead.email,
        source: lead.source,
        requirement: lead.requirement,
        value: lead.value,
        stage: lead.stage,
        priority: lead.priority,
        assignedTo: lead.assignedTo,
        notes: lead.notes || ''
      });
    } else {
      setSelectedLead(null);
      setLeadForm({
        name: '',
        company: '',
        mobile: '',
        email: '',
        source: 'Google Search',
        requirement: '',
        value: 50000,
        stage: 'New',
        priority: 'Medium',
        assignedTo: 'Rahul Sharma',
        notes: ''
      });
    }
    setLeadModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim()) return;

    storage.saveLead({
      ...(selectedLead ? { id: selectedLead.id } : {}),
      name: leadForm.name.trim(),
      company: leadForm.company.trim(),
      mobile: leadForm.mobile.trim(),
      email: leadForm.email.trim(),
      source: leadForm.source,
      requirement: leadForm.requirement.trim(),
      value: Number(leadForm.value) || 0,
      stage: leadForm.stage,
      priority: leadForm.priority,
      assignedTo: leadForm.assignedTo,
      notes: leadForm.notes.trim() || undefined
    });

    setLeadModalOpen(false);
    refreshAll();
  };

  // Customer Columns
  const customerColumns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer / Client',
      sortable: true,
      render: (c) => (
        <div>
          <span
            onClick={() => setViewCustomerProfile(c)}
            className="font-medium text-[#1a73e8] hover:underline cursor-pointer"
          >
            {c.name}
          </span>
          {c.companyName && (
            <div className="text-[11px] text-[#5f6368]">{c.companyName}</div>
          )}
        </div>
      )
    },
    {
      key: 'mobile',
      header: 'Contact',
      render: (c) => (
        <div className="space-y-0.5">
          <div className="text-xs">{c.mobile}</div>
          <div className="text-[11px] text-[#5f6368]">{c.email}</div>
        </div>
      )
    },
    {
      key: 'city',
      header: 'Location',
      render: (c) => (
        <span>
          {c.city}, {c.state}
        </span>
      )
    },
    {
      key: 'industry',
      header: 'Industry'
    },
    {
      key: 'outstandingBalance',
      header: 'Receivable Due',
      sortable: true,
      align: 'right',
      render: (c) => (
        <span
          className={`font-semibold ${
            c.outstandingBalance > 0 ? 'text-[#d93025]' : 'text-[#1e8e3e]'
          }`}
        >
          {currency}
          {c.outstandingBalance.toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            c.status === 'Active'
              ? 'bg-[#e6f4ea] text-[#137333]'
              : 'bg-[#f1f3f4] text-[#5f6368]'
          }`}
        >
          {c.status}
        </span>
      )
    }
  ];

  // Lead Columns
  const leadColumns: Column<Lead>[] = [
    {
      key: 'name',
      header: 'Lead Name & Company',
      sortable: true,
      render: (l) => (
        <div>
          <div className="font-medium text-[#202124]">{l.name}</div>
          <div className="text-[11px] text-[#5f6368]">{l.company}</div>
        </div>
      )
    },
    {
      key: 'value',
      header: 'Deal Value',
      sortable: true,
      align: 'right',
      render: (l) => (
        <span className="font-semibold text-[#1a73e8]">
          {currency}
          {l.value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'stage',
      header: 'Pipeline Stage',
      render: (l) => (
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#e8f0fe] text-[#1a73e8]">
          {l.stage}
        </span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (l) => (
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
            l.priority === 'High'
              ? 'bg-[#fef7e0] text-[#b06000]'
              : 'bg-[#f1f3f4] text-[#5f6368]'
          }`}
        >
          {l.priority}
        </span>
      )
    },
    {
      key: 'assignedTo',
      header: 'Assigned'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Customer Relationship Management (CRM)</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Client directories, deal pipelines, customer communication, and scheduled follow-ups.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <CoreTabs
        tabs={[
          { id: 'customers', label: 'Customers', count: customers.length, icon: <Users className="w-4 h-4" /> },
          { id: 'leads', label: 'Leads Pipeline', count: leads.length, icon: <Target className="w-4 h-4" /> },
          { id: 'contacts', label: 'Contacts', count: contacts.length, icon: <Contact2 className="w-4 h-4" /> },
          { id: 'followups', label: 'Follow-ups', count: followups.length, icon: <CalendarClock className="w-4 h-4" /> },
          { id: 'crm_tasks', label: 'Tasks', count: tasks.length, icon: <ListTodo className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB CONTENT: Customers */}
      {activeTab === 'customers' && (
        <CoreTable
          title="Customer Master Register"
          subtitle="All active and prospective business accounts"
          data={customers}
          columns={customerColumns}
          keyExtractor={(c) => c.id}
          searchPlaceholder="Search customers by name, phone, email, city..."
          searchFilter={(c, q) =>
            c.name.toLowerCase().includes(q.toLowerCase()) ||
            c.email.toLowerCase().includes(q.toLowerCase()) ||
            c.mobile.includes(q) ||
            c.city.toLowerCase().includes(q.toLowerCase())
          }
          addLabel="New Customer"
          onAdd={() => openCustomerModal()}
          actions={(c) => (
            <div className="flex items-center justify-end gap-1.5">
              <a
                href={`tel:${c.mobile}`}
                title="Call Customer"
                className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] rounded transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${c.email}`}
                title="Email Customer"
                className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] rounded transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${c.mobile.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                className="p-1.5 text-[#5f6368] hover:text-[#1e8e3e] hover:bg-[#f1f3f4] rounded transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setViewCustomerProfile(c)}
                title="View Full Profile"
                className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] rounded transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openCustomerModal(c)}
                title="Edit Customer"
                className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete customer ${c.name}?`)) {
                    storage.deleteCustomer(c.id);
                    refreshAll();
                  }
                }}
                title="Delete"
                className="p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      {/* TAB CONTENT: Leads Pipeline */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">Sales & Opportunity Pipeline</h3>
              <p className="text-xs text-[#5f6368]">
                Track deal progression across stages from New to Won.
              </p>
            </div>
            <CoreButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => openLeadModal()}
            >
              Add New Lead
            </CoreButton>
          </div>

          {/* Kanban Board View */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(['New', 'Qualified', 'Proposal', 'Negotiation', 'Won'] as LeadStage[]).map((stage) => {
              const stageLeads = leads.filter((l) => l.stage === stage);
              const stageTotal = stageLeads.reduce((sum, l) => sum + l.value, 0);

              return (
                <div
                  key={stage}
                  className="bg-[#f8f9fa] rounded-xl border border-[#e0e2e6] p-3 flex flex-col min-h-[300px]"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#dadce0]">
                    <span className="text-xs font-semibold text-[#202124]">{stage}</span>
                    <span className="text-[10px] font-medium text-[#5f6368] bg-white px-1.5 py-0.5 rounded border border-[#dadce0]">
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-[#1a73e8] mb-2">
                    {currency}
                    {stageTotal.toLocaleString()}
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => openLeadModal(lead)}
                        className="p-3 bg-white rounded-lg border border-[#e0e2e6] shadow-2xs hover:border-[#1a73e8] transition-all cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-[#202124]">{lead.name}</div>
                        <div className="text-[11px] text-[#5f6368]">{lead.company}</div>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#1e8e3e]">
                            {currency}
                            {lead.value.toLocaleString()}
                          </span>
                          <span className="text-[#80868b]">{lead.assignedTo.split(' ')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Leads Table */}
          <CoreTable
            title="All Leads Register"
            data={leads}
            columns={leadColumns}
            keyExtractor={(l) => l.id}
            searchFilter={(l, q) =>
              l.name.toLowerCase().includes(q.toLowerCase()) ||
              l.company.toLowerCase().includes(q.toLowerCase())
            }
            actions={(l) => (
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => openLeadModal(l)}
                  className="p-1 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete lead ${l.name}?`)) {
                      storage.deleteLead(l.id);
                      refreshAll();
                    }
                  }}
                  className="p-1 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* TAB CONTENT: Contacts */}
      {activeTab === 'contacts' && (
        <CoreTable
          title="Master Contacts Directory"
          subtitle="Directory of client executives, procurement leads and department contacts"
          data={contacts}
          columns={[
            { key: 'name', header: 'Contact Name', sortable: true },
            { key: 'company', header: 'Organization' },
            { key: 'designation', header: 'Designation' },
            { key: 'mobile', header: 'Mobile' },
            { key: 'email', header: 'Email' },
            { key: 'department', header: 'Department' }
          ]}
          keyExtractor={(c) => c.id}
          searchFilter={(c, q) =>
            c.name.toLowerCase().includes(q.toLowerCase()) ||
            c.company.toLowerCase().includes(q.toLowerCase())
          }
          addLabel="New Contact"
          onAdd={() => {
            const name = prompt('Contact Name:');
            if (!name) return;
            const companyName = prompt('Company:');
            const mobile = prompt('Mobile:') || '';
            const email = prompt('Email:') || '';
            storage.saveContact({
              name,
              company: companyName || '',
              designation: 'Manager',
              mobile,
              email,
              department: 'General'
            });
            refreshAll();
          }}
        />
      )}

      {/* TAB CONTENT: Follow-ups */}
      {activeTab === 'followups' && (
        <CoreTable
          title="Scheduled Client Follow-ups"
          subtitle="Meetings, calls, and email follow-up reminders"
          data={followups}
          columns={[
            { key: 'partyName', header: 'Client / Lead', sortable: true },
            { key: 'type', header: 'Type' },
            { key: 'date', header: 'Date', sortable: true },
            { key: 'time', header: 'Time' },
            { key: 'assignedTo', header: 'Assigned To' },
            {
              key: 'status',
              header: 'Status',
              render: (f) => (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    f.status === 'Completed'
                      ? 'bg-[#e6f4ea] text-[#137333]'
                      : 'bg-[#fef7e0] text-[#b06000]'
                  }`}
                >
                  {f.status}
                </span>
              )
            },
            { key: 'notes', header: 'Notes' }
          ]}
          keyExtractor={(f) => f.id}
          addLabel="Schedule Follow-up"
          onAdd={() => {
            const party = prompt('Client or Lead Name:');
            if (!party) return;
            const date = prompt('Follow-up Date (YYYY-MM-DD):', new Date().toISOString().substring(0, 10));
            storage.saveFollowUp({
              partyName: party,
              partyType: 'Customer',
              date: date || new Date().toISOString().substring(0, 10),
              time: '11:00 AM',
              type: 'Call',
              assignedTo: 'Rahul Sharma',
              status: 'Pending',
              notes: 'Scheduled business follow-up'
            });
            refreshAll();
          }}
        />
      )}

      {/* TAB CONTENT: CRM Tasks */}
      {activeTab === 'crm_tasks' && (
        <CoreTable
          title="Operational & CRM Tasks"
          subtitle="Team task list and client deliverables"
          data={tasks}
          columns={[
            { key: 'title', header: 'Task Title', sortable: true },
            { key: 'relatedTo', header: 'Related To' },
            { key: 'assignedTo', header: 'Assigned To' },
            { key: 'dueDate', header: 'Due Date', sortable: true },
            {
              key: 'priority',
              header: 'Priority',
              render: (t) => (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    t.priority === 'Urgent'
                      ? 'bg-[#fce8e6] text-[#c5221f]'
                      : t.priority === 'High'
                      ? 'bg-[#fef7e0] text-[#b06000]'
                      : 'bg-[#e8f0fe] text-[#1a73e8]'
                  }`}
                >
                  {t.priority}
                </span>
              )
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
          ]}
          keyExtractor={(t) => t.id}
          addLabel="New Task"
          onAdd={() => {
            const title = prompt('Task Title:');
            if (!title) return;
            storage.saveTask({
              title,
              assignedTo: 'Rahul Sharma',
              priority: 'High',
              dueDate: new Date().toISOString().substring(0, 10),
              status: 'Pending'
            });
            refreshAll();
          }}
          actions={(t) => (
            <div className="flex items-center justify-end gap-2">
              {t.status !== 'Completed' ? (
                <button
                  onClick={() => {
                    storage.saveTask({ ...t, status: 'Completed' });
                    refreshAll();
                  }}
                  className="text-xs text-[#1e8e3e] font-semibold hover:underline"
                >
                  Done
                </button>
              ) : (
                <span className="text-[11px] text-[#1e8e3e]">Done</span>
              )}
            </div>
          )}
        />
      )}

      {/* Customer Form Modal */}
      <CoreDialog
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        subtitle="Customer master details, tax info, and contact numbers"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Contact / Customer Name"
              required
              value={custForm.name}
              onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
              placeholder="e.g. Rahul Verma or Horizon Retail"
            />
            <CoreInput
              label="Company Name"
              value={custForm.companyName}
              onChange={(e) => setCustForm({ ...custForm, companyName: e.target.value })}
              placeholder="e.g. Horizon Retail Pvt Ltd"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Mobile Number"
              required
              value={custForm.mobile}
              onChange={(e) => setCustForm({ ...custForm, mobile: e.target.value })}
              placeholder="+91 98200 00000"
            />
            <CoreInput
              label="Email Address"
              type="email"
              required
              value={custForm.email}
              onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
              placeholder="client@domain.com"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <CoreInput
              label="City"
              value={custForm.city}
              onChange={(e) => setCustForm({ ...custForm, city: e.target.value })}
              placeholder="Mumbai"
            />
            <CoreInput
              label="State"
              value={custForm.state}
              onChange={(e) => setCustForm({ ...custForm, state: e.target.value })}
              placeholder="Maharashtra"
            />
            <CoreInput
              label="Tax ID / GSTIN"
              value={custForm.taxId}
              onChange={(e) => setCustForm({ ...custForm, taxId: e.target.value })}
              placeholder="27AABCA1234F1Z8"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Industry / Sector"
              value={custForm.industry}
              onChange={(e) => setCustForm({ ...custForm, industry: e.target.value })}
              placeholder="Healthcare, IT, Legal, Retail"
            />
            <CoreInput
              label="Initial Outstanding Balance"
              type="number"
              value={custForm.outstandingBalance}
              onChange={(e) =>
                setCustForm({ ...custForm, outstandingBalance: Number(e.target.value) })
              }
            />
          </div>
          <CoreInput
            label="Internal Notes"
            value={custForm.notes}
            onChange={(e) => setCustForm({ ...custForm, notes: e.target.value })}
            placeholder="Special terms, payment preferences, or contract details..."
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setCustomerModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Save Customer
            </CoreButton>
          </div>
        </form>
      </CoreDialog>

      {/* Customer Full Profile Drawer / Modal (Section 5 Customer profile) */}
      {viewCustomerProfile && (
        <CoreDialog
          open={!!viewCustomerProfile}
          onClose={() => setViewCustomerProfile(null)}
          title={`Customer Profile: ${viewCustomerProfile.name}`}
          subtitle={`${viewCustomerProfile.companyName || 'Individual Client'} · ID: ${viewCustomerProfile.id}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-[#f8f9fa] rounded-lg border border-[#e0e2e6]">
              <div>
                <span className="text-[#5f6368]">Total Outstanding</span>
                <div className="text-base font-semibold text-[#d93025] mt-0.5">
                  {currency}
                  {viewCustomerProfile.outstandingBalance.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[#5f6368]">Customer Status</span>
                <div className="text-sm font-semibold text-[#1e8e3e] mt-0.5">
                  {viewCustomerProfile.status}
                </div>
              </div>
              <div>
                <span className="text-[#5f6368]">Client Since</span>
                <div className="text-sm font-medium text-[#202124] mt-0.5">
                  {viewCustomerProfile.createdDate}
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="border border-[#e0e2e6] rounded-lg p-3 space-y-2">
              <h4 className="font-semibold text-[#202124] text-xs">Contact & Billing Information</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#5f6368]">Mobile:</span> {viewCustomerProfile.mobile}
                </div>
                <div>
                  <span className="text-[#5f6368]">Email:</span> {viewCustomerProfile.email}
                </div>
                <div>
                  <span className="text-[#5f6368]">Address:</span> {viewCustomerProfile.address},{' '}
                  {viewCustomerProfile.city}, {viewCustomerProfile.state}
                </div>
                <div>
                  <span className="text-[#5f6368]">Tax ID:</span>{' '}
                  {viewCustomerProfile.taxId || 'Not specified'}
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={`tel:${viewCustomerProfile.mobile}`}
                className="px-3 py-1.5 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#1a73e8]" /> Call
              </a>
              <a
                href={`mailto:${viewCustomerProfile.email}`}
                className="px-3 py-1.5 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#1a73e8]" /> Email
              </a>
              <a
                href={`https://wa.me/${viewCustomerProfile.mobile.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <button
                onClick={() => {
                  setViewCustomerProfile(null);
                  if (onNavigateToInvoice) onNavigateToInvoice(viewCustomerProfile.id);
                }}
                className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Create Invoice
              </button>
            </div>
          </div>
        </CoreDialog>
      )}

      {/* Lead Form Modal */}
      <CoreDialog
        open={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        title={selectedLead ? 'Edit Lead' : 'Add Opportunity Lead'}
        subtitle="Manage deal size, pipeline stage, and follow-up timeline"
        maxWidth="md"
      >
        <form onSubmit={handleSaveLead} className="space-y-3">
          <CoreInput
            label="Lead / Prospect Name"
            required
            value={leadForm.name}
            onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
            placeholder="e.g. Kavita Sundaram"
          />
          <CoreInput
            label="Company Name"
            required
            value={leadForm.company}
            onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
            placeholder="e.g. Bluecrest Logistics"
          />
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Mobile Number"
              value={leadForm.mobile}
              onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
              placeholder="+91 98000 00000"
            />
            <CoreInput
              label="Email"
              type="email"
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
              placeholder="prospect@company.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Estimated Deal Value"
              type="number"
              required
              value={leadForm.value}
              onChange={(e) => setLeadForm({ ...leadForm, value: Number(e.target.value) })}
            />
            <CoreSelect
              label="Pipeline Stage"
              value={leadForm.stage}
              onChange={(e) => setLeadForm({ ...leadForm, stage: e.target.value as LeadStage })}
              options={[
                { value: 'New', label: 'New Lead' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Qualified', label: 'Qualified' },
                { value: 'Proposal', label: 'Proposal Submitted' },
                { value: 'Negotiation', label: 'Negotiation' },
                { value: 'Won', label: 'Won (Closed)' },
                { value: 'Lost', label: 'Lost' }
              ]}
            />
          </div>
          <CoreInput
            label="Service Requirement"
            value={leadForm.requirement}
            onChange={(e) => setLeadForm({ ...leadForm, requirement: e.target.value })}
            placeholder="e.g. Annual retainer, ERP setup, Tax filing"
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setLeadModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Save Lead
            </CoreButton>
          </div>
        </form>
      </CoreDialog>
    </div>
  );
};
