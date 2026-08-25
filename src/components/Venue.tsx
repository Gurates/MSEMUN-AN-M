import React from 'react';
import { VENUE_INFO, CONFERENCE_INFO } from '../data/conferenceData';
import { MapPin, Navigation, Building, Compass, Plane, Car, Hotel } from 'lucide-react';

export const Venue: React.FC = () => {
  return (
    <section id="venue" className="relative py-28 overflow-hidden" data-scroll-section="venue">
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/3 left-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Section Eyebrow */}
        <div className="flex items-center gap-3 mb-3" data-animate="venue-label">
          <span className="font-mono text-xs font-semibold text-amber-500 tracking-widest">05 // LOCATION</span>
          <span className="w-12 h-[1px] bg-amber-500/30" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-sans">The Grand Assembly</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6" data-animate="venue-header">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              THE IMPERIAL <span className="flame-gradient-text">CONGRESS PALACE</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-sans">
              Set along the historic Bosphorus coastline where two continents converge, offering delegates an unforgettable backdrop of diplomatic grandeur and acoustic majesty.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#11111a] border border-white/8 px-4 py-2.5 rounded-lg font-mono text-xs text-slate-300">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{CONFERENCE_INFO.coordinates}</span>
          </div>
        </div>

        {/* Hero Visual Card: Cinematic Photography & Highlight Overlay */}
        <div 
          className="relative rounded-2xl overflow-hidden border border-white/10 mb-16 shadow-2xl group"
          data-animate="venue-image"
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#0c0c14]">
            <img
              src="/venue.jpg"
              alt="The Imperial Congress Palace, Istanbul"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Cinematic Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/40 to-transparent" />
            
            {/* Floating Venue Tag on Image */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="bg-black/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/10 max-w-xl">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>DOLMABAHÇE AVENUE, BEŞİKTAŞ, ISTANBUL</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Historic Waterfront Plenary & Chambers
                </h3>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-3 px-5 self-start sm:self-auto bg-black/70 backdrop-blur-md border-white/20 hover:border-amber-400"
                style={{ textDecoration: 'none' }}
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>OPEN IN MAPS</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Architectural Venue Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VENUE_INFO.highlights.map((item, idx) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-[#0c0c14] border border-white/6 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-[11px] text-amber-500 mb-2">FACILITY 0{idx + 1}</div>
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <Building className="w-3 h-3 text-slate-400" />
                <span>PALACE WING</span>
              </div>
            </div>
          ))}
        </div>

        {/* Travel & Accommodation Brief */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl bg-[#0f0f18] border border-white/8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif text-base font-bold text-white mb-1">Airport Transit</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Direct Havaist shuttles from Istanbul Airport (IST) and Sabiha Gökçen (SAW) directly to Beşiktaş central hub.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif text-base font-bold text-white mb-1">Diplomatic Hotel Deals</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Partner rates at five-star Bosphorus hotels within 5 minutes walking distance from the plenary grounds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif text-base font-bold text-white mb-1">VIP & Delegation Transfers</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Complimentary private coach transportation for accredited international school delegations throughout the 3 days.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
