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
  X, 
  LayoutGrid, 
  Lock, 
  RefreshCw, 
  LogOut,
  Mail,
  Phone,
  Building,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { PageView } from './Navbar';

type TabType = 'all' | 'registrations' | 'delegations' | 'chairboard_apps' | 'admin_apps' | 'press_apps';

interface AdminDashboardProps {
  onNavigate?: (page: PageView) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('msemun_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Data States for all 5 tables
  const [data, setData] = useState<Record<string, any[]>>({
    registrations: [],
    delegations: [],
    chairboard_apps: [],
    admin_apps: [],
    press_apps: []
  });

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!correctPassword) {
      setAuthError('Admin password is not set. Please add VITE_ADMIN_PASSWORD to your .env file.');
      return;
    }

    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('msemun_admin_session', 'true');
      } catch (err) {
        console.warn(err);
      }
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('msemun_admin_session');
    } catch (err) {
      console.warn(err);
    }
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
          const sorted = (tableData || []).sort((a: any, b: any) => {
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

  // Filtered data for active tab
  const filteredData = useMemo(() => {
    let currentData: any[] = [];
    if (activeTab === 'all') {
      currentData = [
        ...data.registrations.map(item => ({ ...item, app_type: 'Delegate' })),
        ...data.delegations.map(item => ({ ...item, app_type: 'Delegation' })),
        ...data.chairboard_apps.map(item => ({ ...item, app_type: 'Chairboard' })),
        ...data.admin_apps.map(item => ({ ...item, app_type: 'Admin Staff' })),
        ...data.press_apps.map(item => ({ ...item, app_type: 'Press Corps' }))
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
        app_type: typeMap[activeTab] || 'Applicant'
      }));
    }

    if (!searchQuery.trim()) return currentData;

    const lowerQuery = searchQuery.toLowerCase().trim();
    return currentData.filter((item: any) => {
      const name = (item.full_name || '').toLowerCase();
      const school = (item.school || '').toLowerCase();
      const delegation = (item.delegation_name || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      return name.includes(lowerQuery) || school.includes(lowerQuery) || delegation.includes(lowerQuery) || email.includes(lowerQuery);
    });
  }, [data, activeTab, searchQuery]);

  // CSV Export
  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item =>
        headers.map(header => {
          let val = item[header];
          if (val === null || val === undefined) val = '';
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Delegate': return 'bg-[#00b4d8]/20 text-[#00b4d8] border-[#00b4d8]/40';
      case 'Delegation': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Chairboard': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Admin Staff': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Press Corps': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const tabs = [
    { id: 'all' as TabType, label: 'All Applications', icon: LayoutGrid },
    { id: 'registrations' as TabType, label: 'Delegates', icon: Users },
    { id: 'delegations' as TabType, label: 'Delegations', icon: Briefcase },
    { id: 'chairboard_apps' as TabType, label: 'Chairboard', icon: Award },
    { id: 'admin_apps' as TabType, label: 'Admin Staff', icon: CheckCircle },
    { id: 'press_apps' as TabType, label: 'Press Corps', icon: FileText }
  ];

  // ═══ AUTH LOGIN SCREEN ═══
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 sm:pt-36 pb-16 flex items-center justify-center px-4 bg-[#060608] cinematic-grid">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0c0c14]/95 border border-white/12 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">MSEMUN Secretariat</h1>
            <p className="text-xs text-slate-400 mt-1">Enter your admin passcode to access registration applications.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">Passcode</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin passcode"
                autoFocus
                className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full text-sm !py-3 font-semibold cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═══ MAIN DASHBOARD VIEW ═══
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-8 bg-[#060608] cinematic-grid">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Secretariat Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">MSEMUN '26</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">Applications Management</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Return to Website</span>
              </button>
            )}

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-amber-400' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === 'all'
              ? Object.values(data).reduce((acc, curr) => acc + curr.length, 0)
              : data[tab.id]?.length || 0;
            const isActive = activeTab === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isActive 
                    ? 'bg-[#131320] border-amber-400/60 shadow-lg shadow-amber-500/10 scale-[1.02]' 
                    : 'bg-[#0c0c14]/80 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                  <span className={`text-sm font-mono font-bold ${isActive ? 'text-amber-300' : 'text-slate-300'}`}>
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

        {/* Actions Bar (Search + Export) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0c0c14]/90 p-3.5 rounded-xl border border-white/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, school, delegation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={exportToCSV}
            disabled={filteredData.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            <span>Export to CSV ({filteredData.length})</span>
          </button>
        </div>

        {/* Applications Table */}
        <div className="rounded-xl bg-[#0c0c14]/90 border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[760px]">
              <thead className="bg-black/60 border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3.5 font-semibold w-28">Role</th>
                  <th className="px-4 py-3.5 font-semibold w-48">Applicant Name</th>
                  <th className="px-4 py-3.5 font-semibold w-44">School</th>
                  <th className="px-4 py-3.5 font-semibold w-48">Contact Email</th>
                  <th className="px-4 py-3.5 font-semibold w-36">Phone</th>
                  <th className="px-4 py-3.5 font-semibold text-right w-36">Submission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-slate-400 font-mono">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-amber-400" />
                        <span>Loading applications from Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-slate-400">
                      {searchQuery ? 'No applications match your search query.' : 'No applications received in this category yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item: any) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${getBadgeStyle(item.app_type)}`}>
                          {item.app_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-white group-hover:text-amber-300 transition-colors">
                        {item.delegation_name ? (
                          <div>
                            <div className="font-semibold">{item.delegation_name}</div>
                            <div className="text-[11px] text-slate-400 font-normal">{item.full_name} (Head Delegate)</div>
                          </div>
                        ) : (
                          item.full_name
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300 truncate max-w-[180px]">{item.school}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono text-[11px] truncate max-w-[200px]">{item.email}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono text-[11px]">{item.phone || '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400 text-[11px]">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ═══ APPLICATION DETAIL MODAL (FIXED HEADER & RESPONSIVE TEXT BREAKING) ═══ */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0c0c14] border border-white/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Fixed Modal Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-white/10 bg-[#0f0f1c] shrink-0">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border mb-2 ${getBadgeStyle(selectedItem.app_type)}`}>
                  {selectedItem.app_type}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif break-words">
                  {selectedItem.delegation_name || selectedItem.full_name}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Submitted on {formatDate(selectedItem.created_at)}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 ml-4"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Modal Body with Guaranteed Text Wrapping */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 text-xs text-slate-300">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail size={16} className="text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-mono text-slate-500">Email</div>
                    <a href={`mailto:${selectedItem.email}`} className="text-slate-200 hover:text-amber-400 hover:underline break-all block">
                      {selectedItem.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <Phone size={16} className="text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-mono text-slate-500">Phone</div>
                    <a href={`tel:${selectedItem.phone}`} className="text-slate-200 hover:text-amber-400 hover:underline block">
                      {selectedItem.phone || '—'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <Building size={16} className="text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-mono text-slate-500">School / Institution</div>
                    <div className="text-white font-medium break-words">{selectedItem.school}</div>
                  </div>
                </div>

                {selectedItem.grade && (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GraduationCap size={16} className="text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-500">Grade</div>
                      <div className="text-white font-medium">{selectedItem.grade}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Committee Preferences */}
              {(selectedItem.committee_preference_1 || selectedItem.pref1) && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                  <h3 className="text-xs uppercase font-mono font-bold text-amber-400">Committee Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 font-mono block mb-0.5">1st Choice</span>
                      <span className="font-semibold text-white uppercase break-words">{selectedItem.committee_preference_1 || selectedItem.pref1}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 font-mono block mb-0.5">2nd Choice</span>
                      <span className="font-semibold text-white uppercase break-words">{selectedItem.committee_preference_2 || selectedItem.pref2 || '—'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 font-mono block mb-0.5">3rd Choice</span>
                      <span className="font-semibold text-white uppercase break-words">{selectedItem.committee_preference_3 || selectedItem.pref3 || '—'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Dynamic Answers with Overflow Fix */}
              {Object.entries(selectedItem).map(([key, value]) => {
                if ([
                  'id', 'created_at', 'full_name', 'email', 'phone', 'school', 'grade', 
                  'app_type', 'committee_preference_1', 'committee_preference_2', 
                  'committee_preference_3', 'pref1', 'pref2', 'pref3'
                ].includes(key)) return null;

                if (!value || value === '') return null;

                const customTitles: Record<string, string> = {
                  exp_list: 'MUN Experience',
                  org_exp_list: 'Organization / Publication Experience',
                  motivation_letter: 'Motivation Letter',
                  q_ai_suspicion: 'Q: Delegate AI Suspicion Handling',
                  q_final_documents: 'Q: Final Documents Details',
                  q_directive_help: 'Q: Directive Writing Assistance (Crisis)',
                  q_resolution_paper: 'Q: Resolution Paper Time Management (GA)',
                  q_disagreement: 'Q: Chairboard Procedural Disagreement',
                  crisis_directive: 'Sample Crisis Directive',
                  ga_procedure: 'GA Procedure Walkthrough',
                  camera_model: 'Camera Equipment / Model',
                  expected_members: 'Expected Member Count',
                  all_emails: 'All Delegation Member Emails',
                  all_phones: 'All Delegation Member Phone Numbers',
                  references: 'References',
                  references_text: 'References',
                  message: 'Additional Message',
                  status: 'Application Status'
                };

                const title = customTitles[key] || key.replace(/_/g, ' ').toUpperCase();

                return (
                  <div key={key} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5 overflow-hidden">
                    <h4 className="text-[11px] font-mono uppercase font-bold text-amber-400">{title}</h4>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed break-words break-all [overflow-wrap:anywhere] max-w-full">
                      {String(value)}
                    </p>
                  </div>
                );
              })}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0f0f1c] flex items-center justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
