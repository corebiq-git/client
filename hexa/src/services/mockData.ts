import {
  Company,
  Customer,
  Lead,
  Contact,
  FollowUp,
  Task,
  Transaction,
  BankAccount,
  CashBookEntry,
  Cheque,
  Invoice,
  BillPayment,
  PaymentRecord,
  ExpenseRecord,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  ComplianceRecord,
  DocTemplate,
  AuditLog,
  NotificationItem,
  AppUser
} from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_1',
    name: 'Apex Solutions Pvt Ltd',
    legalName: 'Apex Solutions Private Limited',
    email: 'accounts@apexsolutions.com',
    phone: '+91 98200 12345',
    address: 'Suite 402, Signature Towers, BKC',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zipCode: '400051',
    taxId: '27AABCA1234F1Z8',
    cin: 'U72200MH2021PTC368900',
    website: 'https://apexsolutions.example.com',
    currency: '₹',
    currencyCode: 'INR',
    financialYearStart: '04-01',
    invoicePrefix: 'APX/26-27/',
    receiptPrefix: 'REC/26/',
    estimatePrefix: 'EST/26/',
    branches: [
      { id: 'b1', name: 'Headquarters - Mumbai', code: 'BOM', address: 'BKC, Mumbai', manager: 'Rahul Sharma', status: 'Active' },
      { id: 'b2', name: 'Bengaluru Tech Hub', code: 'BLR', address: 'Koramangala, Bengaluru', manager: 'Sneha Patel', status: 'Active' }
    ]
  },
  {
    id: 'comp_2',
    name: 'Zenith Advisory Partners',
    legalName: 'Zenith Advisory & Management LLP',
    email: 'contact@zenithadvisory.example.com',
    phone: '+91 11 4567 8900',
    address: 'Level 8, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    zipCode: '110001',
    taxId: '07AAAFZ9876E1Z4',
    website: 'https://zenithadvisory.example.com',
    currency: '₹',
    currencyCode: 'INR',
    financialYearStart: '04-01',
    invoicePrefix: 'ZAP/26/',
    receiptPrefix: 'ZRC/',
    estimatePrefix: 'ZQT/',
    branches: [
      { id: 'b3', name: 'Delhi Main Office', code: 'DEL', address: 'Connaught Place, New Delhi', manager: 'Vikram Seth', status: 'Active' }
    ]
  }
];

