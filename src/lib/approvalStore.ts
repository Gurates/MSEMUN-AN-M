const STORAGE_KEY = 'msemun_approved_applications';

export type ApplicationStatus = 'approved' | 'rejected' | 'waitlist' | 'pending';

export interface ApprovalRecord {
  id: string;
  approvedAt: string;
  sentTo: string;
  sentBy?: string;
  status: ApplicationStatus;
  decisionType?: 'approval' | 'rejection' | 'waitlist';
}

export const getApprovedMap = (): Record<string, ApprovalRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to parse approval storage:', err);
    return {};
  }
};

export const markApplicationStatus = (
  id: string,
  email: string,
  sender: string = 'msemun26@gmail.com',
  status: ApplicationStatus = 'approved'
) => {
  try {
    const current = getApprovedMap();
    current[id] = {
      id,
      approvedAt: new Date().toISOString(),
      sentTo: email,
      sentBy: sender,
      status,
      decisionType: status === 'rejected' ? 'rejection' : status === 'waitlist' ? 'waitlist' : 'approval'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save approval record:', err);
  }
};

export const markApplicationApproved = (id: string, email: string, sender: string = 'msemun26@gmail.com') => {
  markApplicationStatus(id, email, sender, 'approved');
};

export const markApplicationRejected = (id: string, email: string, sender: string = 'msemun26@gmail.com') => {
  markApplicationStatus(id, email, sender, 'rejected');
};

export const markApplicationWaitlist = (id: string, email: string, sender: string = 'msemun26@gmail.com') => {
  markApplicationStatus(id, email, sender, 'waitlist');
};

export const markApplicationPending = (id: string) => {
  try {
    const current = getApprovedMap();
    delete current[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to reset approval status:', err);
  }
};

export const getApplicationStatus = (id: string, supabaseStatus?: string): ApplicationStatus => {
  if (supabaseStatus === 'approved' || supabaseStatus === 'rejected' || supabaseStatus === 'waitlist') {
    return supabaseStatus as ApplicationStatus;
  }
  const map = getApprovedMap();
  return map[id]?.status || 'pending';
};

export const isApplicationApproved = (id: string, supabaseStatus?: string): boolean => {
  return getApplicationStatus(id, supabaseStatus) === 'approved';
};
