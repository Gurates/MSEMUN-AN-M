import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wqrlqoxgsutblmrnkmqi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TZ7Wnp7TTpld6tRAt5TO4w_9_wcs-_0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