export const CURRENT_USER: AppUser = {
  id: 'usr_1',
  name: 'Corebiq Admin',
  email: 'corebiq@gmail.com',
  role: 'Owner',
  companyId: 'comp_1',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  status: 'Active'
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    companyId: 'comp_1',
    customerType: 'Business',
    name: 'Horizon Retail Global',
    companyName: 'Horizon Retail Pvt Ltd',
    mobile: '+91 98111 22334',
    email: 'finance@horizonretail.com',
    address: 'Tower B, Cyber City',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    zipCode: '122002',
    taxId: '06AAACH2234K1Z2',
    industry: 'Retail & E-commerce',
    source: 'Referral',
    assignedEmployeeId: 'emp_1',
    status: 'Active',
    notes: 'Key enterprise retainer client on annual support plan.',
    createdDate: '2026-03-15',
    lastContact: '2026-09-21',
    nextFollowUp: '2026-09-28',
    outstandingBalance: 125000
  },
  {
    id: 'cust_2',
    companyId: 'comp_1',
    customerType: 'Business',
    name: 'Quantico Bio Health',
    companyName: 'Quantico Diagnostics LLP',
    mobile: '+91 97222 33445',
    email: 'billing@quanticobio.com',
    address: 'Plot 45, MIDC Industrial Area',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    zipCode: '411019',
    taxId: '27AABPQ9901M1ZA',
    industry: 'Healthcare / Pharma',
    source: 'Website Lead',
    assignedEmployeeId: 'emp_2',
    status: 'Active',
    notes: 'Bimonthly ERP integration & process automation services.',
    createdDate: '2026-05-10',
    lastContact: '2026-09-23',
    nextFollowUp: '2026-10-02',
    outstandingBalance: 64000
  },
  {
    id: 'cust_3',
    companyId: 'comp_1',
    customerType: 'Business',
    name: 'Starlight Media Studios',
    companyName: 'Starlight Content Works Ltd',
    mobile: '+91 99333 44556',
    email: 'accounts@starlightworks.in',
    address: 'Andheri West Link Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zipCode: '400053',
    taxId: '27AAACS8832L1Z9',
    industry: 'Media & Entertainment',
    source: 'LinkedIn',
    assignedEmployeeId: 'emp_1',
    status: 'Active',
    notes: 'Prompt payer via NEFT/UPI.',
    createdDate: '2026-06-20',
    lastContact: '2026-09-18',
    outstandingBalance: 0
  },
  {
    id: 'cust_4',
    companyId: 'comp_1',
    customerType: 'Individual',
    name: 'Dr. Arjun Mehta',
    mobile: '+91 98444 55667',
    email: 'arjun.mehta@clinicmind.org',
    address: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zipCode: '560038',
    industry: 'Healthcare & Clinic',
    source: 'Direct Inbound',
    status: 'Active',
    createdDate: '2026-08-01',
    outstandingBalance: 18500
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_1',
    companyId: 'comp_1',
    name: 'Kavita Sundaram',
    company: 'Bluecrest Logistics Hub',
    mobile: '+91 98765 00112',
    email: 'kavita@bluecrestlog.com',
    source: 'Google Search',
    requirement: 'Multi-branch operations & digital invoicing software',
    value: 350000,
    stage: 'Negotiation',
    priority: 'High',
    assignedTo: 'Rahul Sharma',
    nextFollowUp: '2026-09-25',
    createdDate: '2026-09-10',
    notes: 'Sent revised SLA quotation with 18% GST breakdown. Awaiting board approval.'
  },
  {
    id: 'lead_2',
    companyId: 'comp_1',
    name: 'Manish Chawla',
    company: 'UrbanCraft Architecture',
    mobile: '+91 98199 44332',
    email: 'chawla@urbancraft.in',
    source: 'Referral',
    requirement: 'Project billing, compliance calendar, client receipts',
    value: 180000,
    stage: 'Proposal',
    priority: 'Medium',
    assignedTo: 'Sneha Patel',
    nextFollowUp: '2026-09-26',
    createdDate: '2026-09-15',
    notes: 'Demo completed on 22 Sep. Proposal submitted.'
  },
  {
    id: 'lead_3',
    companyId: 'comp_1',
    name: 'Preeti Deshmukh',
    company: 'Vedic Wellness Organics',
    mobile: '+91 98220 88990',
    email: 'preeti@vedicwellness.co',
    source: 'Instagram Ad',
    requirement: 'Client management and recurring monthly retainer billing',
    value: 95000,
    stage: 'Qualified',
    priority: 'Medium',
    assignedTo: 'Rahul Sharma',
    nextFollowUp: '2026-09-28',
    createdDate: '2026-09-20'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt_1',
    companyId: 'comp_1',
    name: 'Aditya Sen',
    company: 'Horizon Retail Pvt Ltd',
    designation: 'VP Finance',
    mobile: '+91 98111 22334',
    email: 'aditya.sen@horizonretail.com',
    department: 'Finance'
  },
  {
    id: 'cnt_2',
    companyId: 'comp_1',
    name: 'Dr. Sunita Rao',
    company: 'Quantico Diagnostics LLP',
    designation: 'Managing Director',
    mobile: '+91 97222 33445',
    email: 'srao@quanticobio.com',
    department: 'Executive'
  }
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fup_1',
    companyId: 'comp_1',
    partyName: 'Bluecrest Logistics Hub',
    partyType: 'Lead',
    date: '2026-09-25',
    time: '11:30 AM',
    type: 'Meeting',
    assignedTo: 'Rahul Sharma',
    status: 'Pending',
    notes: 'Final contract signing and implementation date confirmation.'
  },
  {
    id: 'fup_2',
    companyId: 'comp_1',
    partyName: 'Horizon Retail Global',
    partyType: 'Customer',
    date: '2026-09-28',
    time: '03:00 PM',
    type: 'Call',
    assignedTo: 'Rahul Sharma',
    status: 'Pending',
    notes: 'Quarterly review and invoice clearance follow-up.'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk_1',
    companyId: 'comp_1',
    title: 'File GSTR-3B for August 2026',
    relatedTo: 'GST Compliance',
    assignedTo: 'Pooja Iyer',
    priority: 'Urgent',
    dueDate: '2026-09-26',
    status: 'In Progress',
    description: 'Reconcile sales register with output tax ledgers.'
  },
  {
    id: 'tsk_2',
    companyId: 'comp_1',
    title: 'Disburse September Employee Payroll',
    relatedTo: 'Payroll',
    assignedTo: 'Rahul Sharma',
    priority: 'High',
    dueDate: '2026-09-30',
    status: 'Pending',
    description: 'Generate payslips and export bank NEFT batch file.'
  },
  {
    id: 'tsk_3',
    companyId: 'comp_1',
    title: 'Follow up on Horizon Retail Overdue Invoice',
    relatedTo: 'Horizon Retail Global',
    assignedTo: 'Rahul Sharma',
    priority: 'High',
    dueDate: '2026-09-25',
    status: 'Pending'
  }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank_1',
    companyId: 'comp_1',
    bankName: 'HDFC Bank Ltd',
    accountName: 'Apex Solutions Current A/c',
    accountNumber: '50200045892110',
    ifsc: 'HDFC0000060',
    branch: 'BKC Corporate Branch, Mumbai',
    openingBalance: 450000,
    currentBalance: 842500,
    status: 'Active'
  },
  {
    id: 'bank_2',
    companyId: 'comp_1',
    bankName: 'ICICI Bank',
    accountName: 'Apex Operational Reserve',
    accountNumber: '001105018933',
    ifsc: 'ICIC0000011',
    branch: 'Koramangala, Bengaluru',
    openingBalance: 200000,
    currentBalance: 320000,
    status: 'Active'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1',
    companyId: 'comp_1',
    date: '2026-09-24',
    type: 'Income',
    category: 'Consulting Retainer',
    party: 'Quantico Bio Health',
    description: 'September ERP Consulting Retainer Fee',
    amount: 55000,
    paymentMode: 'UPI',
    account: 'HDFC Bank Ltd',
    reference: 'UPI/626781920/QBIO',
    status: 'Completed',
    createdBy: 'Rahul Sharma',
    createdAt: '2026-09-24 09:30'
  },
  {
    id: 'txn_2',
    companyId: 'comp_1',
    date: '2026-09-23',
    type: 'Expense',
    category: 'Office Rent & Maintenance',
    party: 'Signature Towers BKC Facility',
    description: 'Monthly office rent payment for Sep 2026',
    amount: 85000,
    paymentMode: 'Bank',
    account: 'HDFC Bank Ltd',
    reference: 'NEFT-SIGTWR-4421',
    status: 'Completed',
    createdBy: 'Rahul Sharma',
    createdAt: '2026-09-23 11:15'
  },
  {
    id: 'txn_3',
    companyId: 'comp_1',
    date: '2026-09-22',
    type: 'Receipt',
    category: 'Client Milestone Payment',
    party: 'Starlight Media Studios',
    description: 'Milestone 2 Workflow Automation clearance',
    amount: 120000,
    paymentMode: 'Bank',
    account: 'HDFC Bank Ltd',
    reference: 'RTGS-STRLGT-9081',
    status: 'Completed',
    createdBy: 'Rahul Sharma',
    createdAt: '2026-09-22 15:40'
  },
  {
    id: 'txn_4',
    companyId: 'comp_1',
    date: '2026-09-21',
    type: 'Expense',
    category: 'Cloud Servers & Software',
    party: 'Google Cloud Platform',
    description: 'Infrastructure compute & API services',
    amount: 14200,
    paymentMode: 'Card',
    account: 'HDFC Bank Ltd',
    reference: 'CC-GCP-SEP-26',
    status: 'Completed',
    createdBy: 'Rahul Sharma',
    createdAt: '2026-09-21 04:00'
  },
  {
    id: 'txn_5',
    companyId: 'comp_1',
    date: '2026-09-20',
    type: 'Transfer',
    category: 'Cash Withdrawal for Petty Cash',
    party: 'Cash Register',
    description: 'Petty cash refill from HDFC account',
    amount: 15000,
    paymentMode: 'Cash',
    account: 'HDFC Bank Ltd',
    reference: 'CHQ-000412',
    status: 'Completed',
    createdBy: 'Rahul Sharma',
    createdAt: '2026-09-20 14:00'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    invoiceNumber: 'APX/26-27/0101',
    companyId: 'comp_1',
    customerId: 'cust_1',
    customerName: 'Horizon Retail Global',
    customerAddress: 'Tower B, Cyber City, Gurugram',
    customerTaxId: '06AAACH2234K1Z2',
    date: '2026-09-05',
    dueDate: '2026-09-20',
    items: [
      { id: 'item_1', description: 'Enterprise Workflow Automation Suite Setup', quantity: 1, unitPrice: 150000, taxPercent: 18, amount: 150000 },
      { id: 'item_2', description: 'Staff Training & Systems Integration (Hours)', quantity: 20, unitPrice: 2500, taxPercent: 18, amount: 50000 }
    ],
    subtotal: 200000,
    taxAmount: 36000,
    discountAmount: 10000,
    total: 226000,
    paidAmount: 101000,
    balance: 125000,
    status: 'Overdue',
    notes: 'Net 15 days payment terms. Late fee applicable after due date.',
    terms: 'Please make NEFT/RTGS to HDFC A/c 50200045892110 IFSC: HDFC0000060.'
  },
  {
    id: 'inv_2',
    invoiceNumber: 'APX/26-27/0102',
    companyId: 'comp_1',
    customerId: 'cust_2',
    customerName: 'Quantico Bio Health',
    customerAddress: 'MIDC Industrial Area, Pune',
    customerTaxId: '27AABPQ9901M1ZA',
    date: '2026-09-12',
    dueDate: '2026-09-27',
    items: [
      { id: 'item_3', description: 'Monthly Process Audit & Regulatory Integration', quantity: 1, unitPrice: 60000, taxPercent: 18, amount: 60000 }
    ],
    subtotal: 60000,
    taxAmount: 10800,
    discountAmount: 6800,
    total: 64000,
    paidAmount: 0,
    balance: 64000,
    status: 'Sent',
    notes: 'Kindly approve and remit by 27 September 2026.',
    terms: 'Payment via UPI to apexsolutions@hdfcbank or IMPS.'
  },
  {
    id: 'inv_3',
    invoiceNumber: 'APX/26-27/0103',
    companyId: 'comp_1',
    customerId: 'cust_3',
    customerName: 'Starlight Media Studios',
    customerAddress: 'Andheri West, Mumbai',
    customerTaxId: '27AAACS8832L1Z9',
    date: '2026-09-18',
    dueDate: '2026-10-03',
    items: [
      { id: 'item_4', description: 'Content Delivery Network Optimization & Licensing', quantity: 1, unitPrice: 120000, taxPercent: 18, amount: 120000 }
    ],
    subtotal: 120000,
    taxAmount: 21600,
    discountAmount: 21600,
    total: 120000,
    paidAmount: 120000,
    balance: 0,
    status: 'Paid',
    notes: 'Received with thanks.'
  }
];

