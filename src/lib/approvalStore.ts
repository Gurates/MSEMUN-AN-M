import { supabase } from './supabase';

export type ApplicationStatus = 'approved' | 'rejected' | 'waitlist' | 'pending';

export function clearLegacyApprovalCache() {
  try {
    localStorage.removeItem('msemun_approved_applications');
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

export async function saveApplicationStatus(table: string, id: string, status: ApplicationStatus) {
  const { error } = await supabase.from(table).update({ status }).eq('id', id).select('id').single();
  return !error;
}
