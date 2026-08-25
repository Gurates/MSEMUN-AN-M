import React, { useState, useEffect } from 'react';
import { Navbar, PageView } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CommitteesPage } from './components/CommitteesPage';
import { ApplyPage } from './components/ApplyPage';
import { AdminDashboard } from './components/AdminDashboard';
import { VideoIntro } from './components/VideoIntro';

export const App: React.FC = () => {
  // Determine initial page from URL path or hash (e.g. /admin or #admin)
  const getInitialPage = (): PageView => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin')) {
      return 'admin';
    }
    if (path.includes('/committees') || hash.includes('committees')) {
      return 'committees';
    }
    if (path.includes('/apply') || hash.includes('apply')) {
      return 'apply';
    }
    return 'home';
  };

  const initialPage = getInitialPage();

  // Check if intro was already played in this browser session (skip for direct /admin access)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (initialPage === 'admin') return false;
    try {
      return sessionStorage.getItem('msemun_intro_played') !== 'true';
    } catch {
      return true;
    }
  });

  const [currentPage, setCurrentPage] = useState<PageView>(initialPage);
  const [selectedCommitteeForApply, setSelectedCommitteeForApply] = useState<string>('unsc');

  // Handle URL history and browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('msemun_intro_played', 'true');
    } catch (e) {
      console.warn('sessionStorage error:', e);
    }
    setShowIntro(false);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  };

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommitteeForApply = (committeeId: string) => {
    setSelectedCommitteeForApply(committeeId);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#f8fafc] flex flex-col">
      {/* Cinematic Fullscreen Video Intro (skipped if /admin or already played) */}
      {showIntro && (
        <VideoIntro onComplete={handleIntroComplete} />
      )}

      {/* Main Website Container */}
      <div 
        className={`flex flex-col flex-grow transition-opacity duration-1000 ${
          showIntro ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Navigation Header (hidden on admin portal for full dashboard width) */}
        {currentPage !== 'admin' && (
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        )}

        {/* Main View Router */}
        <main className="flex-grow">
          {currentPage === 'home' && (
            <HomePage onNavigate={handleNavigate} />
          )}

          {currentPage === 'committees' && (
            <CommitteesPage
              onNavigate={handleNavigate}
              onSelectCommitteeForApply={handleSelectCommitteeForApply}
            />
          )}

          {currentPage === 'apply' && (
            <ApplyPage
              initialCommitteeId={selectedCommitteeForApply}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'admin' && (
            <AdminDashboard onNavigate={handleNavigate} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
