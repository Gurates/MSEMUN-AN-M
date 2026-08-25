import { Speaker, Committee, DaySchedule, StatItem } from '../types';

export const CONFERENCE_INFO = {
  name: 'MSEMUN',
  edition: 'XXVI EDITION',
  year: '2026',
  tagline: 'IGNITING GLOBAL DIPLOMACY',
  subheading: 'Where diplomatic intellect meets the crucible of international crisis. 500+ delegates unite to forge tomorrow’s sovereign resolutions.',
  dates: 'OCTOBER 24 – 26, 2026',
  location: 'THE IMPERIAL CONGRESS PALACE, ISTANBUL',
  coordinates: '41.0082° N, 28.9784° E',
  registrationDeadline: '2026-10-10T23:59:59',
  stats: [
    { label: 'GLOBAL DELEGATES', value: '550+', description: 'Representing prestigious institutions worldwide', iconName: 'Users' },
    { label: 'SPECIALIZED CHAMBERS', value: '12', description: 'From General Assembly to high-intensity Crisis', iconName: 'Shield' },
    { label: 'SOVEREIGN NATIONS', value: '48', description: 'Nations actively simulated and represented', iconName: 'Globe' },
    { label: 'DAYS OF RESOLUTION', value: '03', description: 'Continuous debate, caucuses, and directive drafting', iconName: 'Flame' }
  ] as StatItem[]
};

export const SPEAKERS_DATA: Speaker[] = [
  {
    id: 'sp-1',
    name: 'Amb. Elena Rostova',
    role: 'Former UN Under-Secretary-General',
    organization: 'Global Security & Disarmament Initiative',
    topic: 'The Architecture of Modern Deterrence: Preserving Peace in Multipolar Shocks',
    bio: 'Over three decades navigating high-stakes multilateral diplomacy in Geneva and New York. Authored key peacekeeping frameworks.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    chamber: 'Opening Keynote Plenary'
  },
  {
    id: 'sp-2',
    name: 'Dr. Tariq Al-Mansoor',
    role: 'Director of Strategic Geopolitics',
    organization: 'Mediterranean Institute of International Affairs',
    topic: 'Sovereign Resources & The Spark of Conflict: Maritime Law in the 21st Century',
    bio: 'Specialist in maritime boundaries, energy corridors, and diplomatic mediation in disputed waters.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    chamber: 'Security Council Keynote'
  },
  {
    id: 'sp-3',
    name: 'Claire Beauchamp, J.D.',
    role: 'Lead Counsel for International Human Rights',
    organization: 'Hague Institute for Global Justice',
    topic: 'Humanitarian Sovereignty: Defending Civilian Corridors Amid Asymmetric Crises',
    bio: 'International jurist litigating fundamental human rights and refugee status treaties across global tribunals.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    chamber: 'UNHRC Special Address'
  },
  {
    id: 'sp-4',
    name: 'Marcus Vance',
    role: 'Senior Fellow & Crisis Simulation Director',
    organization: 'Oxford Diplomatic Policy Forum',
    topic: 'Real-Time Crisis Management: De-escalation Under Fog of War Directives',
    bio: 'Pioneer of high-tempo strategic simulations, advising international foreign ministries on rapid consensus mechanics.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    chamber: 'Crisis Directorate Keynote'
  }
];

