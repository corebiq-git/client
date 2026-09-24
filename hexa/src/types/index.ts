/**
 * COREBIQ - Reusable ERP + CRM + Business Management Platform
 * Data Types and Models
 */

export type UserRole = 'Owner' | 'Administrator' | 'Manager' | 'Accountant' | 'Employee' | 'Viewer' | 'Super Admin' | 'Admin' | 'Sales' | 'Compliance Officer';

export interface Company {
  id: string;
  name: string;
  legalName: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  taxId: string; // GSTIN / Tax ID
  cin?: string;
  website?: string;
  currency: string; // ₹, $, €, £
  currencyCode: string; // INR, USD, EUR, etc.
  financialYearStart: string; // MM-DD, e.g. "04-01"
  invoicePrefix: string;
  receiptPrefix: string;
  estimatePrefix: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  status: 'Active' | 'Inactive';
}

export type CompanyBranch = Branch;

export interface RolePermission {
  role: string;
  description: string;
  modules: string[];
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  provider: 'Razorpay' | 'Stripe' | 'Cashfree' | 'PayPal' | 'Custom UPI';
  status: 'Active' | 'Test' | 'Inactive';
  merchantId?: string;
  keyId?: string;
}

export interface PaymentLink {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  description: string;
  url: string;
  status: 'Active' | 'Paid' | 'Expired';
  createdAt: string;
  expiresAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  branchId?: string;
  avatar?: string;
  lastActive?: string;
  status: 'Active' | 'Suspended';
}

// ----------------- CRM -----------------
export type CustomerType = 'Business' | 'Individual';
export type CustomerStatus = 'Active' | 'Lead' | 'Inactive' | 'Archived';

export interface Customer {
  id: string;
  companyId: string;
  customerType: CustomerType;
  name: string;
  companyName?: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  taxId?: string;
  website?: string;
  industry: string;
  source: string;
  assignedEmployeeId?: string;
  status: CustomerStatus;
  notes?: string;
  createdDate: string;
  lastContact?: string;
  nextFollowUp?: string;
  outstandingBalance: number;
}

export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Lead {
  id: string;
  companyId: string;
  name: string;
  company: string;
  mobile: string;
  email: string;
  source: string;
  requirement: string;
  value: number;
  stage: LeadStage;
  priority: Priority;
  assignedTo: string;
  nextFollowUp?: string;
  createdDate: string;
  notes?: string;
}

export interface Contact {
  id: string;
  companyId: string;
  name: string;
  company: string;
  designation: string;
  mobile: string;
  email: string;
  department: string;
  notes?: string;
}

export interface FollowUp {
  id: string;
  companyId: string;
  partyName: string;
  partyType: 'Customer' | 'Lead';
  date: string;
  time: string;
  type: 'Call' | 'Meeting' | 'Email' | 'WhatsApp' | 'Visit';
  assignedTo: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes: string;
}

export interface Task {
  id: string;
  companyId: string;
  title: string;
  relatedTo?: string; // customer or lead or company
  assignedTo: string;
  priority: Priority;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  description?: string;
}

// ----------------- ACCOUNTS -----------------
export type TransactionType = 'Income' | 'Expense' | 'Transfer' | 'Receipt' | 'Payment' | 'Adjustment';
export type PaymentMode = 'Cash' | 'Bank' | 'UPI' | 'Card' | 'Cheque' | 'Online' | 'Other';
export type TransactionStatus = 'Completed' | 'Pending' | 'Cancelled' | 'Failed' | 'Reversed';

export interface Transaction {
  id: string;
  companyId: string;
  date: string;
  type: TransactionType;
  category: string;
  party: string;
  description: string;
  amount: number;
  paymentMode: PaymentMode;
  account: string; // e.g. "HDFC Bank", "Cash Register"
  reference?: string;
  chequeNumber?: string;
  chequeDate?: string;
  status: TransactionStatus;
  createdBy?: string;
  createdAt?: string;
}

export interface BankAccount {
  id: string;
  companyId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  openingBalance: number;
  currentBalance: number;
  status: 'Active' | 'Inactive';
}

