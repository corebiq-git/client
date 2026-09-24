/**
 * COREBIQ Storage & Database Service
 * Provides multi-tenant company isolation, persistent reactive state,
 * automatic audit logging, and JSON export/import.
 */

import { queueFirebaseWrite } from './firebase';

import {
  Company,
  Customer,
  Lead,
  Contact,
  FollowUp,
  Task,
  Transaction,
  BankAccount,
  Cheque,
  Invoice,
  BillPayment,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  ComplianceRecord,
  DocTemplate,
  AuditLog,
  NotificationItem,
  AppUser,
  PaymentGatewayConfig,
  PaymentLink,
  RolePermission
} from '../types';

import {
  INITIAL_COMPANIES,
  CURRENT_USER,
  INITIAL_CUSTOMERS,
  INITIAL_LEADS,
  INITIAL_CONTACTS,
  INITIAL_FOLLOWUPS,
  INITIAL_TASKS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_INVOICES,
  INITIAL_CHEQUES,
  INITIAL_PAYABLES,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_COMPLIANCE,
  INITIAL_TEMPLATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from './mockData';

const STORAGE_KEYS = {
  COMPANIES: 'corebiq_companies',
  ACTIVE_COMPANY_ID: 'corebiq_active_company_id',
  CURRENT_USER: 'corebiq_current_user',
  CUSTOMERS: 'corebiq_customers',
  LEADS: 'corebiq_leads',
  CONTACTS: 'corebiq_contacts',
  FOLLOWUPS: 'corebiq_followups',
  TASKS: 'corebiq_tasks',
  BANK_ACCOUNTS: 'corebiq_bank_accounts',
  TRANSACTIONS: 'corebiq_transactions',
  INVOICES: 'corebiq_invoices',
  CHEQUES: 'corebiq_cheques',
  PAYABLES: 'corebiq_payables',
  EMPLOYEES: 'corebiq_employees',
  ATTENDANCE: 'corebiq_attendance',
  LEAVES: 'corebiq_leaves',
  PAYROLL: 'corebiq_payroll',
  COMPLIANCE: 'corebiq_compliance',
  TEMPLATES: 'corebiq_templates',
  AUDIT_LOGS: 'corebiq_audit_logs',
  NOTIFICATIONS: 'corebiq_notifications',
  DELETED_RECORDS: 'corebiq_deleted_records'
};

function load<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      queueFirebaseWrite(key, defaultValue);
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse storage key ${key}:`, e);
    return defaultValue;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    queueFirebaseWrite(key, value);
  } catch (e) {
    console.error(`Failed to save storage key ${key}:`, e);
  }
}

export interface DeletedRecord {
  id: string;
  companyId: string;
  module: string;
  title: string;
  data: any;
  deletedAt: string;
  deletedBy: string;
}

class CorebiqStorage {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  // --- COMPANIES ---
  getCompanies(): Company[] {
    return load<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  }

  getActiveCompanyId(): string {
    const defaultId = INITIAL_COMPANIES[0].id;
    return load<string>(STORAGE_KEYS.ACTIVE_COMPANY_ID, defaultId);
  }

  getActiveCompany(): Company {
    const companies = this.getCompanies();
    const activeId = this.getActiveCompanyId();
    return companies.find((c) => c.id === activeId) || companies[0];
  }

  setActiveCompanyId(id: string): void {
    save(STORAGE_KEYS.ACTIVE_COMPANY_ID, id);
    this.addAuditLog('Update', 'Company', 'Switched Active Company', undefined, id);
    this.notify();
  }

  saveCompany(company: Company): void {
    const companies = this.getCompanies();
    const index = companies.findIndex((c) => c.id === company.id);
    if (index >= 0) {
      companies[index] = company;
    } else {
      companies.push(company);
    }
    save(STORAGE_KEYS.COMPANIES, companies);
    this.addAuditLog('Update', 'Company Profile', company.name);
    this.notify();
  }

  // --- USER ---
  getCurrentUser(): AppUser {
    return load<AppUser>(STORAGE_KEYS.CURRENT_USER, CURRENT_USER);
  }

  updateCurrentUser(user: Partial<AppUser>): void {
    const cur = this.getCurrentUser();
    const updated = { ...cur, ...user };
    save(STORAGE_KEYS.CURRENT_USER, updated);
    this.notify();
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    const companyId = this.getActiveCompanyId();
    const all = load<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    return all.filter((a) => a.companyId === companyId);
  }

  addAuditLog(
    action: AuditLog['action'],
    module: string,
    recordTitle: string,
    oldValue?: string,
    newValue?: string
  ): void {
    const user = this.getCurrentUser();
    const companyId = this.getActiveCompanyId();
    const logs = load<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const newEntry: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      companyId,
      user: user.name,
      action,
      module,
      recordTitle,
      oldValue,
      newValue,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    logs.unshift(newEntry);
    save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
  }

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    return load<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    save(STORAGE_KEYS.NOTIFICATIONS, updated);
    this.notify();
  }

  markAllNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    save(STORAGE_KEYS.NOTIFICATIONS, updated);
    this.notify();
  }

  addNotification(title: string, message: string, type: NotificationItem['type'] = 'info', linkModule?: string): void {
    const list = this.getNotifications();
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      linkModule
    };
    list.unshift(newItem);
    save(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 50));
    this.notify();
  }

  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    return all.filter((c) => c.companyId === companyId);
  }

  saveCustomer(customer: Omit<Customer, 'id' | 'companyId' | 'createdDate'> & { id?: string }): Customer {
    const companyId = this.getActiveCompanyId();
    const all = load<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    if (customer.id) {
      const idx = all.findIndex((c) => c.id === customer.id && c.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...customer } as Customer;
        save(STORAGE_KEYS.CUSTOMERS, all);
        this.addAuditLog('Update', 'CRM / Customers', customer.name);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Customer = {
      ...customer,
      id: `cust_${Date.now()}`,
      companyId,
      createdDate: new Date().toISOString().substring(0, 10),
      outstandingBalance: customer.outstandingBalance || 0
    } as Customer;
    all.unshift(newRecord);
    save(STORAGE_KEYS.CUSTOMERS, all);
    this.addAuditLog('Create', 'CRM / Customers', newRecord.name);
    this.notify();
    return newRecord;
  }

  deleteCustomer(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const target = all.find((c) => c.id === id && c.companyId === companyId);
    if (!target) return;
    this.recordDeletion('CRM / Customers', target.name, target);
    const updated = all.filter((c) => c.id !== id || c.companyId !== companyId);
    save(STORAGE_KEYS.CUSTOMERS, updated);
    this.addAuditLog('Delete', 'CRM / Customers', target.name);
    this.notify();
  }

  // --- LEADS ---
  getLeads(): Lead[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    return all.filter((l) => l.companyId === companyId);
  }

  saveLead(lead: Omit<Lead, 'id' | 'companyId' | 'createdDate'> & { id?: string }): Lead {
    const companyId = this.getActiveCompanyId();
    const all = load<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    if (lead.id) {
      const idx = all.findIndex((l) => l.id === lead.id && l.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...lead } as Lead;
        save(STORAGE_KEYS.LEADS, all);
        this.addAuditLog('Update', 'CRM / Leads', lead.name);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Lead = {
      ...lead,
      id: `lead_${Date.now()}`,
      companyId,
      createdDate: new Date().toISOString().substring(0, 10)
    } as Lead;
    all.unshift(newRecord);
    save(STORAGE_KEYS.LEADS, all);
    this.addAuditLog('Create', 'CRM / Leads', newRecord.name);
    this.notify();
    return newRecord;
  }

  deleteLead(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const target = all.find((l) => l.id === id && l.companyId === companyId);
    if (!target) return;
    this.recordDeletion('CRM / Leads', target.name, target);
    save(STORAGE_KEYS.LEADS, all.filter((l) => l.id !== id || l.companyId !== companyId));
    this.addAuditLog('Delete', 'CRM / Leads', target.name);
    this.notify();
  }

  // --- CONTACTS ---
  getContacts(): Contact[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Contact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
    return all.filter((c) => c.companyId === companyId);
  }

  saveContact(contact: Omit<Contact, 'id' | 'companyId'> & { id?: string }): Contact {
    const companyId = this.getActiveCompanyId();
    const all = load<Contact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
    if (contact.id) {
      const idx = all.findIndex((c) => c.id === contact.id && c.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...contact } as Contact;
        save(STORAGE_KEYS.CONTACTS, all);
        this.addAuditLog('Update', 'CRM / Contacts', contact.name);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Contact = {
      ...contact,
      id: `cnt_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.CONTACTS, all);
    this.addAuditLog('Create', 'CRM / Contacts', newRecord.name);
    this.notify();
    return newRecord;
  }

  deleteContact(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Contact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
    const target = all.find((c) => c.id === id && c.companyId === companyId);
    if (!target) return;
    this.recordDeletion('CRM / Contacts', target.name, target);
    save(STORAGE_KEYS.CONTACTS, all.filter((c) => c.id !== id || c.companyId !== companyId));
    this.addAuditLog('Delete', 'CRM / Contacts', target.name);
    this.notify();
  }

  // --- FOLLOW-UPS ---
  getFollowUps(): FollowUp[] {
    const companyId = this.getActiveCompanyId();
    const all = load<FollowUp[]>(STORAGE_KEYS.FOLLOWUPS, INITIAL_FOLLOWUPS);
    return all.filter((f) => f.companyId === companyId);
  }

  saveFollowUp(item: Omit<FollowUp, 'id' | 'companyId'> & { id?: string }): FollowUp {
    const companyId = this.getActiveCompanyId();
    const all = load<FollowUp[]>(STORAGE_KEYS.FOLLOWUPS, INITIAL_FOLLOWUPS);
    if (item.id) {
      const idx = all.findIndex((f) => f.id === item.id && f.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item } as FollowUp;
        save(STORAGE_KEYS.FOLLOWUPS, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: FollowUp = {
      ...item,
      id: `fup_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.FOLLOWUPS, all);
    this.addAuditLog('Create', 'CRM / Follow-ups', `${newRecord.partyName} (${newRecord.type})`);
    this.notify();
    return newRecord;
  }

  deleteFollowUp(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<FollowUp[]>(STORAGE_KEYS.FOLLOWUPS, INITIAL_FOLLOWUPS);
    save(STORAGE_KEYS.FOLLOWUPS, all.filter((f) => f.id !== id || f.companyId !== companyId));
    this.notify();
  }

  // --- TASKS ---
  getTasks(): Task[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    return all.filter((t) => t.companyId === companyId);
  }

  saveTask(task: Omit<Task, 'id' | 'companyId'> & { id?: string }): Task {
    const companyId = this.getActiveCompanyId();
    const all = load<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    if (task.id) {
      const idx = all.findIndex((t) => t.id === task.id && t.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...task } as Task;
        save(STORAGE_KEYS.TASKS, all);
        this.addAuditLog('Update', 'Tasks', task.title);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Task = {
      ...task,
      id: `tsk_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.TASKS, all);
    this.addAuditLog('Create', 'Tasks', newRecord.title);
    this.notify();
    return newRecord;
  }

  deleteTask(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    save(STORAGE_KEYS.TASKS, all.filter((t) => t.id !== id || t.companyId !== companyId));
    this.notify();
  }

  // --- ACCOUNTS / TRANSACTIONS ---
  getTransactions(): Transaction[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    return all.filter((t) => t.companyId === companyId);
  }

  saveTransaction(txn: Omit<Transaction, 'id' | 'companyId' | 'createdAt' | 'createdBy'> & { id?: string; createdBy?: string }): Transaction {
    const companyId = this.getActiveCompanyId();
    const all = load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const user = this.getCurrentUser();
    if (txn.id) {
      const idx = all.findIndex((t) => t.id === txn.id && t.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...txn } as Transaction;
        save(STORAGE_KEYS.TRANSACTIONS, all);
        this.addAuditLog('Update', 'Accounts / Transactions', `${txn.type} ₹${txn.amount} (${txn.party})`);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Transaction = {
      ...txn,
      id: `txn_${Date.now()}`,
      companyId,
      createdBy: user.name,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.TRANSACTIONS, all);

    // Update bank balance if applicable
    this.adjustBankBalance(txn.account, txn.type, txn.amount);

    this.addAuditLog('Create', 'Accounts / Transactions', `${newRecord.type} ₹${newRecord.amount} - ${newRecord.party}`);
    this.notify();
    return newRecord;
  }

  deleteTransaction(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const target = all.find((t) => t.id === id && t.companyId === companyId);
    if (!target) return;
    this.recordDeletion('Accounts / Transactions', `${target.type} ₹${target.amount}`, target);
    save(STORAGE_KEYS.TRANSACTIONS, all.filter((t) => t.id !== id || t.companyId !== companyId));
    this.addAuditLog('Delete', 'Accounts / Transactions', `${target.type} ₹${target.amount}`);
    this.notify();
  }

  private adjustBankBalance(accountName: string, type: Transaction['type'], amount: number) {
    const banks = this.getBankAccounts();
    const bIdx = banks.findIndex((b) => b.bankName === accountName || b.accountName.includes(accountName));
    if (bIdx >= 0) {
      if (type === 'Income' || type === 'Receipt') {
        banks[bIdx].currentBalance += amount;
      } else if (type === 'Expense' || type === 'Payment') {
        banks[bIdx].currentBalance -= amount;
      }
      this.saveBankAccount(banks[bIdx]);
    }
  }

  // --- BANK ACCOUNTS ---
  getBankAccounts(): BankAccount[] {
    const companyId = this.getActiveCompanyId();
    const all = load<BankAccount[]>(STORAGE_KEYS.BANK_ACCOUNTS, INITIAL_BANK_ACCOUNTS);
    return all.filter((b) => b.companyId === companyId);
  }

  saveBankAccount(bank: Omit<BankAccount, 'id' | 'companyId'> & { id?: string }): BankAccount {
    const companyId = this.getActiveCompanyId();
    const all = load<BankAccount[]>(STORAGE_KEYS.BANK_ACCOUNTS, INITIAL_BANK_ACCOUNTS);
    if (bank.id) {
      const idx = all.findIndex((b) => b.id === bank.id && b.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...bank } as BankAccount;
        save(STORAGE_KEYS.BANK_ACCOUNTS, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: BankAccount = {
      ...bank,
      id: `bank_${Date.now()}`,
      companyId
    };
    all.push(newRecord);
    save(STORAGE_KEYS.BANK_ACCOUNTS, all);
    this.addAuditLog('Create', 'Accounts / Bank Accounts', newRecord.bankName);
    this.notify();
    return newRecord;
  }

  // --- CHEQUES ---
  getCheques(): Cheque[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Cheque[]>(STORAGE_KEYS.CHEQUES, INITIAL_CHEQUES);
    return all.filter((c) => c.companyId === companyId);
  }

  saveCheque(cheque: Omit<Cheque, 'id' | 'companyId'> & { id?: string }): Cheque {
    const companyId = this.getActiveCompanyId();
    const all = load<Cheque[]>(STORAGE_KEYS.CHEQUES, INITIAL_CHEQUES);
    if (cheque.id) {
      const idx = all.findIndex((c) => c.id === cheque.id && c.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...cheque } as Cheque;
        save(STORAGE_KEYS.CHEQUES, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Cheque = {
      ...cheque,
      id: `chq_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.CHEQUES, all);
    this.addAuditLog('Create', 'Accounts / Cheques', `Cheque #${newRecord.chequeNumber} (${newRecord.party})`);
    this.notify();
    return newRecord;
  }

  deleteCheque(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Cheque[]>(STORAGE_KEYS.CHEQUES, INITIAL_CHEQUES);
    save(STORAGE_KEYS.CHEQUES, all.filter((c) => c.id !== id || c.companyId !== companyId));
    this.notify();
  }

  // --- INVOICES ---
  getInvoices(): Invoice[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    return all.filter((i) => i.companyId === companyId);
  }

  saveInvoice(inv: Omit<Invoice, 'id' | 'companyId'> & { id?: string }): Invoice {
    const companyId = this.getActiveCompanyId();
    const all = load<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    if (inv.id) {
      const idx = all.findIndex((i) => i.id === inv.id && i.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...inv } as Invoice;
        save(STORAGE_KEYS.INVOICES, all);
        this.addAuditLog('Update', 'Accounts / Invoices', inv.invoiceNumber);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Invoice = {
      ...inv,
      id: `inv_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.INVOICES, all);
    this.addAuditLog('Create', 'Accounts / Invoices', `${newRecord.invoiceNumber} - ${newRecord.customerName}`);
    this.notify();
    return newRecord;
  }

  deleteInvoice(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    const target = all.find((i) => i.id === id && i.companyId === companyId);
    if (!target) return;
    this.recordDeletion('Accounts / Invoices', target.invoiceNumber, target);
    save(STORAGE_KEYS.INVOICES, all.filter((i) => i.id !== id || i.companyId !== companyId));
    this.addAuditLog('Delete', 'Accounts / Invoices', target.invoiceNumber);
    this.notify();
  }

  // --- PAYABLES ---
  getPayables(): BillPayment[] {
    const companyId = this.getActiveCompanyId();
    const all = load<BillPayment[]>(STORAGE_KEYS.PAYABLES, INITIAL_PAYABLES);
    return all.filter((p) => p.companyId === companyId);
  }

  savePayable(payable: Omit<BillPayment, 'id' | 'companyId'> & { id?: string }): BillPayment {
    const companyId = this.getActiveCompanyId();
    const all = load<BillPayment[]>(STORAGE_KEYS.PAYABLES, INITIAL_PAYABLES);
    if (payable.id) {
      const idx = all.findIndex((p) => p.id === payable.id && p.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...payable } as BillPayment;
        save(STORAGE_KEYS.PAYABLES, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: BillPayment = {
      ...payable,
      id: `bill_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.PAYABLES, all);
    this.addAuditLog('Create', 'Accounts / Payables', `${newRecord.vendorName} (${newRecord.billNumber})`);
    this.notify();
    return newRecord;
  }

  deletePayable(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<BillPayment[]>(STORAGE_KEYS.PAYABLES, INITIAL_PAYABLES);
    save(STORAGE_KEYS.PAYABLES, all.filter((p) => p.id !== id || p.companyId !== companyId));
    this.notify();
  }

  // --- EMPLOYEES ---
  getEmployees(): Employee[] {
    const companyId = this.getActiveCompanyId();
    const all = load<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    return all.filter((e) => e.companyId === companyId);
  }

  saveEmployee(employee: Omit<Employee, 'id' | 'companyId'> & { id?: string }): Employee {
    const companyId = this.getActiveCompanyId();
    const all = load<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    if (employee.id) {
      const idx = all.findIndex((e) => e.id === employee.id && e.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...employee } as Employee;
        save(STORAGE_KEYS.EMPLOYEES, all);
        this.addAuditLog('Update', 'Employees', employee.name);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: Employee = {
      ...employee,
      id: `emp_${Date.now()}`,
      companyId
    };
    all.push(newRecord);
    save(STORAGE_KEYS.EMPLOYEES, all);
    this.addAuditLog('Create', 'Employees', newRecord.name);
    this.notify();
    return newRecord;
  }

  deleteEmployee(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    const target = all.find((e) => e.id === id && e.companyId === companyId);
    if (!target) return;
    this.recordDeletion('Employees', target.name, target);
    save(STORAGE_KEYS.EMPLOYEES, all.filter((e) => e.id !== id || e.companyId !== companyId));
    this.addAuditLog('Delete', 'Employees', target.name);
    this.notify();
  }

  // --- ATTENDANCE ---
  getAttendance(): AttendanceRecord[] {
    const companyId = this.getActiveCompanyId();
    const all = load<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    return all.filter((a) => a.companyId === companyId);
  }

  saveAttendance(record: Omit<AttendanceRecord, 'id' | 'companyId'> & { id?: string }): AttendanceRecord {
    const companyId = this.getActiveCompanyId();
    const all = load<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    if (record.id) {
      const idx = all.findIndex((a) => a.id === record.id && a.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...record } as AttendanceRecord;
        save(STORAGE_KEYS.ATTENDANCE, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.ATTENDANCE, all);
    this.notify();
    return newRecord;
  }

  // --- LEAVE ---
  getLeaves(): LeaveRequest[] {
    const companyId = this.getActiveCompanyId();
    const all = load<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    return all.filter((l) => l.companyId === companyId);
  }

  saveLeave(req: Omit<LeaveRequest, 'id' | 'companyId'> & { id?: string }): LeaveRequest {
    const companyId = this.getActiveCompanyId();
    const all = load<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    if (req.id) {
      const idx = all.findIndex((l) => l.id === req.id && l.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...req } as LeaveRequest;
        save(STORAGE_KEYS.LEAVES, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: LeaveRequest = {
      ...req,
      id: `lv_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.LEAVES, all);
    this.addAuditLog('Create', 'Employees / Leave', `${newRecord.employeeName} (${newRecord.leaveType})`);
    this.notify();
    return newRecord;
  }

  // --- PAYROLL ---
  getPayroll(): PayrollRecord[] {
    const companyId = this.getActiveCompanyId();
    const all = load<PayrollRecord[]>(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    return all.filter((p) => p.companyId === companyId);
  }

  savePayroll(rec: Omit<PayrollRecord, 'id' | 'companyId'> & { id?: string }): PayrollRecord {
    const companyId = this.getActiveCompanyId();
    const all = load<PayrollRecord[]>(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
    if (rec.id) {
      const idx = all.findIndex((p) => p.id === rec.id && p.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...rec } as PayrollRecord;
        save(STORAGE_KEYS.PAYROLL, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: PayrollRecord = {
      ...rec,
      id: `pay_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.PAYROLL, all);
    this.addAuditLog('Create', 'Employees / Payroll', `${newRecord.employeeName} (${newRecord.period})`);
    this.notify();
    return newRecord;
  }

  // --- COMPLIANCE ---
  getCompliance(): ComplianceRecord[] {
    const companyId = this.getActiveCompanyId();
    const all = load<ComplianceRecord[]>(STORAGE_KEYS.COMPLIANCE, INITIAL_COMPLIANCE);
    return all.filter((c) => c.companyId === companyId);
  }

  saveCompliance(comp: Omit<ComplianceRecord, 'id' | 'companyId'> & { id?: string }): ComplianceRecord {
    const companyId = this.getActiveCompanyId();
    const all = load<ComplianceRecord[]>(STORAGE_KEYS.COMPLIANCE, INITIAL_COMPLIANCE);
    if (comp.id) {
      const idx = all.findIndex((c) => c.id === comp.id && c.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...comp } as ComplianceRecord;
        save(STORAGE_KEYS.COMPLIANCE, all);
        this.addAuditLog('Update', 'Compliance', comp.name);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: ComplianceRecord = {
      ...comp,
      id: `comp_rec_${Date.now()}`,
      companyId
    };
    all.unshift(newRecord);
    save(STORAGE_KEYS.COMPLIANCE, all);
    this.addAuditLog('Create', 'Compliance', newRecord.name);
    this.notify();
    return newRecord;
  }

  deleteCompliance(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<ComplianceRecord[]>(STORAGE_KEYS.COMPLIANCE, INITIAL_COMPLIANCE);
    const target = all.find((c) => c.id === id && c.companyId === companyId);
    if (!target) return;
    this.recordDeletion('Compliance', target.name, target);
    save(STORAGE_KEYS.COMPLIANCE, all.filter((c) => c.id !== id || c.companyId !== companyId));
    this.addAuditLog('Delete', 'Compliance', target.name);
    this.notify();
  }

  // --- TEMPLATES ---
  getTemplates(): DocTemplate[] {
    const companyId = this.getActiveCompanyId();
    const all = load<DocTemplate[]>(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
    return all.filter((t) => t.companyId === companyId);
  }

  saveTemplate(tmpl: Omit<DocTemplate, 'id' | 'companyId'> & { id?: string }): DocTemplate {
    const companyId = this.getActiveCompanyId();
    const all = load<DocTemplate[]>(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
    if (tmpl.id) {
      const idx = all.findIndex((t) => t.id === tmpl.id && t.companyId === companyId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...tmpl } as DocTemplate;
        save(STORAGE_KEYS.TEMPLATES, all);
        this.notify();
        return all[idx];
      }
    }
    const newRecord: DocTemplate = {
      ...tmpl,
      id: `tmpl_${Date.now()}`,
      companyId
    };
    all.push(newRecord);
    save(STORAGE_KEYS.TEMPLATES, all);
    this.addAuditLog('Create', 'Templates', newRecord.name);
    this.notify();
    return newRecord;
  }

  deleteTemplate(id: string): void {
    const companyId = this.getActiveCompanyId();
    const all = load<DocTemplate[]>(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
    save(STORAGE_KEYS.TEMPLATES, all.filter((t) => t.id !== id || t.companyId !== companyId));
    this.notify();
  }

  // --- RECYCLE BIN / DELETED RECORDS ---
  getDeletedRecords(): DeletedRecord[] {
    const companyId = this.getActiveCompanyId();
    const all = load<DeletedRecord[]>(STORAGE_KEYS.DELETED_RECORDS, []);
    return all.filter((d) => d.companyId === companyId);
  }

  private recordDeletion(module: string, title: string, data: any) {
    const companyId = this.getActiveCompanyId();
    const user = this.getCurrentUser();
    const all = load<DeletedRecord[]>(STORAGE_KEYS.DELETED_RECORDS, []);
    const entry: DeletedRecord = {
      id: `del_${Date.now()}`,
      companyId,
      module,
      title,
      data,
      deletedAt: new Date().toISOString(),
      deletedBy: user.name
    };
    all.unshift(entry);
    save(STORAGE_KEYS.DELETED_RECORDS, all.slice(0, 50));
  }

  restoreDeletedRecord(id: string): boolean {
    const all = load<DeletedRecord[]>(STORAGE_KEYS.DELETED_RECORDS, []);
    const target = all.find((d) => d.id === id);
    if (!target) return false;

    // Restore to appropriate storage
    if (target.module.includes('Customers')) {
      const list = load<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      list.unshift(target.data);
      save(STORAGE_KEYS.CUSTOMERS, list);
    } else if (target.module.includes('Leads')) {
      const list = load<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
      list.unshift(target.data);
      save(STORAGE_KEYS.LEADS, list);
    } else if (target.module.includes('Transactions')) {
      const list = load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
      list.unshift(target.data);
      save(STORAGE_KEYS.TRANSACTIONS, list);
    } else if (target.module.includes('Invoices')) {
      const list = load<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
      list.unshift(target.data);
      save(STORAGE_KEYS.INVOICES, list);
    }

    save(STORAGE_KEYS.DELETED_RECORDS, all.filter((d) => d.id !== id));
    this.addAuditLog('Restore', target.module, target.title);
    this.notify();
    return true;
  }

  // --- BACKUP & RESTORE ---
  exportAllDataJson(): string {
    const companyId = this.getActiveCompanyId();
    const company = this.getActiveCompany();
    const exportData = {
      corebiqVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      company,
      customers: this.getCustomers(),
      leads: this.getLeads(),
      contacts: this.getContacts(),
      followUps: this.getFollowUps(),
      tasks: this.getTasks(),
      transactions: this.getTransactions(),
      bankAccounts: this.getBankAccounts(),
      cheques: this.getCheques(),
      invoices: this.getInvoices(),
      payables: this.getPayables(),
      employees: this.getEmployees(),
      attendance: this.getAttendance(),
      leaves: this.getLeaves(),
      payroll: this.getPayroll(),
      compliance: this.getCompliance(),
      templates: this.getTemplates(),
      auditLogs: this.getAuditLogs()
    };
    return JSON.stringify(exportData, null, 2);
  }

  importAllDataJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data.company || !data.customers) {
        throw new Error('Invalid COREBIQ data format');
      }

      this.saveCompany(data.company);
      const companyId = data.company.id;
      this.setActiveCompanyId(companyId);

      if (Array.isArray(data.customers)) {
        const existing = load<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
        const filtered = existing.filter((c) => c.companyId !== companyId);
        save(STORAGE_KEYS.CUSTOMERS, [...filtered, ...data.customers]);
      }
      if (Array.isArray(data.transactions)) {
        const existing = load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
        const filtered = existing.filter((t) => t.companyId !== companyId);
        save(STORAGE_KEYS.TRANSACTIONS, [...filtered, ...data.transactions]);
      }
      if (Array.isArray(data.invoices)) {
        const existing = load<Invoice[]>(STORAGE_KEYS.INVOICES, []);
        const filtered = existing.filter((i) => i.companyId !== companyId);
        save(STORAGE_KEYS.INVOICES, [...filtered, ...data.invoices]);
      }

      this.addAuditLog('Create', 'Data / Restore', `Restored data for ${data.company.name}`);
      this.notify();
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  }

  // --- USERS & ROLES ---
  getUsers(): AppUser[] {
    const defaultUsers: AppUser[] = [
      this.getCurrentUser(),
      {
        id: 'usr_2',
        name: 'Pooja Iyer',
        email: 'pooja.iyer@apexsolutions.com',
        role: 'Accountant',
        status: 'Active',
        lastActive: '10m ago',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces'
      },
      {
        id: 'usr_3',
        name: 'Amit Patel',
        email: 'amit.p@apexsolutions.com',
        role: 'Sales',
        status: 'Active',
        lastActive: '1h ago',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
      }
    ];
    return load<AppUser[]>('corebiq_users', defaultUsers);
  }

  saveUser(user: AppUser): void {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    save('corebiq_users', list);
    this.addAuditLog('Create', 'Company / Users', user.name);
    this.notify();
  }

  getRoles(): RolePermission[] {
    return [
      {
        role: 'Super Admin',
        description: 'Complete system authority, multi-tenant creation, security keys',
        modules: ['All Modules', 'Company Governance', 'Audit Trail', 'System Settings']
      },
      {
        role: 'Admin',
        description: 'Company-level administrative control, user invites, settings',
        modules: ['Dashboard', 'CRM', 'Accounts', 'Employees', 'Compliance', 'Templates', 'Reports', 'Company']
      },
      {
        role: 'Manager',
        description: 'Operational team lead, approvals, customer relationships',
        modules: ['Dashboard', 'CRM', 'Employees', 'Compliance', 'Reports']
      },
      {
        role: 'Accountant',
        description: 'Books of accounts, banking ledgers, tax invoices, GST returns',
        modules: ['Dashboard', 'Accounts', 'Invoices', 'Banking', 'Tax Reports']
      },
      {
        role: 'Sales',
        description: 'Lead pipeline, deals, customer directory, quotation templates',
        modules: ['Dashboard', 'CRM', 'Invoices (Read-Only)', 'Templates']
      },
      {
        role: 'Compliance Officer',
        description: 'Regulatory tracker, GST returns, secretarial filings',
        modules: ['Dashboard', 'Compliance', 'Documents', 'Reports']
      },
      {
        role: 'Viewer',
        description: 'Read-only visibility for executive board and investors',
        modules: ['Dashboard', 'Reports']
      }
    ];
  }

  // --- PAYMENT GATEWAYS & LINKS ---
  getPaymentGateways(): PaymentGatewayConfig[] {
    const defaults: PaymentGatewayConfig[] = [
      {
        id: 'gw_upi',
        name: 'Direct Corporate UPI QR',
        provider: 'Custom UPI',
        status: 'Active',
        merchantId: 'apexsolutions@hdfcbank'
      },
      {
        id: 'gw_razorpay',
        name: 'Razorpay Auto-Settlement',
        provider: 'Razorpay',
        status: 'Active',
        keyId: 'rzp_live_K823489127'
      },
      {
        id: 'gw_stripe',
        name: 'Stripe Global Card Processing',
        provider: 'Stripe',
        status: 'Active',
        keyId: 'pk_live_51M00189218'
      }
    ];
    return load<PaymentGatewayConfig[]>('corebiq_gateways', defaults);
  }

  getPaymentLinks(): PaymentLink[] {
    const defaults: PaymentLink[] = [
      {
        id: 'pl_982144',
        customerName: 'Horizon Retail Global',
        amount: 25000,
        currency: 'INR',
        description: 'Milestone 1 Advance',
        url: 'https://pay.corebiq.io/l/pl_982144',
        status: 'Active',
        createdAt: '2026-09-20',
        expiresAt: '2026-09-27'
      },
      {
        id: 'pl_982145',
        customerName: 'Veritas Legal Services',
        amount: 45000,
        currency: 'INR',
        description: 'Retainer Fee Q3',
        url: 'https://pay.corebiq.io/l/pl_982145',
        status: 'Active',
        createdAt: '2026-09-22',
        expiresAt: '2026-09-29'
      }
    ];
    return load<PaymentLink[]>('corebiq_payment_links', defaults);
  }

  savePaymentLink(link: PaymentLink): void {
    const list = this.getPaymentLinks();
    list.unshift(link);
    save('corebiq_payment_links', list);
    this.addAuditLog('Create', 'Payments / Links', link.customerName);
    this.notify();
  }

  // --- RECYCLE BIN & DATA BACKUP ALIASES ---
  getRecycleBin(): DeletedRecord[] {
    return this.getDeletedRecords();
  }

  restoreFromRecycleBin(id: string): boolean {
    return this.restoreDeletedRecord(id);
  }

  exportBackupJSON(): string {
    return this.exportAllDataJson();
  }

  importBackupJSON(jsonString: string): boolean {
    return this.importAllDataJson(jsonString);
  }

  resetToDemoSeed(): void {
    this.resetToInitialDemoData();
  }

  resetToInitialDemoData(): void {
    localStorage.clear();
    this.notify();
  }
}

export const storage = new CorebiqStorage();
