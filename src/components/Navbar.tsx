import React, { useState, useEffect } from 'react';
import { FlameLogo } from './FlameLogo';
import { Menu, X, ArrowRight } from 'lucide-react';

export type PageView = 'home' | 'committees' | 'apply';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Committees', page: 'committees' },
    { label: 'Apply', page: 'apply' }
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#060608]/92 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/80'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logo & Title */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0 group text-left"
              style={{ background: 'none', border: 'none', outline: 'none' }}
            >
              <FlameLogo size="sm" showText={false} glow={true} />
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  MSEMUN
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  '26
                </span>
              </div>
            </button>

            {/* Center / Right: Desktop Nav Links with Generous Margins & Gap */}
            <nav className="hidden md:flex items-center gap-8">
              <div className="nav-links-container" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {navLinks.map((link) => {
                  const isActive = currentPage === link.page;
                  return (
                    <button
                      key={link.page}
                      onClick={() => handleNavClick(link.page)}
                      className={`nav-link-btn ${isActive ? 'active' : ''}`}
                      style={{
                        position: 'relative',
                        padding: '6px 8px',
                        margin: '0 8px',
                        color: isActive ? '#ffffff' : '#94a3b8',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{link.label}</span>
                      {/* Underline indicator */}
                      <span
                        className="nav-link-indicator"
                        style={{
                          width: isActive ? '100%' : '0%'
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right CTA button */}
              {currentPage !== 'apply' ? (
                <button
                  onClick={() => handleNavClick('apply')}
                  className="btn-primary text-xs !py-2.5 !px-5 !rounded-lg"
                  style={{ marginLeft: '1rem' }}
                >
                  <span>APPLY NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('committees')}
                  className="btn-secondary text-xs !py-2.5 !px-5 !rounded-lg"
                  style={{ marginLeft: '1rem' }}
                >
                  <span>VIEW COMMITTEES</span>
                </button>
              )}
            </nav>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors"
              aria-label="Menu"
              style={{ outline: 'none' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#060608]/98 backdrop-blur-2xl flex flex-col justify-center items-center px-8 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8 w-full max-w-xs text-center">
          <FlameLogo size="md" showText={false} glow={true} className="mb-2" />
          
          <div className="flex flex-col gap-6 w-full">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`text-2xl font-serif font-bold transition-all py-2 border-b border-white/5 ${
                    isActive ? 'text-amber-400' : 'text-slate-300 hover:text-white'
                  }`}
                  style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none' }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleNavClick('apply')}
            className="btn-primary w-full text-center text-sm py-3.5 mt-4"
          >
            APPLY AS DELEGATE
          </button>
        </div>
      </div>
    </>
  );
};
