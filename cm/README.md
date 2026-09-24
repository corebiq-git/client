# COREBIQ — Reusable ERP & CRM PWA

**The Intelligent Workflow for Business**

This package uses the supplied COREBIQ visual system as the shared design foundation:
- Inter typography
- exact supplied green palette
- 708px app shell
- 64px top bar
- 72px bottom navigation
- sliding sidebar
- Lucide icons
- responsive mobile-first layout
- standalone module HTML pages
- one shared CSS and JS foundation
- Firebase-ready database/auth layer

## Module structure

CRM
- Customers
- Leads
- Contacts
- Deals
- Activities
- Follow-ups

ACCOUNTS
- Invoices
- Quotes
- Subscriptions
- Payments
- Expenses
- Bank & Cash Books
- Cheque Management
- Credit Notes
- Debit Notes

EMPLOYEES
- Employee Master
- Attendance
- Leave
- Payroll
- Employee Documents

TEMPLATES
- Document Templates
- Invoice Templates
- Email Templates
- WhatsApp Templates

TOOLS
- Calculator
- Payment Link / QR
- Reminders
- Document Generator

COMPANY
- Company Profile
- Users & Roles
- Branches
- Numbering
- Preferences

DATA
- Import
- Export
- Documents
- Audit Log

COMPLIANCE
- Compliance Dashboard
- GST
- Income Tax
- TDS / TCS
- Labour Compliance

## Firebase

Open `assets/js/firebase-config.js` and insert the Firebase Web App configuration.

Suggested Firestore collections:
companies, users, customers, leads, contacts, deals, activities, follow_ups,
invoices, invoice_items, quotes, subscriptions, payments, expenses,
bank_accounts, bank_transactions, cash_transactions, cheques, credit_notes,
debit_notes, employees, attendance, leave_requests, payroll, documents,
templates, compliance, notifications, audit_logs, settings.

## Important

The HTML/CSS/JS is a complete reusable front-end module structure. Firebase persistence, authentication,
Storage uploads, payment gateway APIs and production security rules should be connected using your own Firebase
project credentials and server-side/Cloud Functions logic where required.
