import React, { useState } from 'react';
import {
  UserCheck,
  CalendarDays,
  Clock,
  Banknote,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord } from '../../types';
import { CoreTabs, CoreButton, CoreDialog, CoreInput, CoreSelect } from '../../components/common/CoreComponents';
import { CoreTable, Column } from '../../components/common/CoreTable';

interface EmployeesModuleProps {
  initialSubTab?: string;
}

export const EmployeesModule: React.FC<EmployeesModuleProps> = ({
  initialSubTab = 'master'
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab || 'master');
  const company = storage.getActiveCompany();
  const currency = company?.currency || '₹';

  const [employees, setEmployees] = useState(storage.getEmployees());
  const [attendance, setAttendance] = useState(storage.getAttendance());
  const [leaves, setLeaves] = useState(storage.getLeaves());
  const [payroll, setPayroll] = useState(storage.getPayroll());

  const refreshAll = () => {
    setEmployees(storage.getEmployees());
    setAttendance(storage.getAttendance());
    setLeaves(storage.getLeaves());
    setPayroll(storage.getPayroll());
  };

  // Modal State
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [empForm, setEmpForm] = useState({
    name: '',
    designation: '',
    department: 'Operations',
    email: '',
    mobile: '',
    joiningDate: new Date().toISOString().substring(0, 10),
    salary: 50000,
    address: ''
  });

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name.trim()) return;

    storage.saveEmployee({
      name: empForm.name.trim(),
      designation: empForm.designation.trim() || 'Executive',
      department: empForm.department,
      email: empForm.email.trim() || 'employee@company.com',
      mobile: empForm.mobile.trim() || '+91 98000 00000',
      joiningDate: empForm.joiningDate,
      salary: Number(empForm.salary) || 30000,
      status: 'Active',
      address: empForm.address.trim()
    });

    setEmpModalOpen(false);
    refreshAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Employee & Human Resources Master</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Staff directory, daily attendance tracking, leave requests, and payroll disbursement.
          </p>
        </div>
      </div>

      <CoreTabs
        tabs={[
          { id: 'master', label: 'Employee Master', count: employees.length, icon: <UserCheck className="w-4 h-4" /> },
          { id: 'attendance', label: 'Daily Attendance', count: attendance.length, icon: <Clock className="w-4 h-4" /> },
          { id: 'leave', label: 'Leave Requests', count: leaves.length, icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'payroll', label: 'Payroll & Salaries', count: payroll.length, icon: <Banknote className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Employee Master */}
      {activeTab === 'master' && (
        <CoreTable
          title="Staff & Team Directory"
          subtitle="All active team members, designations, departments, and payroll CTC"
          data={employees}
          columns={[
            {
              key: 'name',
              header: 'Employee Name',
              sortable: true,
              render: (e) => (
                <div>
                  <div className="font-semibold text-[#202124]">{e.name}</div>
                  <div className="text-[11px] text-[#5f6368]">{e.email}</div>
                </div>
              )
            },
            { key: 'designation', header: 'Designation' },
            { key: 'department', header: 'Department', sortable: true },
            { key: 'mobile', header: 'Mobile' },
            { key: 'joiningDate', header: 'Joined' },
            {
              key: 'salary',
              header: 'Monthly CTC',
              sortable: true,
              align: 'right',
              render: (e) => `${currency}${e.salary.toLocaleString()}`
            },
            {
              key: 'status',
              header: 'Status',
              render: (e) => (
                <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">
                  {e.status}
                </span>
              )
            }
          ]}
          keyExtractor={(e) => e.id}
          searchFilter={(e, q) =>
            e.name.toLowerCase().includes(q.toLowerCase()) ||
            e.department.toLowerCase().includes(q.toLowerCase()) ||
            e.designation.toLowerCase().includes(q.toLowerCase())
          }
          addLabel="Add Employee"
          onAdd={() => setEmpModalOpen(true)}
          actions={(e) => (
            <button
              onClick={() => {
                if (confirm(`Remove employee ${e.name}?`)) {
                  storage.deleteEmployee(e.id);
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

      {/* Attendance Register */}
      {activeTab === 'attendance' && (
        <CoreTable
          title="Daily Attendance & Hours"
          subtitle="Clock-in records, shift duration, and presence status"
          data={attendance}
          columns={[
            { key: 'employeeName', header: 'Employee', sortable: true },
            { key: 'date', header: 'Date', sortable: true },
            { key: 'checkIn', header: 'Check In' },
            { key: 'checkOut', header: 'Check Out', render: (a) => a.checkOut || 'Active Shift' },
            { key: 'workingHours', header: 'Hours', align: 'right', render: (a) => `${a.workingHours} hrs` },
            {
              key: 'status',
              header: 'Status',
              render: (a) => (
                <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">
                  {a.status}
                </span>
              )
            }
          ]}
          keyExtractor={(a) => a.id}
          addLabel="Mark Attendance"
          onAdd={() => {
            const emp = employees[0];
            if (!emp) return;
            storage.saveAttendance({
              employeeId: emp.id,
              employeeName: emp.name,
              date: new Date().toISOString().substring(0, 10),
              checkIn: '09:00 AM',
              workingHours: 8.5,
              status: 'Present'
            });
            refreshAll();
          }}
        />
      )}

      {/* Leave Requests */}
      {activeTab === 'leave' && (
        <CoreTable
          title="Staff Leave Requests"
          subtitle="Vacation, casual leave, and medical time-off approvals"
          data={leaves}
          columns={[
            { key: 'employeeName', header: 'Employee', sortable: true },
            { key: 'leaveType', header: 'Leave Type' },
            { key: 'fromDate', header: 'From Date' },
            { key: 'toDate', header: 'To Date' },
            { key: 'days', header: 'Days', align: 'center' },
            { key: 'reason', header: 'Reason' },
            {
              key: 'status',
              header: 'Approval Status',
              render: (l) => (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    l.status === 'Approved'
                      ? 'bg-[#e6f4ea] text-[#137333]'
                      : l.status === 'Rejected'
                      ? 'bg-[#fce8e6] text-[#c5221f]'
                      : 'bg-[#fef7e0] text-[#b06000]'
                  }`}
                >
                  {l.status}
                </span>
              )
            }
          ]}
          keyExtractor={(l) => l.id}
          addLabel="Apply Leave"
          onAdd={() => {
            const emp = employees[0];
            if (!emp) return;
            const reason = prompt('Reason for leave:') || 'Personal engagement';
            storage.saveLeave({
              employeeId: emp.id,
              employeeName: emp.name,
              leaveType: 'Casual',
              fromDate: new Date().toISOString().substring(0, 10),
              toDate: new Date().toISOString().substring(0, 10),
              days: 1,
              reason,
              status: 'Approved',
              approvedBy: 'Admin'
            });
            refreshAll();
          }}
        />
      )}

      {/* Payroll Register */}
      {activeTab === 'payroll' && (
        <CoreTable
          title="Monthly Payroll Ledger"
          subtitle="Calculated salaries, basic, allowances, statutory deductions and disbursement"
          data={payroll}
          columns={[
            { key: 'employeeName', header: 'Employee', sortable: true },
            { key: 'period', header: 'Salary Period' },
            {
              key: 'basic',
              header: 'Basic Pay',
              align: 'right',
              render: (p) => `${currency}${p.basic.toLocaleString()}`
            },
            {
              key: 'allowances',
              header: 'Allowances',
              align: 'right',
              render: (p) => `${currency}${p.allowances.toLocaleString()}`
            },
            {
              key: 'deductions',
              header: 'Deductions (TDS/PF)',
              align: 'right',
              render: (p) => (
                <span className="text-[#d93025]">-{currency}{p.deductions.toLocaleString()}</span>
              )
            },
            {
              key: 'netPay',
              header: 'Net Take Home',
              align: 'right',
              sortable: true,
              render: (p) => (
                <span className="font-bold text-[#1e8e3e]">
                  {currency}{p.netPay.toLocaleString()}
                </span>
              )
            },
            {
              key: 'paymentStatus',
              header: 'Status',
              render: (p) => (
                <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">
                  {p.paymentStatus}
                </span>
              )
            }
          ]}
          keyExtractor={(p) => p.id}
          addLabel="Disburse Payroll"
          onAdd={() => {
            alert('Batch payroll generated for active employees and recorded to banking ledgers.');
          }}
        />
      )}

      {/* Add Employee Dialog */}
      <CoreDialog
        open={empModalOpen}
        onClose={() => setEmpModalOpen(false)}
        title="Add New Employee"
        subtitle="Staff credentials, compensation details, and department assignment"
        maxWidth="md"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-3">
          <CoreInput
            label="Full Name"
            required
            value={empForm.name}
            onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
            placeholder="e.g. Vikram Malhotra"
          />
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Designation"
              required
              value={empForm.designation}
              onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
              placeholder="e.g. Senior Associate"
            />
            <CoreSelect
              label="Department"
              value={empForm.department}
              onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
              options={[
                { value: 'Operations', label: 'Operations' },
                { value: 'Finance', label: 'Finance & Accounts' },
                { value: 'Technology', label: 'Technology / Engineering' },
                { value: 'Sales', label: 'Sales & Business Dev' },
                { value: 'Legal', label: 'Legal & Compliance' }
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Email"
              type="email"
              value={empForm.email}
              onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
              placeholder="vikram@apexsolutions.com"
            />
            <CoreInput
              label="Mobile Number"
              value={empForm.mobile}
              onChange={(e) => setEmpForm({ ...empForm, mobile: e.target.value })}
              placeholder="+91 98000 00000"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Joining Date"
              type="date"
              value={empForm.joiningDate}
              onChange={(e) => setEmpForm({ ...empForm, joiningDate: e.target.value })}
            />
            <CoreInput
              label={`Monthly Salary CTC (${currency})`}
              type="number"
              value={empForm.salary}
              onChange={(e) => setEmpForm({ ...empForm, salary: Number(e.target.value) })}
            />
          </div>
          <CoreInput
            label="Address"
            value={empForm.address}
            onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })}
            placeholder="City, State"
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setEmpModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Save Employee
            </CoreButton>
          </div>
        </form>
      </CoreDialog>
    </div>
  );
};
