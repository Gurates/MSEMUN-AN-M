import React, { useState } from 'react';
import { Navbar, PageView } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CommitteesPage } from './components/CommitteesPage';
import { ApplyPage } from './components/ApplyPage';
import { VideoIntro } from './components/VideoIntro';

export const App: React.FC = () => {
  // Check if intro was already played in this browser session
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('msemun_intro_played') !== 'true';
    } catch {
      return true;
    }
  });
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCommitteeForApply, setSelectedCommitteeForApply] = useState<string>('unsc');

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommitteeForApply = (committeeId: string) => {
    setSelectedCommitteeForApply(committeeId);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#f8fafc] flex flex-col">
      {/* Cinematic Fullscreen Video Intro */}
      {showIntro && (
        <VideoIntro onComplete={handleIntroComplete} />
      )}

      {/* Main Website Container with smooth fade-in after intro finishes */}
      <div 
        className={`flex flex-col flex-grow transition-opacity duration-1000 ${
          showIntro ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Navigation Header */}
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

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
        </main>
      </div>
    </div>
  );
};

export default App;
