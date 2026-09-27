import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Menu,
  CalendarClock,
  Globe,
  Check
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export type NotificationRole = 'admin' | 'employee' | 'client' | 'hr' | 'team-lead';

type RoleNotification = {
  id: string;
  title: string;
  time: string;
  desc: string;
  unread: boolean;
  type: 'quote' | 'delta' | 'info' | 'alert';
  audience: NotificationRole[];
};

interface TopNavProps {
  viewerRole?: NotificationRole;
  onOpenCommandPalette: () => void;
  notificationCount: number;
  onToggleMobileMenu?: () => void;
  onNavigateToReminders?: () => void;
  urgentReminderCount?: number;
  currentAuthUser?: {
    id: string;
    name: string;
    role: string;
    title?: string;
    avatarUrl?: string;
    email: string;
  };
  onOpenLoginModal?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenCommandPalette,
  notificationCount,
  onToggleMobileMenu,
  onNavigateToReminders,
  urgentReminderCount = 0,
  viewerRole = 'admin',
  currentAuthUser,
  onOpenLoginModal,
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const [liveNotifications, setLiveNotifications] = useState<RoleNotification[]>([]);
  const [activeRole, setActiveRole] = useState<NotificationRole>(viewerRole);

  const { currency, setCurrency, currencyConfig, allCurrencies } = useCurrency();

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target as Node)) {
        setShowCurrencyMenu(false);
      }
    };
    if (showCurrencyMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showCurrencyMenu]);

  const notificationFeed: RoleNotification[] = [
    ...liveNotifications,
    {
      id: 'notif-1', title: 'RFI-2024-089 Delta Calculated', time: '12m ago',
      desc: 'Structural schedule rebar revision calculated: +$48,150.00 to Bid #BID-8849', unread: true, type: 'delta',
      audience: ['admin', 'team-lead', 'employee'],
    },
    {
      id: 'notif-2', title: 'Skanska USA Addendum Received', time: '1h ago',
      desc: 'MEP clash resolution package uploaded for Biotech Innovation Lab', unread: true, type: 'info',
      audience: ['admin', 'team-lead', 'employee'],
    },
    {
      id: 'notif-3', title: 'SLA Escalation Warning', time: '3h ago',
      desc: 'RFI-2024-092 ceiling plenum clash SLA response due within 6 hours', unread: false, type: 'alert',
      audience: ['admin', 'team-lead', 'employee'],
    },
    {
      id: 'notif-4', title: 'HR policy acknowledgement due', time: 'Today',
      desc: 'Please review and acknowledge the updated employee handbook.', unread: true, type: 'info',
      audience: ['hr', 'employee'],
    },
    {
      id: 'notif-5', title: 'Quotation status updated', time: 'Today',
      desc: 'Your quotation request is now being reviewed by the estimating team.', unread: true, type: 'quote',
      audience: ['client'],
    },
  ];
  const notifications = notificationFeed.filter((notification) => notification.audience.includes(activeRole));

  // Listen for new client quotation requests from the intake workflow.
  useEffect(() => {
    const handleQuoteIntake = (event: Event) => {
      const detail = (event as CustomEvent<{ title: string; description: string; intakeId: string; audience?: NotificationRole[] }>).detail;
      const audience = detail.audience ?? ['admin', 'team-lead', 'employee', 'hr'];
      const notification: RoleNotification = { id: detail.intakeId, title: detail.title, time: 'Just now', desc: detail.description, unread: true, type: 'quote', audience };
      setLiveNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)]);
      if (audience.includes(activeRole) && 'Notification' in window) {
        const showDesktopAlert = () => new Notification('New quotation request', { body: detail.description, tag: detail.intakeId });
        if (Notification.permission === 'granted') showDesktopAlert();
        else if (Notification.permission === 'default') void Notification.requestPermission().then((permission) => { if (permission === 'granted') showDesktopAlert(); });
      }
    };
    window.addEventListener('bid-exact:quote-intake-received', handleQuoteIntake);
    return () => window.removeEventListener('bid-exact:quote-intake-received', handleQuoteIntake);
  }, [activeRole]);

  // Close menus on click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);

  return (
    <header
      id="app-top-header"
      className="h-14 min-w-0 overflow-visible border-b border-[#222a3d] bg-[#0b1326] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50 select-none gap-2 sm:gap-4"
    >
      {/* Left Area: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        {onToggleMobileMenu && (
          <button
            id="btn-mobile-sidebar-toggle"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-[#86948a] hover:text-white bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] rounded-md transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Search Bar with Cmd+K */}
        <button
          id="btn-search-command-palette"
          onClick={onOpenCommandPalette}
          className="flex-1 h-9 bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] hover:border-[#3c4a42] rounded-md px-2.5 sm:px-3 flex items-center justify-between text-xs text-[#86948a] transition-colors group cursor-pointer overflow-hidden"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-[#86948a] group-hover:text-[#4edea3] transition-colors shrink-0" />
            <span className="text-[#86948a] group-hover:text-[#bbcabf] truncate hidden sm:inline">
              Search transactions, RFIs, projects (Cmd+K)...
            </span>
            <span className="text-[#86948a] group-hover:text-[#bbcabf] truncate sm:hidden">
              Search (⌘K)...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-[#0b1326] text-[#86948a] px-1.5 py-0.5 rounded border border-[#222a3d] shrink-0 ml-1">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Global Currency Switcher */}
        <div className="relative" ref={currencyMenuRef}>
          <button
            id="btn-global-currency-switcher"
            onClick={() => {
              setShowCurrencyMenu(!showCurrencyMenu);
              setShowNotifications(false);
            }}
            className={`h-9 px-2 sm:px-2.5 rounded-md border flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer ${
              currency !== 'USD'
                ? 'bg-[#4edea3]/10 border-[#4edea3]/40 text-[#4edea3] hover:bg-[#4edea3]/20 shadow-[0_0_12px_rgba(78,222,163,0.15)]'
                : 'bg-[#131b2e] hover:bg-[#171f33] border-[#222a3d] hover:border-[#3c4a42] text-[#dae2fd]'
            }`}
            title={`Active Global Currency: ${currencyConfig.name} (${currencyConfig.code}) - Click to toggle exchange conversion`}
            aria-label="Global Currency Switcher"
            aria-expanded={showCurrencyMenu}
          >
            <span className="text-sm leading-none" role="img" aria-label={currencyConfig.name}>
              {currencyConfig.flag}
            </span>
            <span className="font-bold tracking-wide">{currencyConfig.code}</span>
            <span className="text-[11px] opacity-75 hidden sm:inline font-sans">
              ({currencyConfig.symbol.trim()})
            </span>
            <ChevronDown
              className={`w-3 h-3 text-[#86948a] transition-transform duration-200 ${
                showCurrencyMenu ? 'rotate-180 text-[#4edea3]' : ''
              }`}
            />
          </button>

          {showCurrencyMenu && (
            <div
              id="menu-currency-dropdown"
              className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#171f33] border border-[#2d3449] rounded-xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3.5 py-3 border-b border-[#222a3d] bg-[#131b2e] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#4edea3]" />
                    <span>Global Currency &amp; FX Rates</span>
                  </div>
                  <p className="text-[10px] text-[#86948a] mt-0.5">
                    Converts all bids, balances &amp; ledger figures globally
                  </p>
                </div>
                <button
                  onClick={() => setShowCurrencyMenu(false)}
                  className="text-[#86948a] hover:text-[#dae2fd] p-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Currency Options List */}
              <div className="p-1.5 max-h-80 overflow-y-auto divide-y divide-[#222a3d]/50">
                {allCurrencies.map((c) => {
                  const isSelected = c.code === currency;
                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setShowCurrencyMenu(false);
                      }}
                      className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4edea3]/10 border border-[#4edea3]/30 text-white'
                          : 'hover:bg-[#1f2b48]/60 text-[#bbcabf] hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{c.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-white">
                              {c.code}
                            </span>
                            <span className="text-[11px] font-mono text-[#4edea3]">
                              {c.symbol.trim()}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#86948a] truncate">
                            {c.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <div className="text-[10px] font-mono text-[#86948a] bg-[#0b1326] px-1.5 py-0.5 rounded border border-[#222a3d]">
                          {c.code === 'USD' ? (
                            <span className="text-[#4edea3] font-semibold">1.00 (Base)</span>
                          ) : (
                            <span>1 USD = {c.rate.toFixed(c.code === 'JPY' ? 1 : 2)} {c.code}</span>
                          )}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-mono text-[#4edea3] flex items-center justify-end gap-1 mt-1 font-semibold">
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer info banner */}
              <div className="px-3 py-2 bg-[#0b1326] border-t border-[#222a3d] flex items-center justify-between text-[10px] font-mono text-[#86948a]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                  <span>Real-time conversion active</span>
                </span>
                <span className="text-[#dae2fd]">{currencyConfig.code} ({currencyConfig.symbol.trim()})</span>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-md bg-[#131b2e] hover:bg-[#171f33] border border-[#222a3d] flex items-center justify-center text-[#86948a] hover:text-[#dae2fd] relative transition-colors cursor-pointer"
            title="Notifications & SLA Alerts"
            aria-label="Notifications & SLA Alerts"
            aria-expanded={showNotifications}
            aria-controls="menu-notifications-popover"
          >
            <Bell className="w-4 h-4" />
            {(notificationCount > 0 || notifications.some((notification) => notification.unread)) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff7886] rounded-full ring-2 ring-[#0b1326]" />
            )}
          </button>

          {showNotifications && (
            <div
              id="menu-notifications-popover"
              className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-1.5rem))] max-h-[calc(100vh-5rem)] bg-[#171f33] border border-[#2d3449] rounded-lg shadow-2xl z-[100] overflow-hidden"
            >
              <div className="px-3 py-2.5 border-b border-[#222a3d] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#dae2fd] flex items-center gap-1.5">
                  Live Notifications & SLA Alerts
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#ff7886]/20 text-[#ffb4ab] rounded">
                    {notifications.filter((notification) => notification.unread).length} unread
                  </span>
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#86948a] hover:text-[#dae2fd]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#222a3d] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-left hover:bg-[#222a3d]/50 transition-colors ${
                      n.unread ? 'bg-[#131b2e]/60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {n.type === 'delta' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                        )}
                        {n.type === 'alert' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#ff7886]" />
                        )}
                        {n.type === 'info' && (
                          <Clock className="w-3.5 h-3.5 text-[#adc6ff]" />
                        )}
                        <span className="text-xs font-medium text-[#dae2fd]">
                          {n.title}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#86948a]">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#bbcabf] pl-5 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-[#222a3d] bg-[#0b1326]">
                <button
                  id="btn-nav-to-reminders-from-notifs"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToReminders?.();
                  }}
                  className="w-full py-1.5 px-3 rounded bg-[#1f2b48] hover:bg-[#28375c] text-xs font-semibold text-[#4edea3] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Company Reminders ({urgentReminderCount > 0 ? `${urgentReminderCount} Urgent` : 'Schedule & Filings'})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role-Based Auth Gateway Pill */}
        <div
          id="user-profile-pill"
          onClick={onOpenLoginModal}
          className="flex items-center gap-2 pl-2 border-l border-[#222a3d] cursor-pointer group hover:bg-[#131b2e] py-1 px-1.5 rounded-lg transition-colors"
          title="Click to switch between Owner, Employee, Client, and HR portal logins"
        >
          <div className="relative">
            {currentAuthUser?.avatarUrl ? (
              <img
                src={currentAuthUser.avatarUrl}
                alt={currentAuthUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#4edea3]/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center font-mono font-bold text-xs text-[#4edea3]">
                {currentAuthUser?.name ? currentAuthUser.name.slice(0, 2).toUpperCase() : 'UK'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4edea3] rounded-full ring-2 ring-[#0b1326]" />
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <div className="text-xs font-semibold text-[#dae2fd] group-hover:text-white flex items-center gap-1.5">
              <span>{currentAuthUser?.name || 'Umer Khayam'}</span>
              <ChevronDown className="w-3 h-3 text-[#86948a] group-hover:text-[#4edea3] transition-transform" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono tracking-wider text-[#4edea3] uppercase font-bold px-1.5 py-0.2 rounded bg-[#4edea3]/15">
                {(currentAuthUser?.role || 'owner').toUpperCase()} PORTAL
              </span>
              <span className="text-[9px] font-mono text-[#86948a] group-hover:text-[#38bdf8]">
                Switch
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
