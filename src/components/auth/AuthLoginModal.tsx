import React, { useState } from 'react';
import {
  Boxes,
  ShieldCheck,
  UserCheck,
  Building2,
  PieChart,
  Landmark,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  Users,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { UserAuthAccount, UserRole } from '../../types';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAuthAccount[];
  currentUser: UserAuthAccount;
  onSelectUser: (user: UserAuthAccount) => void;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currentUser,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'quick-select' | 'credential-login'>('quick-select');
  const [inputIdentifier, setInputIdentifier] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSuccessUser, setLoginSuccessUser] = useState<UserAuthAccount | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const term = inputIdentifier.trim().toLowerCase();
    
    // Find matching user by email or username or target ID
    const found = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === term ||
        acc.username.toLowerCase() === term ||
        acc.id.toLowerCase() === term
    );

    if (!found) {
      setErrorMessage(`No account found matching "${inputIdentifier}". Try one of the pre-configured logins or check Employee/Client directory.`);
      return;
    }

    // Success login
    setLoginSuccessUser(found);
    setTimeout(() => {
      onSelectUser(found);
      onClose();
    }, 600);
  };

  const roleMeta: Record<UserRole, { title: string; desc: string; icon: React.ComponentType<{ className?: string }>; color: string; badge: string }> = {
    owner: {
      title: 'Owner & Executive Portal',
      desc: 'Complete portfolio ownership, cap table, partner payouts, banking limits & governance.',
      icon: PieChart,
      color: 'border-[#a855f7]/40 bg-[#a855f7]/10 text-[#d8b4fe]',
      badge: 'OWNER / FOUNDER',
    },
    hr: {
      title: 'HR & People Operations Portal',
      desc: 'Employee directory, new onboarding & auto credential dispatch, payroll & PTO records.',
      icon: Users,
      color: 'border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#93c5fd]',
      badge: 'HR / PEOPLE OPS',
    },
    employee: {
      title: 'Employee Workspace Portal',
      desc: 'Assigned takeoffs, daily punch-list, tasks, personal PTO/payroll history, material estimation.',
      icon: UserCheck,
      color: 'border-[#4edea3]/40 bg-[#4edea3]/10 text-[#4edea3]',
      badge: 'EMPLOYEE WORKSPACE',
    },
    client: {
      title: 'Direct Client Portal',
      desc: 'External general contractor portal, project milestones, live takeoff packages, RFI submissions.',
      icon: Building2,
      color: 'border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#7dd3fc]',
      badge: 'CLIENT GATEWAY',
    },
    finance: {
      title: 'Corporate Finance & GL Portal',
      desc: 'Balance sheets, cash flow, Wise/Payoneer/Mercury direct accounts, corporate loans & audit trail.',
      icon: Landmark,
      color: 'border-[#eab308]/40 bg-[#eab308]/10 text-[#fde047]',
      badge: 'FINANCE & TREASURY',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-[#2d3449] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-5 border-b border-[#222a3d] bg-[#171f33] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3] shadow-[0_0_15px_rgba(78,222,163,0.15)]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Bid Exact Role-Based Login Gateway</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] font-bold">
                  MULTI-PORTAL
                </span>
              </div>
              <p className="text-xs text-[#86948a] mt-0.5">
                Current active session: <span className="text-white font-medium">{currentUser.name}</span> ({currentUser.role.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#222a3d] text-[#86948a] hover:text-[#dae2fd] flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#222a3d] bg-[#0f172a] px-6">
          <button
            onClick={() => setActiveTab('quick-select')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'quick-select'
                ? 'border-[#4edea3] text-[#4edea3]'
                : 'border-transparent text-[#86948a] hover:text-[#dae2fd]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Select Account / Role Test (Instant Login)</span>
          </button>
          <button
            onClick={() => setActiveTab('credential-login')}
            className={`py-3 px-4 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'credential-login'
                ? 'border-[#4edea3] text-[#4edea3]'
                : 'border-transparent text-[#86948a] hover:text-[#dae2fd]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter Username / Generated Password</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'quick-select' ? (
            <div className="space-y-3">
              <p className="text-xs text-[#bbcabf] leading-relaxed">
                Click any persona below to experience their authentic role interface. When a user logs in, the portal{' '}
                <strong className="text-white">instantly renders only their specific permissions & portal</strong>:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {accounts.map((acc) => {
                  const meta = roleMeta[acc.role] || roleMeta.employee;
                  const Icon = meta.icon;
                  const isCurrent = currentUser.id === acc.id;

                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        onSelectUser(acc);
                        onClose();
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#4edea3] bg-[#4edea3]/10 shadow-[0_0_15px_rgba(78,222,163,0.1)]'
                          : 'border-[#222a3d] bg-[#0b1326] hover:border-[#38bdf8]/40 hover:bg-[#131b2e]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${meta.color}`}>
                            {meta.badge}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#4edea3]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          {acc.avatarUrl ? (
                            <img
                              src={acc.avatarUrl}
                              alt={acc.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-[#38bdf8]/40 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center font-mono font-bold text-xs text-[#4edea3] shrink-0">
                              {acc.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-[#4edea3] transition-colors">
                              {acc.name}
                            </h4>
                            <p className="text-[11px] text-[#86948a] truncate">
                              {acc.title || acc.department}
                            </p>
                          </div>
                        </div>

                        <div className="text-[10px] font-mono text-[#86948a] bg-[#171f33] p-1.5 rounded border border-[#222a3d] space-y-0.5">
                          <div className="truncate"><span className="text-[#64748b]">Login:</span> <span className="text-[#dae2fd]">{acc.email}</span></div>
                          {acc.autoGeneratedPassword && (
                            <div className="truncate"><span className="text-[#64748b]">Pass:</span> <span className="text-[#4edea3]">{acc.autoGeneratedPassword}</span></div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#1b253b] flex items-center justify-between text-[11px] text-[#38bdf8] font-mono group-hover:translate-x-0.5 transition-transform">
                        <span>Load {acc.role.toUpperCase()} Interface</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualLogin} className="space-y-4 max-w-md mx-auto py-2">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3] mx-auto mb-2 shadow-[0_0_20px_rgba(78,222,163,0.15)]">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Enter Account Credentials</h4>
                <p className="text-xs text-[#86948a] mt-1">
                  Authenticate with any employee, client, owner, or HR credentials
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 text-xs text-[#fca5a5] font-mono leading-relaxed">
                  {errorMessage}
                </div>
              )}

              {loginSuccessUser && (
                <div className="p-3 rounded-lg bg-[#4edea3]/15 border border-[#4edea3]/30 text-xs text-[#4edea3] font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticated as {loginSuccessUser.name}! Routing to {loginSuccessUser.role.toUpperCase()} portal...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-[#86948a] font-semibold mb-1">
                  Login Identifier / Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#86948a] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. umer@bidexact.com or rsterling@turnerconstruction.com"
                    value={inputIdentifier}
                    onChange={(e) => setInputIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0b1326] border border-[#222a3d] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#4edea3] font-mono"
                  />
                </div>
                <p className="text-[10px] font-mono text-[#86948a] mt-1">
                  Accepts username (e.g. "umer", "turner.client", "marcus.lee") or full email
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#86948a] font-semibold mb-1">
                  Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#86948a] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0b1326] border border-[#222a3d] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#4edea3] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#86948a] hover:text-[#dae2fd]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#4edea3] hover:bg-[#40cf95] active:scale-[0.99] text-[#003824] rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In & Route to Dedicated Portal</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#222a3d] bg-[#0b1326] flex items-center justify-between text-[11px] text-[#86948a] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
            <span>Role-Based Access Control (RBAC) Active</span>
          </div>
          <span>Bid Exact LLC Enterprise</span>
        </div>
      </div>
    </div>
  );
};
