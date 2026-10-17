import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
  Search,
  Download,
  Users,
  FileText,
  CheckCircle,
  Briefcase,
  Award,
  LayoutGrid,
  Lock,
  RefreshCw,
  LogOut,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { PageView } from './Navbar';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { getApprovedMap, ApplicationStatus } from '../lib/approvalStore';

type TabType = 'all' | 'registrations' | 'delegations' | 'chairboard_apps' | 'admin_apps' | 'press_apps';
type StatusFilterType = 'all' | 'pending' | 'approved' | 'waitlist' | 'rejected';

interface AdminDashboardProps {
  onNavigate?: (page: PageView) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeApp, setActiveApp] = useState<{
    item: any;
    tab: 'details' | 'email';
    decision?: 'approval' | 'rejection' | 'waitlist';
  } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [data, setData] = useState<Record<string, any[]>>({
    registrations: [],
    delegations: [],
    chairboard_apps: [],
    admin_apps: [],
    press_apps: []
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput.trim()
      });

      if (error) {
        setAuthError(error.message === 'Invalid login credentials' 
          ? 'Hatalı e-posta veya şifre girdiniz.' 
          : `Giriş hatası: ${error.message}`);
      } else if (authData.session) {
        setIsAuthenticated(true);
        setAuthError('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Giriş sırasında bir hata oluştu.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const tabs: Exclude<TabType, 'all'>[] = [
        'registrations',
        'delegations',
        'chairboard_apps',
        'admin_apps',
        'press_apps'
      ];
      const results: Record<string, any[]> = {};

      for (const tab of tabs) {
        const { data: tableData, error } = await supabase
          .from(tab)
          .select('*');

        if (error) {
          console.error(`Error fetching ${tab}:`, error);
          results[tab] = [];
        } else {
          const sorted = (tableData || []).map((row: any) => ({
            ...row,
            _table: tab
          })).sort((a: any, b: any) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          results[tab] = sorted;
        }
      }

      setData(results);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalSuccess = (
    updatedId: string,
    status: ApplicationStatus = 'approved'
  ) => {
    setData(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map(item =>
          item.id === updatedId
            ? { ...item, status, isApproved: status === 'approved' }
            : item
        );
      }
      return next;
    });

    if (activeApp && activeApp.item.id === updatedId) {
      setActiveApp(prev =>
        prev
          ? {
              ...prev,
              item: { ...prev.item, status, isApproved: status === 'approved' }
            }
          : null
      );
    }
  };

  const filteredData = useMemo(() => {
    const approvedMap = getApprovedMap();

    let currentData: any[] = [];
    if (activeTab === 'all') {
      currentData = [
        ...data.registrations.map(item => ({ ...item, app_type: 'Delegate', _table: 'registrations' })),
        ...data.delegations.map(item => ({ ...item, app_type: 'Delegation', _table: 'delegations' })),
        ...data.chairboard_apps.map(item => ({ ...item, app_type: 'Chairboard', _table: 'chairboard_apps' })),
        ...data.admin_apps.map(item => ({ ...item, app_type: 'Admin Staff', _table: 'admin_apps' })),
        ...data.press_apps.map(item => ({ ...item, app_type: 'Press Corps', _table: 'press_apps' }))
      ];
      currentData.sort((a: any, b: any) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      const typeMap: Record<string, string> = {
        registrations: 'Delegate',
        delegations: 'Delegation',
        chairboard_apps: 'Chairboard',
        admin_apps: 'Admin Staff',
        press_apps: 'Press Corps'
      };
      currentData = (data[activeTab] || []).map(item => ({
        ...item,
        app_type: typeMap[activeTab] || 'Applicant',
        _table: activeTab
      }));
    }

    currentData = currentData.map(item => {
      const stored = approvedMap[item.id];
      const effStatus = stored?.status || item.status || 'pending';
      return {
        ...item,
        status: effStatus,
        isApproved: effStatus === 'approved'
      };
    });

    if (statusFilter === 'approved') {
      currentData = currentData.filter(item => item.status === 'approved');
    } else if (statusFilter === 'waitlist') {
      currentData = currentData.filter(item => item.status === 'waitlist');
    } else if (statusFilter === 'rejected') {
      currentData = currentData.filter(item => item.status === 'rejected');
    } else if (statusFilter === 'pending') {
      currentData = currentData.filter(item => !item.status || item.status === 'pending');
    }

    if (!searchQuery.trim()) return currentData;

    const lowerQuery = searchQuery.toLowerCase().trim();
    return currentData.filter((item: any) => {
      const name = (item.full_name || '').toLowerCase();
      const school = (item.school || '').toLowerCase();
      const delegation = (item.delegation_name || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      return (
        name.includes(lowerQuery) ||
        school.includes(lowerQuery) ||
        delegation.includes(lowerQuery) ||
        email.includes(lowerQuery)
      );
    });
  }, [data, activeTab, statusFilter, searchQuery]);

  const allApplications = useMemo(() => {
    return [
      ...data.registrations,
      ...data.delegations,
      ...data.chairboard_apps,
      ...data.admin_apps,
      ...data.press_apps
    ];
  }, [data]);

  const statusStats = useMemo(() => {
    const approvedMap = getApprovedMap();
    let approved = 0;
    let waitlist = 0;
    let rejected = 0;
    let pending = 0;

    for (const item of allApplications) {
      const stored = approvedMap[item.id];
      const eff = stored?.status || item.status || 'pending';
      if (eff === 'approved') approved++;
      else if (eff === 'waitlist') waitlist++;
      else if (eff === 'rejected') rejected++;
      else pending++;
    }

    return { approved, waitlist, rejected, pending };
  }, [allApplications]);

  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const exportItems = filteredData.map(item => {
      const { _table, isApproved, ...rest } = item;
      return {
        ...rest,
        status: isApproved ? 'approved' : 'pending'
      };
    });

    const sanitizeForCSV = (val: any): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = Object.keys(exportItems[0]);
    const csvContent = [
      headers.join(','),
      ...exportItems.map(item =>
        headers.map(header => sanitizeForCSV((item as any)[header])).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `msemun_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Delegate':
        return 'bg-[#00b4d8]/20 text-[#00b4d8] border-[#00b4d8]/40';
      case 'Delegation':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Chairboard':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Admin Staff':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Press Corps':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const tabs = [
    { id: 'all' as TabType, label: 'Tüm Başvurular', icon: LayoutGrid },
    { id: 'registrations' as TabType, label: 'Delegeler', icon: Users },
    { id: 'delegations' as TabType, label: 'Delegasyonlar', icon: Briefcase },
    { id: 'chairboard_apps' as TabType, label: 'Chairboard', icon: Award },
    { id: 'admin_apps' as TabType, label: 'Admin Ekibi', icon: CheckCircle },
    { id: 'press_apps' as TabType, label: 'Basın / Press', icon: FileText }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 sm:pt-36 pb-16 flex items-center justify-center px-4 bg-[#060608] cinematic-grid">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0c0c14]/95 border border-amber-500/30 shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
              <Lock size={26} />
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">MSEMUN Sekretaryası</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Yetkili yönetim portalı. Başvuruları görüntülemek ve onay maillerini yönetmek için yönetici hesabınızla giriş yapınız.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Yönetici E-posta Adresi
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@msemun.org"
                autoFocus
                required
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium flex items-center justify-between">
                <span>Yönetici Şifresi</span>
                <span className="text-[10px] text-amber-400/80 font-mono">Supabase Auth</span>
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300 font-medium leading-relaxed">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary w-full text-sm !py-3 font-semibold cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {authLoading ? 'Doğrulanıyor...' : 'Yönetici Paneline Giriş Yap'}
            </button>

            {onNavigate && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  ← Web Sitesine Geri Dön
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-8 bg-[#060608] cinematic-grid">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Sekretarya Yönetim Paneli
              </span>
              <span className="text-xs text-slate-400 font-mono">MSEMUN '26</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              Gelen Başvurular & Onay Yönetimi
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Web Sitesine Dön</span>
              </button>
            )}

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-amber-400' : ''} />
              <span>Yenile</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-[#0c0c14]/90 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Toplam Başvuru</div>
              <div className="text-2xl font-bold text-white font-mono mt-0.5">{allApplications.length}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
              <FileText size={20} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c14]/90 border border-emerald-500/30 flex items-center justify-between shadow-lg shadow-emerald-500/5">
            <div>
              <div className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">Onaylananlar</div>
              <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">{statusStats.approved}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c14]/90 border border-purple-500/30 flex items-center justify-between shadow-lg shadow-purple-500/5">
            <div>
              <div className="text-[11px] font-mono uppercase text-purple-400 font-semibold">Waitlist (Yedek)</div>
              <div className="text-2xl font-bold text-purple-300 font-mono mt-0.5">{statusStats.waitlist}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Clock size={20} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c14]/90 border border-rose-500/30 flex items-center justify-between shadow-lg shadow-rose-500/5">
            <div>
              <div className="text-[11px] font-mono uppercase text-rose-400 font-semibold">Reddedilenler</div>
              <div className="text-2xl font-bold text-rose-300 font-mono mt-0.5">{statusStats.rejected}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <XCircle size={20} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c14]/90 border border-amber-500/30 flex items-center justify-between shadow-lg shadow-amber-500/5">
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold">Beklemede</div>
              <div className="text-2xl font-bold text-amber-300 font-mono mt-0.5">{statusStats.pending}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === 'all'
              ? allApplications.length
              : data[tab.id]?.length || 0;
            const isActive = activeTab === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#131320] border-amber-400/60 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-[#0c0c14]/80 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-amber-300' : 'text-slate-300'}`}>
                    {count}
                  </span>
                </div>
                <div className={`text-xs font-medium truncate ${isActive ? 'text-white font-semibold' : 'text-slate-400'}`}>
                  {tab.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0c0c14]/90 p-3.5 rounded-xl border border-white/10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="İsim, okul, e-posta veya delegasyon adı ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Beklemede ({statusStats.pending})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('approved')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Onaylananlar ({statusStats.approved})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('waitlist')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'waitlist'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Waitlist ({statusStats.waitlist})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('rejected')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'rejected'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reddedilenler ({statusStats.rejected})
              </button>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            disabled={filteredData.length === 0}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Download size={14} />
            <span>CSV Dışa Aktar ({filteredData.length})</span>
          </button>
        </div>

        <div className="rounded-xl bg-[#0c0c14]/90 border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead className="bg-black/60 border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3.5 font-semibold w-28">Kategori</th>
                  <th className="px-4 py-3.5 font-semibold w-52">Katılımcı / Delegasyon</th>
                  <th className="px-4 py-3.5 font-semibold w-40">Okul / Kurum</th>
                  <th className="px-4 py-3.5 font-semibold w-44">İletişim E-posta</th>
                  <th className="px-4 py-3.5 font-semibold text-center w-36">Onay Durumu</th>
                  <th className="px-4 py-3.5 font-semibold text-right w-32">Başvuru Tarihi</th>
                  <th className="px-4 py-3.5 font-semibold text-center w-36">Hızlı İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-400 font-mono">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-amber-400" />
                        <span>Supabase üzerinden başvurular yükleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                      {searchQuery
                        ? 'Arama kriterlerinize uyan başvuru bulunamadı.'
                        : 'Bu kategoride henüz başvuru bulunmamaktadır.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item: any) => {
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setActiveApp({ item, tab: 'details' })}
                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        {/* Kategori */}
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${getBadgeStyle(item.app_type)}`}>
                            {item.app_type}
                          </span>
                        </td>

                        {/* Katılımcı Adı */}
                        <td className="px-4 py-3 font-medium text-white group-hover:text-amber-300 transition-colors">
                          {item.delegation_name ? (
                            <div>
                              <div className="font-semibold text-white">{item.delegation_name}</div>
                              <div className="text-[11px] text-slate-400 font-normal">
                                {item.full_name} (Baş Delege)
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold">{item.full_name}</div>
                              {item.grade && (
                                <div className="text-[10px] text-slate-400 font-normal">{item.grade}</div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Okul */}
                        <td className="px-4 py-3 text-slate-300 truncate max-w-[180px]">
                          {item.school || '—'}
                        </td>

                        {/* E-posta */}
                        <td className="px-4 py-3 text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
                          {item.email}
                        </td>

                        {/* Durum Rozeti */}
                        <td className="px-4 py-3 text-center">
                          {item.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 size={11} />
                              <span>Onaylandı</span>
                            </span>
                          ) : item.status === 'waitlist' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              <Clock size={11} />
                              <span>Waitlist</span>
                            </span>
                          ) : item.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <XCircle size={11} />
                              <span>Reddedildi</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              <Clock size={11} />
                              <span>Beklemede</span>
                            </span>
                          )}
                        </td>

                        {/* Tarih */}
                        <td className="px-4 py-3 text-right font-mono text-slate-400 text-[11px]">
                          {formatDate(item.created_at)}
                        </td>

                        {/* İşlemler: Formu İncele & Onay Maili */}
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveApp({ item, tab: 'details' })}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer shadow-sm"
                              title="Adayın başvuru formunu ve tüm detaylarını oku"
                            >
                              <FileText size={12} className="text-amber-400" />
                              <span>Formu Oku</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveApp({
                                item,
                                tab: 'email',
                                decision: item.status === 'waitlist' ? 'waitlist' : item.status === 'rejected' ? 'rejection' : 'approval'
                              })}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                                item.status === 'approved'
                                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                                  : item.status === 'waitlist'
                                  ? 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30'
                                  : item.status === 'rejected'
                                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm'
                              }`}
                              title="E-posta hazırla ve gönder (Onay / Waitlist / Ret)"
                            >
                              <Mail size={12} className={item.status === 'approved' ? 'text-emerald-400' : item.status === 'waitlist' ? 'text-purple-400' : item.status === 'rejected' ? 'text-rose-400' : 'text-amber-400'} />
                              <span>Mail Gönder</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
          APPLICATION DETAIL & EMAIL APPROVAL UNIFIED MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {activeApp && (
        <ApplicationDetailModal
          item={activeApp.item}
          tableName={activeApp.item._table}
          initialTab={activeApp.tab}
          initialDecision={activeApp.decision}
          onClose={() => setActiveApp(null)}
          onSuccess={handleApprovalSuccess}
        />
      )}

    </div>
  );
};