export const COMMITTEES_DATA: Committee[] = [
  {
    id: 'unsc',
    acronym: 'UNSC',
    name: 'United Nations Security Council',
    shortTitle: 'Arctic Sovereignty',
    agenda: 'Strategic Escalation in the Arctic Basin & Maritime Sovereignty Charters',
    description: 'A 15-seat high-pressure summit managing critical flashpoints, sovereign resource claims, and mandatory Chapter VII resolutions.',
    level: 'Expert',
    seats: 15,
    president: 'Secretariat Directorate',
    accentColor: '#ff5722',
    flameFocus: 'High Intensity Crisis',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(155deg, #2a140e 0%, #150a06 100%)'
  },
  {
    id: 'jcc',
    acronym: 'JCC',
    name: 'Joint Crisis Committee: 1983 Able Archer',
    shortTitle: 'Nuclear Brinkmanship',
    agenda: 'Flashpoint Brinkmanship: Strategic Nuclear Escalation & Covert Operations',
    description: 'Dual-cabinet real-time simulation with instant directive feedback, midnight crisis updates, and covert strategic warfare.',
    level: 'Specialized Crisis',
    seats: 24,
    president: 'Crisis Cabinet Chairs',
    accentColor: '#f59e0b',
    flameFocus: 'Dual-Room Dynamic',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(155deg, #2d1c08 0%, #140d04 100%)'
  },
  {
    id: 'unhrc',
    acronym: 'UNHRC',
    name: 'United Nations Human Rights Council',
    shortTitle: 'Humanitarian Dignity',
    agenda: 'Protecting Indigenous & Displaced Populations Amid Critical Climate Scarcity',
    description: 'Crafting binding global conventions to establish protected environmental asylum corridors and sovereign legal aid.',
    level: 'Intermediate',
    seats: 45,
    president: 'Human Rights Bureau',
    accentColor: '#3b82f6',
    flameFocus: 'Policy & Convention',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(155deg, #0e1e30 0%, #07101c 100%)'
  },
  {
    id: 'disec',
    acronym: 'DISEC',
    name: 'Disarmament & International Security (GA 1)',
    shortTitle: 'Orbital Defense',
    agenda: 'Normative Governance on Autonomous Lethal Systems & Orbital Deterrence',
    description: 'The General Assembly’s paramount security committee establishing modern disarmament treaties for next-generation defense tech.',
    level: 'Advanced',
    seats: 60,
    president: 'General Assembly Board',
    accentColor: '#ff9800',
    flameFocus: 'Global Consensus',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(155deg, #291708 0%, #150c04 100%)'
  },
  {
    id: 'unep',
    acronym: 'UNEP',
    name: 'UN Environment Programme',
    shortTitle: 'Mineral Geopolitics',
    agenda: 'Geopolitics of Critical Minerals: Global Supply Chain Decarbonization',
    description: 'Balancing sovereign extraction rights against global planetary limits and clean technology trade treaties.',
    level: 'Beginner',
    seats: 40,
    president: 'Environmental Council',
    accentColor: '#10b981',
    flameFocus: 'Economic Diplomacy',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(155deg, #0d281e 0%, #061711 100%)'
  },
  {
    id: 'specpol',
    acronym: 'SPECPOL',
    name: 'Special Political & Decolonization (GA 4)',
    shortTitle: 'Maritime Neutrality',
    agenda: 'Demilitarization of Neutral Maritime Zones & Contested Border Sovereignty',
    description: 'Resolving multi-decade territorial standoffs through diplomatic mediation, peacekeeping missions, and boundary arbitration.',
    level: 'Advanced',
    seats: 50,
    president: 'Fourth Committee Bureau',
    accentColor: '#ec4899',
    flameFocus: 'Territorial Charters',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(155deg, #2d1020 0%, #170710 100%)'
  }
];

export const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 1,
    title: 'DAY 01',
    theme: 'THE SPARK',
    date: 'Friday, October 24, 2026',
    sessions: [
      { time: '08:30 – 10:00', title: 'Delegate Registration & Badge Accreditation', location: 'Grand Atrium Hall', type: 'break', description: 'Arrival of international delegations, verification of credentials, delegate packet collection.' },
      { time: '10:00 – 11:45', title: 'Solemn Opening Ceremony & Torch Lighting', location: 'Plenary Grand Amphitheater', type: 'plenary', description: 'Opening address by Secretary-General, keynote speeches by guest diplomats, inaugural ceremony.' },
      { time: '12:00 – 13:30', title: 'Diplomatic Luncheon & Networking', location: 'Bosphorus Terrace', type: 'break', description: 'Informal delegate reception, bloc consultations, and faculty advisor briefing.' },
      { time: '13:30 – 16:00', title: 'Committee Session I: Roll Call & Agenda Setting', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Formal establishment of quorum, introductory speeches, opening of the speakers list.' },
      { time: '16:15 – 18:30', title: 'Committee Session II: Moderated Debate & Initial Blocs', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Substantive debates on primary sub-topics, unmoderated caucus, and initial working paper frameworks.' },
      { time: '19:30 – 21:30', title: 'Delegate Welcome Soirée & Cultural Exchange', location: 'The Sovereign Ballroom', type: 'gala', description: 'An evening of cultural camaraderie, diplomatic social networking, and live ambient music.' }
    ]
  },
  {
    day: 2,
    title: 'DAY 02',
    theme: 'THE CRUCIBLE',
    date: 'Saturday, October 25, 2026',
    sessions: [
      { time: '09:00 – 11:30', title: 'Committee Session III: Draft Resolution Mergers', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Intensive unmoderated caucusing, clause-by-clause drafting, coalition alignment.' },
      { time: '11:30 – 13:00', title: 'Flashpoint Crisis Directive 01 / UNSC Emergency Order', location: 'Crisis & Security Chambers', type: 'crisis', description: 'Breaking news broadcast: Sudden geopolitical escalation requiring rapid cabinet response.' },
      { time: '13:00 – 14:15', title: 'Executive Working Lunch', location: 'Imperial Dining Suite', type: 'break', description: 'Delegates negotiate bilateral compromises over luncheon.' },
      { time: '14:15 – 17:00', title: 'Committee Session IV: Amendments & Chair Verification', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Introduction of friendly and unfriendly amendments, formal review of draft resolutions.' },
      { time: '17:15 – 19:30', title: 'Committee Session V: Midnight Crisis Climax', location: 'Crisis Hub / JCC', type: 'crisis', description: 'High-intensity strategic showdown. Simultaneous joint directives deployed.' },
      { time: '20:30 – 23:00', title: 'The Flame Gala & Diplomatic Ball', location: 'Palace Waterfront Pavilion', type: 'gala', description: 'Black-tie evening celebrating international youth leadership with panoramic Bosphorus views.' }
    ]
  },
  {
    day: 3,
    title: 'DAY 03',
    theme: 'THE BEACON',
    date: 'Sunday, October 26, 2026',
    sessions: [
      { time: '09:30 – 12:00', title: 'Committee Session VI: Final Voting Procedure', location: 'Assigned Committee Chambers', type: 'caucus', description: 'Roll call votes on draft resolutions. Passage of historic conference treaties.' },
      { time: '12:15 – 13:30', title: 'Farewell Luncheon & Commemorative Photo', location: 'Palace Courtyard', type: 'break', description: 'Delegation photography and informal closing conversations.' },
      { time: '14:00 – 16:30', title: 'Grand Closing Ceremony & Plenary Assembly', location: 'Plenary Grand Amphitheater', type: 'plenary', description: 'Presentation of passed resolutions, Secretary-General closing decree, delegation roll of honor.' },
      { time: '16:30 – 17:30', title: 'Distinguished Awards & Torch Passing Ceremony', location: 'Plenary Grand Amphitheater', type: 'plenary', description: 'Best Delegate, Outstanding Delegation awards, and symbolic passing of the diplomatic torch.' }
    ]
  }
];

export const VENUE_INFO = {
  title: 'THE IMPERIAL CONGRESS PALACE',
  subtitle: 'A Masterpiece of Heritage & Modern Diplomatic Grandeur',
  city: 'Istanbul, Turkey',
  address: 'Dolmabahçe Avenue, Beşiktaş, Istanbul',
  description: 'Situated on the historic shores of the Bosphorus where East meets West, the Imperial Congress Palace provides world-class plenary amphitheaters, acoustic-engineered committee chambers, and panoramic diplomatic lounges.',
  highlights: [
    { title: 'Plenary Amphitheater', desc: 'State-of-the-art 1,200 seat acoustic auditorium for ceremonies and General Assembly debate.' },
    { title: '12 Soundproof Chambers', desc: 'Individual committee rooms equipped with broadcast feeds and digital directive consoles.' },
    { title: 'Diplomatic Waterfront Terrace', desc: 'Historic waterfront promenade for informal caucus discussions and evening galas.' },
    { title: 'Direct Transit & 5-Star Accommodations', desc: 'Within walking distance to historic landmarks, premium hotels, and metro links.' }
  ]
};
