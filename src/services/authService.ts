import * as Crypto from 'expo-crypto';
import { supabase } from './supabaseClient';

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  pair_id?: string | null;
  created_at?: string;
};

export type Review = {
  id: string;
  pair_id: string;
  author_id: string;
  name: string;
  category: string;
  rating: number;
  comment?: string | null;
  created_at: string;
};

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchProfile(): Promise<Profile | null> {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session?.user?.id) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  const profile = data as Profile | null;
  if (profile && !profile.email && session?.user?.email) {
    profile.email = session.user.email;
  }
  return profile;
}

export async function upsertProfile(profile: Partial<Profile>) {
  const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
  if (error) throw error;
  return data as Profile;
}

export async function createPairLink(): Promise<{ pair_id: string; link: string }> {
  const profile = await fetchProfile();
  if (!profile) throw new Error('No profile found');
  const pairId = profile.pair_id ?? (await Crypto.randomUUID());

  if (profile.pair_id !== pairId) {
    await upsertProfile({ id: profile.id, pair_id: pairId });
  }

  const link = `dualrated.app/connect/${pairId}`;
  return { pair_id: pairId, link };
}

export async function connectWithPairId(pairId: string) {
  const profile = await fetchProfile();
  if (!profile) throw new Error('No profile found');
  await upsertProfile({ id: profile.id, pair_id: pairId });
  return pairId;
}

export async function fetchPairProfiles(pairId: string): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').eq('pair_id', pairId);
  if (error) throw error;
  return (data as Profile[]) ?? [];
}

export type DualRatedReview = Review & {
  partner_rating?: number | null;
  partner_comment?: string | null;
  partner_id?: string | null;
  average_rating?: number | null;
};

export async function fetchReviews(pairId: string): Promise<DualRatedReview[]> {
  const { data, error } = await supabase
    .from('dual_reviews_view')
    .select('*')
    .eq('pair_id', pairId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as DualRatedReview[]) ?? [];
}

export async function addOrUpdateReview(
  review: Omit<Review, 'id' | 'created_at' | 'pair_id'> & { pair_id?: string }
) {
  const pairId = review.pair_id;
  if (!pairId) throw new Error('Missing pair identifier');

  const { data, error } = await supabase
    .from('reviews')
    .upsert({
      pair_id: pairId,
      author_id: review.author_id,
      name: review.name.trim(),
      category: review.category,
      rating: review.rating,
      comment: review.comment ?? null
    })
    .select()
    .single();

  if (error) throw error;
  return data as Review;
  }