export const INITIAL_CHEQUES: Cheque[] = [
  {
    id: 'chq_1',
    companyId: 'comp_1',
    chequeNumber: '000845',
    date: '2026-09-26',
    party: 'Horizon Retail Global',
    bank: 'Axis Bank',
    amount: 75000,
    type: 'Received',
    status: 'Deposited',
    depositDate: '2026-09-24',
    notes: 'Part clearance against invoice APX/26-27/0101'
  },
  {
    id: 'chq_2',
    companyId: 'comp_1',
    chequeNumber: '109823',
    date: '2026-09-28',
    party: 'Apex Office Supplies',
    bank: 'HDFC Bank Ltd',
    amount: 8500,
    type: 'Issued',
    status: 'Pending',
    notes: 'Quarterly printing and paper stationery'
  }
];

export const INITIAL_PAYABLES: BillPayment[] = [
  {
    id: 'bill_1',
    companyId: 'comp_1',
    vendorName: 'Signature Towers Facility Mgmt',
    billNumber: 'ST-INV-2026-09',
    date: '2026-09-01',
    dueDate: '2026-09-28',
    amount: 85000,
    paid: 85000,
    balance: 0,
    status: 'Paid'
  },
  {
    id: 'bill_2',
    companyId: 'comp_1',
    vendorName: 'Apex Cloud Telecom Services',
    billNumber: 'ACT-98219',
    date: '2026-09-15',
    dueDate: '2026-09-30',
    amount: 12400,
    paid: 0,
    balance: 12400,
    status: 'Pending'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_1',
    companyId: 'comp_1',
    name: 'Rahul Sharma',
    mobile: '+91 98201 11223',
    email: 'rahul.sharma@apexsolutions.com',
    designation: 'Operations Director',
    department: 'Operations',
    joiningDate: '2023-01-10',
    salary: 110000,
    status: 'Active',
    emergencyContact: '+91 98201 99887 (Wife)',
    address: 'Prabhadevi, Mumbai'
  },
  {
    id: 'emp_2',
    companyId: 'comp_1',
    name: 'Sneha Patel',
    mobile: '+91 98450 33445',
    email: 'sneha.patel@apexsolutions.com',
    designation: 'Lead Solutions Architect',
    department: 'Technology',
    joiningDate: '2023-08-15',
    salary: 95000,
    status: 'Active',
    address: 'Indiranagar, Bengaluru'
  },
  {
    id: 'emp_3',
    companyId: 'comp_1',
    name: 'Pooja Iyer',
    mobile: '+91 99110 55667',
    email: 'pooja.iyer@apexsolutions.com',
    designation: 'Senior Accountant & Compliance Officer',
    department: 'Finance',
    joiningDate: '2024-03-01',
    salary: 65000,
    status: 'Active',
    address: 'Thane West, Mumbai'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    companyId: 'comp_1',
    employeeId: 'emp_1',
    employeeName: 'Rahul Sharma',
    date: '2026-09-24',
    checkIn: '09:12 AM',
    workingHours: 8.5,
    status: 'Present'
  },
  {
    id: 'att_2',
    companyId: 'comp_1',
    employeeId: 'emp_2',
    employeeName: 'Sneha Patel',
    date: '2026-09-24',
    checkIn: '09:28 AM',
    workingHours: 8.2,
    status: 'Present'
  },
  {
    id: 'att_3',
    companyId: 'comp_1',
    employeeId: 'emp_3',
    employeeName: 'Pooja Iyer',
    date: '2026-09-24',
    checkIn: '09:05 AM',
    workingHours: 8.7,
    status: 'Present'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'lv_1',
    companyId: 'comp_1',
    employeeId: 'emp_2',
    employeeName: 'Sneha Patel',
    leaveType: 'Casual',
    fromDate: '2026-10-02',
    toDate: '2026-10-03',
    days: 2,
    reason: 'Family function in Ahmedabad',
    status: 'Approved',
    approvedBy: 'Rahul Sharma'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay_1',
    companyId: 'comp_1',
    employeeId: 'emp_1',
    employeeName: 'Rahul Sharma',
    period: 'August 2026',
    basic: 70000,
    allowances: 40000,
    deductions: 5000,
    advance: 0,
    netPay: 105000,
    paymentStatus: 'Paid',
    paymentDate: '2026-08-31'
  },
  {
    id: 'pay_2',
    companyId: 'comp_1',
    employeeId: 'emp_2',
    employeeName: 'Sneha Patel',
    period: 'August 2026',
    basic: 60000,
    allowances: 35000,
    deductions: 4500,
    advance: 0,
    netPay: 90500,
    paymentStatus: 'Paid',
    paymentDate: '2026-08-31'
  },
  {
    id: 'pay_3',
    companyId: 'comp_1',
    employeeId: 'emp_3',
    employeeName: 'Pooja Iyer',
    period: 'August 2026',
    basic: 42000,
    allowances: 23000,
    deductions: 3200,
    advance: 0,
    netPay: 61800,
    paymentStatus: 'Paid',
    paymentDate: '2026-08-31'
  }
];

