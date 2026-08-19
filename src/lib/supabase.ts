import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface ProfileRow {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: string;
  skill_title: string;
  bio: string;
  skills: string[];
  languages: string[];
  category: string;
  experience_years: number;
  location_area: string;
  onboarded: boolean;
  avatar_url: string;
  created_at: string;
}

export interface ConnectionRow {
  id: string;
  requester_id: string;
  responder_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}
