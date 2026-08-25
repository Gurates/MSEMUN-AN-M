export interface Speaker {
  id: string;
  name: string;
  role: string;
  organization: string;
  topic: string;
  bio: string;
  image: string;
  chamber: string;
}

export interface Committee {
  id: string;
  acronym: string;
  name: string;
  shortTitle?: string;
  agenda: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Specialized Crisis';
  seats: number;
  president: string;
  accentColor: string;
  flameFocus: string;
  image?: string;
  gradient?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  location: string;
  type: 'plenary' | 'caucus' | 'crisis' | 'gala' | 'break';
  description?: string;
}

export interface DaySchedule {
  day: number;
  title: string;
  theme: string;
  date: string;
  sessions: ScheduleItem[];
}

export interface StatItem {
  label: string;
  value: string;
  description: string;
  iconName: string;
}

export interface NavLink {
  label: string;
  href: string;
}