export const INITIAL_COMPLIANCE: ComplianceRecord[] = [
  {
    id: 'comp_rec_1',
    companyId: 'comp_1',
    name: 'GSTR-3B Monthly Return Filing',
    category: 'GST',
    frequency: 'Monthly',
    period: 'August 2026',
    dueDate: '2026-09-20',
    assignedTo: 'Pooja Iyer',
    status: 'Completed',
    priority: 'Urgent',
    acknowledgementNumber: 'ARN27092026019921',
    notes: 'Filed on 19 Sep 2026 with no late fees.'
  },
  {
    id: 'comp_rec_2',
    companyId: 'comp_1',
    name: 'Advance Tax Second Installment (45%)',
    category: 'Income Tax',
    frequency: 'Quarterly',
    period: 'Q2 (FY 2026-27)',
    dueDate: '2026-09-15',
    assignedTo: 'Pooja Iyer',
    status: 'Completed',
    priority: 'High',
    acknowledgementNumber: 'BSR-00210-CHLN-9081',
    notes: 'Challan 280 paid ₹145,000'
  },
  {
    id: 'comp_rec_3',
    companyId: 'comp_1',
    name: 'TDS Payment for August 2026',
    category: 'TDS',
    frequency: 'Monthly',
    period: 'August 2026',
    dueDate: '2026-09-07',
    assignedTo: 'Pooja Iyer',
    status: 'Completed',
    priority: 'High',
    acknowledgementNumber: 'CHLN-281-AUG-092'
  },
  {
    id: 'comp_rec_4',
    companyId: 'comp_1',
    name: 'Annual ROC Financial Filing (AOC-4 & MGT-7)',
    category: 'ROC / Corporate',
    frequency: 'Annual',
    period: 'FY 2025-26',
    dueDate: '2026-10-30',
    assignedTo: 'Pooja Iyer',
    status: 'In Progress',
    priority: 'High',
    notes: 'Statutory auditor reports signed. XBRL tagging in progress.'
  },
  {
    id: 'comp_rec_5',
    companyId: 'comp_1',
    name: 'PF & ESI Monthly Remittance & ECR Filing',
    category: 'Labor & PF',
    frequency: 'Monthly',
    period: 'September 2026',
    dueDate: '2026-10-15',
    assignedTo: 'Pooja Iyer',
    status: 'Upcoming',
    priority: 'Medium'
  }
];

