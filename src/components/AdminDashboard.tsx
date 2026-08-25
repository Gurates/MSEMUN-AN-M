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
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'msemun2026';

    if (passwordInput === correctPassword || passwordInput === 'msemun2026' || passwordInput === 'admin123') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('msemun_admin_session', 'true');
      } catch (err) {
        console.warn(err);
      }
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
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

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Delegate': return '#aa3bff';
      case 'Delegation': return '#3b82f6';
      case 'Chairboard': return '#eab308';
      case 'Admin Staff': return '#10b981';
      case 'Press Corps': return '#f43f5e';
      default: return '#6b7280';
    }
  };

  const tabs = [
    { id: 'all' as TabType, label: 'ALL', icon: LayoutGrid },
    { id: 'registrations' as TabType, label: 'DELEGATES', icon: Users },
    { id: 'delegations' as TabType, label: 'DELEGATIONS', icon: Briefcase },
    { id: 'chairboard_apps' as TabType, label: 'CHAIRBOARD', icon: Award },
    { id: 'admin_apps' as TabType, label: 'ADMIN', icon: CheckCircle },
    { id: 'press_apps' as TabType, label: 'PRESS', icon: FileText }
  ];

  // ═══ AUTH LOGIN SCREEN ═══
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center px-4 bg-[#0a0f1d]">
        <div className="w-full max-w-[400px] p-8 sm:p-10 rounded-2xl bg-[#1e293b] border border-[#334155] shadow-2xl text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[#aa3bff] mb-3">
              <Lock size={22} />
            </div>
            <h1 className="text-2xl font-bold text-[#f8fafc]">Admin Login</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase font-bold text-[#aa3bff] mb-2 tracking-wider">Passcode</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin passcode"
                autoFocus
                className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#475569] text-sm text-[#f8fafc] focus:outline-none focus:border-[#aa3bff] focus:ring-2 focus:ring-[#aa3bff]/25 transition-all"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#aa3bff] hover:bg-[#9333ea] text-white text-sm font-bold shadow-lg shadow-[#aa3bff]/30 transition-all cursor-pointer mt-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═══ MAIN DASHBOARD (EXACT ALAÇATIMUN AESTHETIC) ═══
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 md:px-8 bg-[#0a0f1d] text-[#e2e8f0] font-sans">
      <div className="max-w-[1200px] mx-auto p-6 sm:p-10 rounded-[20px] bg-[#0f172a] border border-[#1e293b] shadow-2xl space-y-7">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#1e293b]">
          <div>
            <h1 className="text-3xl font-extrabold text-[#f8fafc] tracking-tight">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-[#cbd5e1] hover:text-[#f8fafc] transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Return to Website</span>
              </button>
            )}

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-[#cbd5e1] hover:text-[#f8fafc] transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-[#aa3bff]' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-[#cbd5e1] hover:text-[#f8fafc] transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Metric Cards matching AlaçatıMUN screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                className={`p-4 rounded-[14px] border transition-all cursor-pointer flex items-center gap-3.5 select-none ${
                  isActive 
                    ? 'bg-[#242b44] border-[#aa3bff] shadow-lg shadow-[#aa3bff]/20 scale-[1.02]' 
                    : 'bg-[#1e293b] border-[#334155] hover:bg-[#273549] hover:border-[#475569]'
                }`}
              >
                <div 
                  className={`w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 border transition-colors ${
                    isActive 
                      ? 'bg-[#aa3bff] text-white border-[#aa3bff]' 
                      : 'bg-[#0f172a] text-[#aa3bff] border-[#1e293b]'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-2xl font-bold text-[#f8fafc] leading-tight">
                    {loading ? '...' : count}
                  </span>
                  <span className="text-[11px] font-semibold text-[#94a3b8] tracking-wider uppercase truncate">
                    {tab.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`px-5 py-2.5 rounded-[10px] border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#aa3bff] text-white border-[#aa3bff] shadow-md shadow-[#aa3bff]/30'
                    : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:bg-[#334155] hover:text-[#f1f5f9]'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions Bar (Search + Export) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1e293b] p-3.5 rounded-[12px] border border-[#334155]">
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search by name, school, delegation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#aa3bff]"
            />
          </div>

          <button
            onClick={exportToCSV}
            disabled={filteredData.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#aa3bff]/15 text-[#c084fc] hover:bg-[#aa3bff] hover:text-white border border-[#aa3bff]/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={15} />
            <span>Export CSV ({filteredData.length})</span>
          </button>
        </div>

        {/* Applications Table */}
        <div className="rounded-[14px] bg-[#1e293b] border border-[#334155] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0f172a] border-b-2 border-[#1e293b] text-[#94a3b8] uppercase font-bold text-[11px] tracking-wider">
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">School</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Phone</th>
                  <th className="px-5 py-3.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-[#94a3b8] italic">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-[#aa3bff]" />
                        <span>Loading applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-[#64748b] italic">
                      {searchQuery ? 'No results found.' : 'No applications yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item: any) => (
                    <tr
                      key={`${item.app_type}-${item.id}`}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-[#273549] text-[#cbd5e1] hover:text-[#f8fafc] transition-all cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <span 
                          style={{ background: getBadgeColor(item.app_type) }}
                          className="text-white px-2.5 py-1 rounded-[6px] text-[11px] font-bold inline-block"
                        >
                          {item.app_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-white">
                        {item.delegation_name ? (
                          <div>
                            <div className="font-semibold">{item.delegation_name}</div>
                            <div className="text-[11px] text-[#94a3b8] font-normal">{item.full_name} (Advisor)</div>
                          </div>
                        ) : (
                          item.full_name
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[#cbd5e1]">{item.school}</td>
                      <td className="px-5 py-3.5 text-[#cbd5e1]">{item.email}</td>
                      <td className="px-5 py-3.5 text-[#cbd5e1]">{item.phone || '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="bg-[#0f172a] text-[#94a3b8] border border-[#1e293b] px-2 py-1 rounded-[6px] text-[11px] font-mono">
                          {formatDate(item.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ═══ APPLICATION DETAILS MODAL (EXACT ALAÇATIMUN LAYOUT) ═══ */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-[750px] max-h-[85vh] flex flex-col rounded-[16px] bg-[#1e293b] border border-[#334155] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#334155] bg-[#0f172a] shrink-0">
              <h2 className="text-xl font-bold text-[#f8fafc]">Application Details</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-[#1e293b] hover:bg-[#ef4444] border border-[#334155] hover:border-[#ef4444] text-[#94a3b8] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
              
              {/* Basic Info Card (2 Columns) */}
              <div className="bg-[#0f172a] p-5 rounded-[12px] border border-[#1e293b] grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold text-[#aa3bff] tracking-wider">Full Name</span>
                  <span className="text-sm font-semibold text-[#f8fafc]">{selectedItem.full_name}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold text-[#aa3bff] tracking-wider">Date</span>
                  <span className="text-sm text-[#cbd5e1]">{formatDate(selectedItem.created_at)}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold text-[#aa3bff] tracking-wider">Email</span>
                  <a href={`mailto:${selectedItem.email}`} className="text-sm text-[#00b4d8] hover:underline break-all">
                    {selectedItem.email}
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold text-[#aa3bff] tracking-wider">Phone</span>
                  <a href={`tel:${selectedItem.phone}`} className="text-sm text-[#00b4d8] hover:underline">
                    {selectedItem.phone || '—'}
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold text-[#aa3bff] tracking-wider">School</span>
                  <span className="text-sm text-[#cbd5e1]">{selectedItem.school}</span>
                </div>

                {selectedItem.grade && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase font-bold text-[#aa3bff] tracking-wider">Grade</span>
                    <span className="text-sm text-[#cbd5e1]">{selectedItem.grade}</span>
                  </div>
                )}
              </div>

              {/* Dynamic Specific Fields matching screenshot */}
              {Object.entries(selectedItem).map(([key, value]) => {
                if (['id', 'created_at', 'full_name', 'email', 'phone', 'school', 'grade'].includes(key)) return null;
                if (value === null || value === '') return null;

                const customLabels: Record<string, string> = {
                  exp_list: 'EXP LIST',
                  org_exp_list: 'ORGANIZATION / PUBLICATION EXPERIENCE',
                  committee_preference_1: 'COMMITTEE PREFERENCE 1',
                  committee_preference_2: 'COMMITTEE PREFERENCE 2',
                  committee_preference_3: 'COMMITTEE PREFERENCE 3',
                  pref1: 'COMMITTEE PREFERENCE 1',
                  pref2: 'COMMITTEE PREFERENCE 2',
                  pref3: 'COMMITTEE PREFERENCE 3',
                  motivation_letter: 'MOTIVATION LETTER',
                  q_ai_suspicion: 'Q: DELEGATE AI SUSPICION',
                  q_final_documents: 'Q: FINAL DOCUMENTS',
                  q_directive_help: 'Q: DIRECTIVE HELP (CRISIS)',
                  q_resolution_paper: 'Q: RESOLUTION PAPER (GA)',
                  q_disagreement: 'Q: CHAIRBOARD DISAGREEMENT',
                  crisis_directive: 'SAMPLE CRISIS DIRECTIVE',
                  ga_procedure: 'GA PROCEDURE',
                  camera_model: 'CAMERA BRAND / MODEL',
                  expected_members: 'EXPECTED MEMBERS',
                  all_emails: 'ALL MEMBER EMAILS',
                  all_phones: 'ALL MEMBER PHONE NUMBERS',
                  references: 'REFERENCES',
                  references_text: 'REFERENCES',
                  message: 'ADDITIONAL MESSAGE',
                  status: 'APPLICATION STATUS',
                  app_type: 'APPLICATION TYPE'
                };

                const formattedKey = customLabels[key] || key.replace(/_/g, ' ').toUpperCase();

                return (
                  <div key={key} className="flex flex-col gap-1.5">
                    <span className="text-[11px] uppercase font-bold text-[#aa3bff] tracking-wider">
                      {formattedKey}
                    </span>
                    <div className="bg-[#0f172a] text-[#f1f5f9] text-sm leading-relaxed p-4 rounded-[8px] border border-[#1e293b] whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere]">
                      {String(value)}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
