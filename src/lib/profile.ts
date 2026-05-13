import { supabase } from './supabase';

export interface ProfileData {
  id?: string;
  stage_name: string;
  real_name: string;
  bio: string;
  spotify_uri: string;
  instagram: string;
  genre: string;
  gender?: string;
  avatar_url?: string;
  updated_at?: string;
}

/**
 * Fetches the profile for a given user ID.
 */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data;
}

/**
 * Updates or creates a profile for a given user ID.
 */
export async function updateProfile(userId: string, updates: Partial<ProfileData>) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) throw error;
}