export const INITIAL_TEMPLATES: DocTemplate[] = [
  {
    id: 'tmpl_1',
    companyId: 'comp_1',
    name: 'Standard Corporate Invoice',
    type: 'Invoice',
    isDefault: true,
    headerTitle: 'TAX INVOICE',
    themeColor: '#1A73E8',
    showLogo: true,
    showBankDetails: true,
    terms: '1. Payment is due within 15 days of invoice date.\n2. Please mention the invoice number in the bank transaction reference.\n3. Goods or services once delivered cannot be cancelled.',
    footerNote: 'Thank you for your business! For any billing queries, contact accounts@apexsolutions.com.'
  },
  {
    id: 'tmpl_2',
    companyId: 'comp_1',
    name: 'Official Quotation / Proposal',
    type: 'Quotation',
    isDefault: true,
    headerTitle: 'FORMAL PROPOSAL & ESTIMATE',
    themeColor: '#0F9D58',
    showLogo: true,
    showBankDetails: false,
    terms: '1. Quote validity is 30 days from date of issue.\n2. 50% advance on project kickoff, balance on milestone deliverables.',
    footerNote: 'We look forward to working together.'
  },
  {
    id: 'tmpl_3',
    companyId: 'comp_1',
    name: 'Payment Receipt Slip',
    type: 'Receipt',
    isDefault: true,
    headerTitle: 'OFFICIAL RECEIPT',
    themeColor: '#1A73E8',
    showLogo: true,
    showBankDetails: true,
    terms: 'Computer-generated receipt valid without physical signature.',
    footerNote: 'We acknowledge receipt of payment with thanks.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    companyId: 'comp_1',
    user: 'Rahul Sharma',
    action: 'Create',
    module: 'Accounts / Transactions',
    recordTitle: 'Income ₹55,000 from Quantico Bio Health',
    newValue: 'Completed (UPI/626781920/QBIO)',
    timestamp: '2026-09-24 09:30:14'
  },
  {
    id: 'aud_2',
    companyId: 'comp_1',
    user: 'Rahul Sharma',
    action: 'Update',
    module: 'CRM / Customers',
    recordTitle: 'Quantico Bio Health',
    oldValue: 'Outstanding: ₹119,000',
    newValue: 'Outstanding: ₹64,000',
    timestamp: '2026-09-24 09:31:02'
  },
  {
    id: 'aud_3',
    companyId: 'comp_1',
    user: 'Pooja Iyer',
    action: 'Status Change',
    module: 'Compliance',
    recordTitle: 'GSTR-3B Monthly Return Filing',
    oldValue: 'In Progress',
    newValue: 'Completed (ARN27092026019921)',
    timestamp: '2026-09-20 16:45:00'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Payment Received',
    message: 'Quantico Bio Health remitted ₹55,000 via UPI.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false,
    linkModule: 'accounts'
  },
  {
    id: 'notif_2',
    title: 'Receivable Overdue Alert',
    message: 'Horizon Retail invoice APX/26-27/0101 (₹125,000) is 4 days overdue.',
    type: 'warning',
    timestamp: '5 hours ago',
    read: false,
    linkModule: 'accounts'
  },
  {
    id: 'notif_3',
    title: 'ROC Compliance Deadline',
    message: 'Annual ROC filing preparation due in 35 days.',
    type: 'info',
    timestamp: '1 day ago',
    read: true,
    linkModule: 'compliance'
  }
];
