import React, { useState } from 'react';
import {
  Users,
  Plus,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Search,
  Mail,
  KeyRound,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { EmployeeItem, PayrollRunItem, GeneratedCredentialsNotice } from '../../types';

interface HrPortalViewProps {
  employees: EmployeeItem[];
  payrollRuns: PayrollRunItem[];
  recentNotices: GeneratedCredentialsNotice[];
  onOpenOnboardModal: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectEmployee?: (emp: EmployeeItem) => void;
}

export const HrPortalView: React.FC<HrPortalViewProps> = ({
  employees,
  payrollRuns,
  recentNotices,
  onOpenOnboardModal,
  onNavigateTab,
  onSelectEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'logins-dispatched' | 'pto-payroll'>('roster');

  const activeEmployees = employees.filter(e => e.status === 'Active');
  const totalPayrollGross = employees.reduce((sum, e) => sum + e.annualSalary, 0);

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top HR Banner */}
      <div className="bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#172554] border border-[#3b82f6]/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/20 border border-[#3b82f6]/50 flex items-center justify-center text-[#93c5fd] shadow-[0_0_25px_rgba(59,130,246,0.3)] shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#3b82f6]/20 text-[#93c5fd] border border-[#3b82f6]/40">
                  HR &amp; PEOPLE OPERATIONS PORTAL
                </span>
                <span className="text-xs font-mono text-[#86948a]">
                  Automatic Employee Credential Dispatching Active
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
                <span>Workforce Onboarding &amp; People Hub</span>
                <Sparkles className="w-5 h-5 text-[#38bdf8]" />
              </h1>
              <p className="text-xs text-[#bbcabf] mt-1 max-w-2xl leading-relaxed">
                Whenever you register a new employee, the portal automatically provisions their secure email credentials and password. When that employee signs in, they are instantly redirected into their personalized Employee Workspace.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center flex-wrap">
            <button
              onClick={onOpenOnboardModal}
              className="px-4 py-2.5 rounded-lg bg-[#4edea3] hover:bg-[#40cf95] active:scale-[0.98] text-[#003824] text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register New Employee &amp; Generate Logins</span>
            </button>
            <button
              onClick={() => onNavigateTab('payroll')}
              className="px-3.5 py-2.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-mono text-[#dae2fd] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#4edea3]" />
              <span>Run Payroll</span>
            </button>
          </div>
        </div>
      </div>

      {/* HR KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">Active Headcount</span>
            <div className="p-1 rounded bg-[#3b82f6]/15 text-[#93c5fd]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{activeEmployees.length} Staff</div>
          <div className="text-[11px] text-[#4edea3] mt-2">100% active W-2 / 1099 compliant</div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">Annualized Payroll</span>
            <div className="p-1 rounded bg-[#4edea3]/15 text-[#4edea3]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#4edea3]">
            ${(totalPayrollGross / 1000000).toFixed(2)}M / yr
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            Avg Base: ${Math.round(totalPayrollGross / (employees.length || 1)).toLocaleString()}
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">Logins Dispatched</span>
            <div className="p-1 rounded bg-[#a855f7]/15 text-[#d8b4fe]">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{employees.length} Accounts</div>
          <div className="text-[11px] text-[#38bdf8] mt-2">Zero manual password setups needed</div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">Average Retention</span>
            <div className="p-1 rounded bg-[#10b981]/15 text-[#34d399]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">98.4%</div>
          <div className="text-[11px] text-[#86948a] mt-2">18.2 months average tenure</div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-[#222a3d] gap-2">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-4 py-2.5 rounded-t-lg text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'roster'
              ? 'bg-[#171f33] text-[#3b82f6] border-b-2 border-[#3b82f6]'
              : 'text-[#86948a] hover:text-[#dae2fd]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Workforce Directory ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logins-dispatched')}
          className={`px-4 py-2.5 rounded-t-lg text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'logins-dispatched'
              ? 'bg-[#171f33] text-[#4edea3] border-b-2 border-[#4edea3]'
              : 'text-[#86948a] hover:text-[#dae2fd]'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Auto-Generated Logins Feed</span>
          <span className="px-1.5 py-0.2 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-bold">
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('pto-payroll')}
          className={`px-4 py-2.5 rounded-t-lg text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'pto-payroll'
              ? 'bg-[#171f33] text-[#38bdf8] border-b-2 border-[#38bdf8]'
              : 'text-[#86948a] hover:text-[#dae2fd]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Payroll History &amp; PTO Bank</span>
        </button>
      </div>

      {/* Subtab 1: Workforce Directory */}
      {activeSubTab === 'roster' && (
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#86948a] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, role, email, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#0b1326] border border-[#222a3d] rounded text-xs text-white placeholder-[#86948a] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <span className="text-xs font-mono text-[#86948a]">
              Showing {filteredEmployees.length} of {employees.length} personnel
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0b1326] text-[#86948a] border-b border-[#222a3d]">
                <tr>
                  <th className="py-2.5 px-3">Employee Name / ID</th>
                  <th className="py-2.5 px-3">Department &amp; Role</th>
                  <th className="py-2.5 px-3">Portal Email / Username</th>
                  <th className="py-2.5 px-3">Annual Salary / Gross</th>
                  <th className="py-2.5 px-3">PTO Balance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222a3d]">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee?.(emp)}
                    className="hover:bg-[#171f33]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{emp.name}</div>
                      <div className="text-[10px] text-[#86948a]">{emp.id} · {emp.type}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#dae2fd]">{emp.role}</div>
                      <div className="text-[10px] text-[#86948a]">{emp.department}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#38bdf8] flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{emp.email}</span>
                      </div>
                      <div className="text-[10px] text-[#4edea3]">Direct Login Provisioned</div>
                    </td>
                    <td className="py-3 px-3 text-[#dae2fd]">
                      <div>${emp.annualSalary.toLocaleString()} / yr</div>
                      <div className="text-[10px] text-[#86948a]">${Math.round(emp.monthlyGross).toLocaleString()} / mo</div>
                    </td>
                    <td className="py-3 px-3 text-[#dae2fd]">
                      <div>{emp.ptoDaysRemaining} Days Available</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 font-bold">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Logins Dispatched */}
      {activeSubTab === 'logins-dispatched' && (
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222a3d] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#4edea3]" />
                <span>Automated Login Generation Audit Log</span>
              </h3>
              <p className="text-xs text-[#86948a] mt-0.5">
                Every time an employee or client is onboarded, their secure portal login is created here automatically.
              </p>
            </div>
            <button
              onClick={onOpenOnboardModal}
              className="px-3.5 py-1.5 rounded bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Employee</span>
            </button>
          </div>

          <div className="space-y-3">
            {recentNotices.length === 0 ? (
              <div className="text-center py-8 text-[#86948a] font-mono text-xs">
                No recent logins generated in this session. Register an employee to see the automated credential card!
              </div>
            ) : (
              recentNotices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-[#0b1326] border border-[#222a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{n.name}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#4edea3]/20 text-[#4edea3]">
                        {n.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#86948a] mt-1">
                      Login: <span className="text-[#dae2fd]">{n.email}</span> · Temp Pass: <span className="text-[#4edea3] font-bold">{n.tempPassword}</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] font-mono text-[#86948a]">
                    <div className="flex items-center gap-1 text-[#4edea3]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{n.sentStatus.toUpperCase()}</span>
                    </div>
                    <span>{n.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subtab 3: PTO & Payroll */}
      {activeSubTab === 'pto-payroll' && (
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222a3d] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#4edea3]" />
                <span>Historical Payroll Runs (Processed via Gusto ACH)</span>
              </h3>
              <p className="text-xs text-[#86948a] mt-0.5">
                Complete compliance records, tax withholdings and net disbursements
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('payroll')}
              className="text-xs font-mono text-[#38bdf8] hover:underline cursor-pointer"
            >
              Open Full Payroll Module &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[#86948a] border-b border-[#222a3d] pb-2">
                <tr>
                  <th className="py-2.5 px-3">Run ID</th>
                  <th className="py-2.5 px-3">Pay Period</th>
                  <th className="py-2.5 px-3">Disbursement Date</th>
                  <th className="py-2.5 px-3">Gross Total</th>
                  <th className="py-2.5 px-3">Taxes Withheld</th>
                  <th className="py-2.5 px-3">Net Paid</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222a3d]">
                {payrollRuns.map((r) => (
                  <tr key={r.id} className="hover:bg-[#171f33]/50">
                    <td className="py-3 px-3 font-bold text-white">{r.id}</td>
                    <td className="py-3 px-3 text-[#dae2fd]">{r.period}</td>
                    <td className="py-3 px-3 text-[#86948a]">{r.payDate}</td>
                    <td className="py-3 px-3 font-bold text-white">${r.totalGross.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[#fca5a5]">${r.totalTaxesWithheld.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-[#4edea3]">${r.totalNetPaid.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#4edea3]/15 text-[#4edea3] font-bold">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
