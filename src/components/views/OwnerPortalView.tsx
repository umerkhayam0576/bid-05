import React, { useState } from 'react';
import {
  PieChart,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Award,
  Lock,
  Download,
  Calendar,
  Layers,
  FileCheck2,
  Send,
  Plus,
  Sliders,
  CheckCircle2,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import {
  PartnerItem,
  PartnerPayoutRecord,
  ConnectedBankAccount,
  BankTransferRequest,
  EmployeeItem,
  ClientItem,
  BidItem
} from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

interface OwnerPortalViewProps {
  ownerPartner?: PartnerItem;
  partners: PartnerItem[];
  partnerPayouts: PartnerPayoutRecord[];
  connectedAccounts: ConnectedBankAccount[];
  transferRequests: BankTransferRequest[];
  employees: EmployeeItem[];
  clients: ClientItem[];
  bids: BidItem[];
  onNavigateTab: (tab: any) => void;
  onExecutePayout?: (payout: any, partner: any, txn: any) => void;
}

export const OwnerPortalView: React.FC<OwnerPortalViewProps> = ({
  ownerPartner,
  partners,
  partnerPayouts,
  connectedAccounts,
  transferRequests,
  employees,
  clients,
  bids,
  onNavigateTab,
}) => {
  const { formatCurrency } = useCurrency();
  const [selectedSubTab, setSelectedSubTab] = useState<'equity-holdings' | 'banking-limits' | 'distributions' | 'org-portfolio'>('equity-holdings');

  // Primary owner: Umer Khayam or passed partner
  const owner = ownerPartner || partners.find(p => p.id === 'PARTNER-01') || partners[0] || {
    id: 'PARTNER-01',
    name: 'Umer Khayam',
    role: 'Founder & Managing Principal',
    equityPercent: 50.0,
    profitSharePercent: 50.0,
    capitalContributed: 50000,
    currentCapitalBalance: 182500,
    totalPayoutsYtd: 125000,
    pendingDistribution: 28000,
    taxIdMask: 'XXX-XX-9182',
    bankRoutingMask: 'Chase Premier ••9410',
    email: 'umer@bidexact.com',
  };

  const totalCompanyValuation = 4800000; // $4.8M valuation based on cap table
  const ownerEquityValue = (totalCompanyValuation * owner.equityPercent) / 100;
  const totalCashInBanks = connectedAccounts.reduce((sum, a) => sum + a.balance, 0);
  const pendingApprovalsCount = transferRequests.filter(r => r.status === 'pending_partner_approval').length;
  const totalEmployeesCount = employees.length;
  const totalPipeline = bids.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Owner Identity Banner */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#131b2e] to-[#0f172a] border border-[#a855f7]/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#a855f7]/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/20 border border-[#a855f7]/50 flex items-center justify-center text-[#d8b4fe] shadow-[0_0_25px_rgba(168,85,247,0.3)] shrink-0">
              <PieChart className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#a855f7]/20 text-[#d8b4fe] border border-[#a855f7]/40">
                  MANAGING PRINCIPAL &amp; 50% OWNER PORTAL
                </span>
                <span className="text-xs font-mono text-[#86948a]">
                  Corporate Entity: Bid Exact LLC (Delaware)
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
                <span>Welcome back, {owner.name}</span>
                <ShieldCheck className="w-5 h-5 text-[#4edea3]" />
              </h1>
              <p className="text-xs text-[#bbcabf] mt-1 max-w-2xl leading-relaxed">
                You possess full governance authority, voting rights (Class A), capital allocation controls, and multi-partner sign-off permissions for all institutional bank transfers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center flex-wrap">
            <button
              onClick={() => onNavigateTab('cap-table')}
              className="px-3.5 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] border border-[#a855f7]/40 text-[#d8b4fe] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Full Cap Table</span>
            </button>
            <button
              onClick={() => onNavigateTab('connected-banks')}
              className="px-3.5 py-2 rounded-lg bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] text-xs font-mono font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Manage Bank Approvals ({pendingApprovalsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Owner Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Owner Equity Worth */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">
              Owner Equity Value ({owner.equityPercent}%)
            </span>
            <div className="p-1 rounded bg-[#a855f7]/15 text-[#d8b4fe]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatCurrency(ownerEquityValue)}
          </div>
          <div className="text-[11px] text-[#4edea3] mt-2 flex items-center gap-1">
            <span>Based on {formatCurrency(4800000, { compact: true })} valuation</span>
          </div>
        </div>

        {/* Current Capital Balance */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">
              Partner Capital Balance
            </span>
            <div className="p-1 rounded bg-[#4edea3]/15 text-[#4edea3]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#4edea3]">
            {formatCurrency(owner.currentCapitalBalance)}
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            Initial Capital: {formatCurrency(owner.capitalContributed)} (365% return)
          </div>
        </div>

        {/* Total Cash in Institutional Banks */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">
              Connected Liquid Cash
            </span>
            <div className="p-1 rounded bg-[#38bdf8]/15 text-[#38bdf8]">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatCurrency(totalCashInBanks)}
          </div>
          <div className="text-[11px] text-[#38bdf8] mt-2">
            Across Wise, Payoneer &amp; Mercury
          </div>
        </div>

        {/* Pending Profit Distribution */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#86948a] uppercase font-semibold">
              Pending Q3/Q4 Distribution
            </span>
            <div className="p-1 rounded bg-[#f59e0b]/15 text-[#fbbf24]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#fbbf24]">
            {formatCurrency(owner.pendingDistribution)}
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            YTD Distributions Received: {formatCurrency(owner.totalPayoutsYtd)}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#222a3d] gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSubTab('equity-holdings')}
          className={`px-4 py-2.5 rounded-t-lg text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            selectedSubTab === 'equity-holdings'
              ? 'bg-[#171f33] text-[#a855f7] border-b-2 border-[#a855f7]'
              : 'text-[#86948a] hover:text-[#dae2fd]'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>My Ownership &amp; Share Classes</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('banking-limits')}
          className={`px-4 py-2.5 rounded-t-lg text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            selectedSubTab === 'banking-limits'
              ? 'bg-[#171f33] text-[#4edea3] border-b-2 border-[#4edea3]'
              : 'text-[#86948a] hover:text-[#dae2fd]'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Institutional Bank Controls &amp; Limits</span>
          {pendingApprovalsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded bg-[#f59e0b]/20 text-[#fbbf24] text-[10px] font-bold">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSelectedSubTab('distributions')}
          className={`px-4 py-2.5 rounded-t-lg text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            selectedSubTab === 'distributions'
              ? 'bg-[#171f33] text-[#38bdf8] border-b-2 border-[#38bdf8]'
              : 'text-[#86948a] hover:text-[#dae2fd]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Partner Profit Distributions</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('org-portfolio')}
          className={`px-4 py-2.5 rounded-t-lg text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            selectedSubTab === 'org-portfolio'
              ? 'bg-[#171f33] text-white border-b-2 border-white'
              : 'text-[#86948a] hover:text-[#dae2fd]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Company Assets &amp; Pipeline Overview</span>
        </button>
      </div>

      {/* Sub-tab 1: Equity Holdings */}
      {selectedSubTab === 'equity-holdings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#a855f7]" />
                  <span>Equity Breakdown &amp; Legal Share Certificates</span>
                </h3>
                <p className="text-xs text-[#86948a] mt-0.5">
                  Verified shareholder registers filed under Delaware General Corporation Law
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('cap-table')}
                className="text-xs font-mono text-[#a855f7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Shareholders</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-[#0b1326] border border-[#a855f7]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{owner.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#a855f7]/20 text-[#d8b4fe]">
                      FOUNDER &amp; MANAGING PRINCIPAL
                    </span>
                  </div>
                  <div className="text-xs text-[#86948a] mt-1">
                    6,000,000 Shares · Class A Voting Common Stock · Certificate #CERT-001
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-white">50.0% Equity</div>
                  <div className="text-xs font-mono text-[#4edea3]">50.0% Profit Allocation</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b1326] border border-[#222a3d] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Ahmad Khan</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3b82f6]/20 text-[#93c5fd]">
                      CO-FOUNDER &amp; CTO
                    </span>
                  </div>
                  <div className="text-xs text-[#86948a] mt-1">
                    3,600,000 Shares · Class B Common Stock · Certificate #CERT-002
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-white">30.0% Equity</div>
                  <div className="text-xs font-mono text-[#38bdf8]">30.0% Profit Allocation</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b1326] border border-[#222a3d] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Marcus Vance</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10b981]/20 text-[#6ee7b7]">
                      PRINCIPAL &amp; VP PRE-CON
                    </span>
                  </div>
                  <div className="text-xs text-[#86948a] mt-1">
                    1,800,000 Shares · Class B Common Stock · Certificate #CERT-003
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-white">15.0% Equity</div>
                  <div className="text-xs font-mono text-[#10b981]">15.0% Profit Allocation</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b1326] border border-[#222a3d] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">ESOP &amp; Strategic Advisory Pool</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#64748b]/20 text-[#cbd5e1]">
                      UNALLOCATED RESERVE
                    </span>
                  </div>
                  <div className="text-xs text-[#86948a] mt-1">
                    600,000 Option Pool · Reserved for Key Estimators &amp; Leadership
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-white">5.0% Equity</div>
                  <div className="text-xs font-mono text-[#86948a]">Retained Earnings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Governance & Voting Rights Card */}
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
              <span>Owner Governance Powers</span>
            </h3>
            
            <div className="space-y-3 text-xs text-[#bbcabf]">
              <div className="p-3 rounded-lg bg-[#0b1326] border border-[#222a3d] space-y-1">
                <span className="font-semibold text-white block">1. Sole Unilateral Bank Threshold</span>
                <p className="text-[11px] text-[#86948a]">
                  Can disburse up to $25,000 from Wise, Payoneer, or Mercury without secondary sign-off.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0b1326] border border-[#222a3d] space-y-1">
                <span className="font-semibold text-white block">2. Dual-Sign-Off Supermajority</span>
                <p className="text-[11px] text-[#86948a]">
                  Transactions &ge; $25,000 require your approval plus Ahmad Khan or Marcus Vance.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0b1326] border border-[#222a3d] space-y-1">
                <span className="font-semibold text-white block">3. Capital Distribution Initiation</span>
                <p className="text-[11px] text-[#86948a]">
                  Authorized to declare and disburse quarterly partner profit draws to personal ACH.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0b1326] border border-[#222a3d] space-y-1">
                <span className="font-semibold text-white block">4. Shareholder Voting Power</span>
                <p className="text-[11px] text-[#86948a]">
                  60.0% of all voting common stock on board resolutions and corporate actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Banking Limits */}
      {selectedSubTab === 'banking-limits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#4edea3]" />
                <span>Institutional Accounts Owned &amp; Governed</span>
              </h3>
              <p className="text-xs text-[#86948a]">
                Direct live treasury accounts under your administrative control
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('connected-banks')}
              className="px-3.5 py-1.5 rounded bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Approval Thresholds</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connectedAccounts.map((acc) => (
              <div key={acc.id} className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#4edea3]/15 text-[#4edea3]">
                    {acc.provider.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-[#86948a]">
                    Acct: {acc.accountNumberMask}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{acc.accountName}</h4>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {formatCurrency(acc.balance)}
                  </div>
                </div>
                <div className="pt-3 border-t border-[#222a3d] text-xs font-mono space-y-1 text-[#86948a]">
                  <div className="flex justify-between">
                    <span>Auto-Disburse:</span>
                    <span className="text-white">&lt; {formatCurrency(acc.autoApprovalLimit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dual-Sign-Off Trigger:</span>
                    <span className="text-[#fbbf24]">&ge; {formatCurrency(acc.dualSignOffThreshold)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Distributions */}
      {selectedSubTab === 'distributions' && (
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222a3d] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#4edea3]" />
                <span>Owner Profit Distributions History (Schedule K-1)</span>
              </h3>
              <p className="text-xs text-[#86948a] mt-0.5">
                Direct wire disbursements to Chase Premier ••9410
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('partners')}
              className="px-3.5 py-1.5 rounded bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] text-xs font-mono text-[#dae2fd] cursor-pointer"
            >
              <span>Distribute Next Quarter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[#86948a] border-b border-[#222a3d] pb-2">
                <tr>
                  <th className="py-2.5 px-3">Distribution ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Quarter</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222a3d]">
                {partnerPayouts
                  .filter((p) => p.partnerId === owner.id || p.partnerName.includes(owner.name))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-[#171f33]/50">
                      <td className="py-3 px-3 text-white font-bold">{p.id}</td>
                      <td className="py-3 px-3 text-[#dae2fd]">{p.date}</td>
                      <td className="py-3 px-3 text-[#38bdf8]">{p.payoutType}</td>
                      <td className="py-3 px-3 text-[#4edea3] font-bold">{formatCurrency(p.amount)}</td>
                      <td className="py-3 px-3 text-[#86948a]">{p.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#4edea3]/15 text-[#4edea3] font-bold">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Org & Assets */}
      {selectedSubTab === 'org-portfolio' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#86948a] uppercase">Active Enterprise GC Clients</span>
              <Building2 className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{clients.length} Accounts</div>
            <p className="text-[11px] text-[#86948a]">
              Turner Construction, Skanska USA, Clark Construction, Balfour Beatty
            </p>
            <button
              onClick={() => onNavigateTab('clients')}
              className="text-xs font-mono text-[#38bdf8] hover:underline pt-2 block cursor-pointer"
            >
              Open Client Accounts &rarr;
            </button>
          </div>

          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#86948a] uppercase">Total Active Staff</span>
              <Users className="w-4 h-4 text-[#4edea3]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{employees.length} Employees</div>
            <p className="text-[11px] text-[#86948a]">
              Pre-Construction, Estimating Operations, VDC &amp; BIM specialists
            </p>
            <button
              onClick={() => onNavigateTab('hr-directory')}
              className="text-xs font-mono text-[#4edea3] hover:underline pt-2 block cursor-pointer"
            >
              Open Employee Management &rarr;
            </button>
          </div>

          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#86948a] uppercase">Active Bids Pipeline</span>
              <Briefcase className="w-4 h-4 text-[#a855f7]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{formatCurrency(totalPipeline, { compact: true })}</div>
            <p className="text-[11px] text-[#86948a]">
              {bids.length} Tier-1 commercial bids under active takeoff
            </p>
            <button
              onClick={() => onNavigateTab('rfis-bids')}
              className="text-xs font-mono text-[#a855f7] hover:underline pt-2 block cursor-pointer"
            >
              Open RFIs &amp; Bids Hub &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