export interface CashBookEntry {
  id: string;
  companyId: string;
  date: string;
  description: string;
  party: string;
  type: 'Income' | 'Expense';
  amount: number;
  runningBalance: number;
  category: string;
}

export type ChequeStatus = 'Received' | 'Issued' | 'Deposited' | 'Cleared' | 'Bounced' | 'Cancelled' | 'Pending';

export interface Cheque {
  id: string;
  companyId: string;
  chequeNumber: string;
  date: string;
  party: string;
  bank: string;
  amount: number;
  type: 'Received' | 'Issued';
  depositDate?: string;
  clearanceDate?: string;
  status: ChequeStatus;
  notes?: string;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  customerId: string;
  customerName: string;
  customerAddress?: string;
  customerTaxId?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
}

export interface BillPayment {
  id: string;
  companyId: string;
  vendorName: string;
  billNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';
}

export interface PaymentRecord {
  id: string;
  companyId: string;
  customerName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  mode: PaymentMode;
  reference: string;
  account: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface ExpenseRecord {
  id: string;
  companyId: string;
  date: string;
  category: string;
  vendor: string;
  description: string;
  amount: number;
  paymentMode: PaymentMode;
  account: string;
  status: 'Completed' | 'Pending';
  taxDeductible?: boolean;
}

export interface TransferRecord {
  id: string;
  companyId: string;
  fromAccount: string;
  toAccount: string;
  date: string;
  amount: number;
  reference?: string;
  notes?: string;
}

// ----------------- EMPLOYEES -----------------
export interface Employee {
  id: string;
  companyId: string;
  name: string;
  mobile: string;
  email: string;
  designation: string;
  department: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  emergencyContact?: string;
  address?: string;
  bankAccount?: string;
  panOrTaxId?: string;
}

export interface AttendanceRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workingHours: number;
  status: 'Present' | 'Absent' | 'Half Day' | 'On Leave';
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Casual' | 'Sick' | 'Annual' | 'Unpaid';
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface PayrollRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  period: string; // e.g. "September 2026"
  basic: number;
  allowances: number;
  deductions: number;
  advance: number;
  netPay: number;
  paymentStatus: 'Paid' | 'Pending';
  paymentDate?: string;
}

// ----------------- COMPLIANCE -----------------
export type ComplianceStatus = 'Upcoming' | 'Pending' | 'In Progress' | 'Filed' | 'Completed' | 'Overdue';

export interface ComplianceRecord {
  id: string;
  companyId: string;
  name: string;
  category: 'GST' | 'TDS' | 'Income Tax' | 'ROC / Corporate' | 'Labor & PF' | 'Licenses & Renewals' | 'Custom';
  frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual' | 'One-Time';
  period: string;
  dueDate: string;
  assignedTo: string;
  status: ComplianceStatus;
  priority: Priority;
  acknowledgementNumber?: string;
  notes?: string;
}

// ----------------- TEMPLATES -----------------
export type TemplateType = 'Invoice' | 'Quotation' | 'Receipt' | 'Letter' | 'Email' | 'WhatsApp';

export interface DocTemplate {
  id: string;
  companyId: string;
  name: string;
  type: TemplateType;
  isDefault: boolean;
  headerTitle: string;
  themeColor: string;
  showLogo: boolean;
  showBankDetails: boolean;
  terms: string;
  footerNote: string;
  contentBody?: string;
}

// ----------------- AUDIT & DATA -----------------
export interface AuditLog {
  id: string;
  companyId: string;
  user: string;
  action: 'Create' | 'Update' | 'Delete' | 'Restore' | 'Export' | 'Status Change';
  module: string;
  recordTitle: string;
  oldValue?: string;
  newValue?: string;
  details?: string;
  timestamp: string;
}

export interface DeletedRecord {
  id: string;
  companyId: string;
  module: string;
  title?: string;
  entityType?: string;
  data: any;
  deletedAt: string;
  deletedBy?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
  linkModule?: string;
}
