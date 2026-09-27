import React, { useState } from 'react';
import {
  X,
  Mail,
  KeyRound,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GeneratedCredentialsNotice, UserRole } from '../../types';

interface CredentialsNoticeModalProps {
  isOpen: boolean;
  notice: GeneratedCredentialsNotice | null;
  onClose: () => void;
  onSwitchToThisAccount?: (userId: string) => void;
}

export const CredentialsNoticeModal: React.FC<CredentialsNoticeModalProps> = ({
  isOpen,
  notice,
  onClose,
  onSwitchToThisAccount,
}) => {
  const [copiedField, setCopiedField] = useState<'email' | 'password' | 'all' | null>(null);

  if (!isOpen || !notice) return null;

  const copyToClipboard = (text: string, field: 'email' | 'password' | 'all') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return { label: 'Owner & Managing Principal Portal', color: 'bg-[#a855f7]/20 text-[#d8b4fe] border-[#a855f7]/40' };
      case 'hr':
        return { label: 'HR & People Operations Portal', color: 'bg-[#3b82f6]/20 text-[#93c5fd] border-[#3b82f6]/40' };
      case 'client':
        return { label: 'Direct External Client Portal', color: 'bg-[#38bdf8]/20 text-[#7dd3fc] border-[#38bdf8]/40' };
      case 'finance':
        return { label: 'Corporate Finance & GL Portal', color: 'bg-[#eab308]/20 text-[#fde047] border-[#eab308]/40' };
      case 'employee':
      default:
        return { label: 'Dedicated Employee Workspace', color: 'bg-[#4edea3]/20 text-[#4edea3] border-[#4edea3]/40' };
    }
  };

  const badge = getRoleBadge(notice.role);

  const fullLoginCard = `Bid Exact LLC - Portal Access Details
Name: ${notice.name}
Role Access: ${notice.role.toUpperCase()} Interface
Entity / Department: ${notice.targetEntityName}
Portal Login Email: ${notice.email}
Temporary Secure Password: ${notice.tempPassword}
Portal URL: https://bidexact.com/login
Note: When this user logs in, the portal will automatically load their dedicated ${notice.role} interface.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-[#2d3449] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="px-6 py-5 border-b border-[#222a3d] bg-[#171f33] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3] shadow-[0_0_15px_rgba(78,222,163,0.15)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Logins Automatically Generated!</h3>
              </div>
              <p className="text-xs text-[#86948a] mt-0.5">
                Dedicated credentials dispatched for <span className="text-[#dae2fd] font-medium">{notice.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#222a3d] text-[#86948a] hover:text-[#dae2fd] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Target Role Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${badge.color}`}>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider block">
                  {badge.label}
                </span>
                <span className="text-[11px] opacity-80">
                  {notice.targetEntityName}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/30 font-semibold">
              Auto-Routed
            </span>
          </div>

          <p className="text-xs text-[#bbcabf] leading-relaxed">
            Whenever this user signs in with these credentials, the system will{' '}
            <strong className="text-white">automatically redirect them straight to their specific {notice.role} portal</strong>{' '}
            with all security policies, assigned records, and actions already configured.
          </p>

          {/* Credentials Box */}
          <div className="bg-[#0b1326] border border-[#222a3d] rounded-xl p-4 space-y-3.5">
            {/* Email / Username */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#86948a] font-semibold block">
                  Portal Login ID / Email
                </label>
                <div className="font-mono text-sm text-white font-semibold flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>{notice.email}</span>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(notice.email, 'email')}
                className="px-2.5 py-1 rounded bg-[#171f33] hover:bg-[#222a3d] text-[#86948a] hover:text-[#dae2fd] text-xs font-mono flex items-center gap-1 border border-[#222a3d] transition-colors cursor-pointer"
              >
                {copiedField === 'email' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-[#4edea3]" />
                    <span className="text-[#4edea3]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1b253b]">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#86948a] font-semibold block">
                  Generated Temporary Password
                </label>
                <div className="font-mono text-sm text-[#4edea3] font-bold tracking-wider flex items-center gap-1.5 mt-0.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>{notice.tempPassword}</span>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(notice.tempPassword, 'password')}
                className="px-2.5 py-1 rounded bg-[#171f33] hover:bg-[#222a3d] text-[#86948a] hover:text-[#dae2fd] text-xs font-mono flex items-center gap-1 border border-[#222a3d] transition-colors cursor-pointer"
              >
                {copiedField === 'password' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-[#4edea3]" />
                    <span className="text-[#4edea3]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Notice Info */}
          <div className="flex items-center gap-2 text-[11px] text-[#86948a] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span>Automated onboarding email notification marked as dispatched at {notice.createdAt}.</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={() => copyToClipboard(fullLoginCard, 'all')}
              className="w-full sm:w-1/2 py-2.5 px-4 bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] rounded-lg text-xs font-mono text-[#dae2fd] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedField === 'all' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                  <span className="text-[#4edea3]">Full Package Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#86948a]" />
                  <span>Copy Full Login Details</span>
                </>
              )}
            </button>

            {onSwitchToThisAccount ? (
              <button
                onClick={() => {
                  onSwitchToThisAccount(notice.userId);
                  onClose();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                <span>Login As {notice.name.split(' ')[0]} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                <span>Done</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
