// Persistent storage helper for tracking application approval status and email timestamps
const STORAGE_KEY = 'msemun_approved_applications';

export interface ApprovalRecord {
  id: string;
  approvedAt: string;
  sentTo: string;
  sentBy?: string;
  status: 'approved' | 'rejected' | 'pending';
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

export const markApplicationApproved = (id: string, email: string, sender: string = 'secretariat@msemun.org') => {
  try {
    const current = getApprovedMap();
    current[id] = {
      id,
      approvedAt: new Date().toISOString(),
      sentTo: email,
      sentBy: sender,
      status: 'approved'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save approval record:', err);
  }
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

export const isApplicationApproved = (id: string, supabaseStatus?: string): boolean => {
  if (supabaseStatus === 'approved') return true;
  const map = getApprovedMap();
  return map[id]?.status === 'approved';
};
