import React from 'react';
import { FlameLogo } from './FlameLogo';
import { CONFERENCE_INFO } from '../data/conferenceData';
import { PageView } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-[#050507] border-t border-white/8 pt-16 pb-12 overflow-hidden">
      {/* Glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(255, 90, 0, 0.05) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }}
      />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/8 items-center">
          
          {/* Logo & Motto */}
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-3.5 mb-3">
              <FlameLogo size="sm" showText={false} glow={true} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl font-bold tracking-widest text-white">
                    MSEMUN
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/25">
                    2026
                  </span>
                </div>
                <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase font-sans">
                  Model United Nations
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-sans max-w-md">
              "In the crucible of debate, the sovereign flame of peace is forged."
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-6 flex flex-wrap items-center md:justify-end gap-6 text-xs font-mono">
            <button
              onClick={() => onNavigate('home')}
              className="text-slate-400 hover:text-amber-400 transition-colors"
              style={{ background: 'none', border: 'none', outline: 'none' }}
            >
              HOME
            </button>
            <button
              onClick={() => onNavigate('committees')}
              className="text-slate-400 hover:text-amber-400 transition-colors"
              style={{ background: 'none', border: 'none', outline: 'none' }}
            >
              COMMITTEES
            </button>
            <button
              onClick={() => onNavigate('apply')}
              className="text-amber-400 hover:text-white transition-colors font-bold"
              style={{ background: 'none', border: 'none', outline: 'none' }}
            >
              APPLY
            </button>
          </div>

        </div>

        {/* Bottom Imprint */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} MSEMUN Model United Nations Conference. {CONFERENCE_INFO.dates} • Istanbul.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Secretariat:</span>
            <a href="mailto:secretariat@msemun.org" className="text-amber-400 hover:underline">
              secretariat@msemun.org
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
