import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Profile,
  addOrUpdateReview,
  connectWithPairId,
  createPairLink,
  fetchPairProfiles,
  fetchProfile,
  fetchReviews,
  signIn,
  signOut,
  signUp,
  upsertProfile,
  type DualRatedReview
} from '@/services/authService';
import { supabase } from '@/services/supabaseClient';

export type AuthContextValue = {
  loading: boolean;
  session: any;
  profile: Profile | null;
  partner?: Profile | null;
  reviews: DualRatedReview[];
  refreshing: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (payload: Partial<Profile>) => Promise<void>;
  generatePairLink: () => Promise<{ pair_id: string; link: string }>;
  connectToPartner: (pairId: string) => Promise<void>;
  refreshReviews: () => Promise<void>;
  submitReview: (
    review: {
      name: string;
      category: string;
      rating: number;
      comment?: string;
    }
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partner, setPartner] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<DualRatedReview[]>([]);

  useEffect(() => {
    const prepare = async () => {
      const {
        data: { session: initialSession }
      } = await supabase.auth.getSession();
      setSession(initialSession);
      setLoading(false);
    };
    prepare();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(null);
      setPartner(null);
      setReviews([]);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const currentProfile = await fetchProfile();
        setProfile(currentProfile);
        if (currentProfile?.pair_id) {
          const pairProfiles = await fetchPairProfiles(currentProfile.pair_id);
          const partnerProfile = pairProfiles.find((p) => p.id !== currentProfile.id) ?? null;
          setPartner(partnerProfile);
          await loadReviews(currentProfile.pair_id);
        } else {
          setPartner(null);
          setReviews([]);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const loadReviews = useCallback(async (pairId: string) => {
    const list = await fetchReviews(pairId);
    setReviews(list);
  }, []);

  const refreshReviews = useCallback(async () => {
    if (!profile?.pair_id) return;
    setRefreshing(true);
    try {
      await loadReviews(profile.pair_id);
    } finally {
      setRefreshing(false);
    }
  }, [loadReviews, profile?.pair_id]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signIn(email.trim(), password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    await signUp(email.trim(), password, name.trim());
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut();
  }, []);

  const updateProfile = useCallback(async (payload: Partial<Profile>) => {
    if (!profile) return;
    const updated = await upsertProfile({ ...payload, id: profile.id });
    setProfile(updated);
  }, [profile]);

  const generatePairLink = useCallback(async () => {
    const link = await createPairLink();
    await refreshReviews();
    return link;
  }, [refreshReviews]);

  const connectToPartner = useCallback(
    async (pairId: string) => {
      await connectWithPairId(pairId);
      const updatedProfile = await fetchProfile();
      setProfile(updatedProfile);
      if (updatedProfile?.pair_id) {
        const pairProfiles = await fetchPairProfiles(updatedProfile.pair_id);
        const partnerProfile = pairProfiles.find((p) => p.id !== updatedProfile.id) ?? null;
        setPartner(partnerProfile);
        await loadReviews(updatedProfile.pair_id);
      }
    },
    [loadReviews]
  );

  const submitReview = useCallback(
    async (review: { name: string; category: string; rating: number; comment?: string }) => {
      if (!profile?.pair_id || !profile?.id) throw new Error('Missing pairing information');
      await addOrUpdateReview({
        ...review,
        pair_id: profile.pair_id,
        author_id: profile.id
      });
      await refreshReviews();
    },
    [profile?.id, profile?.pair_id, refreshReviews]
  );

  const value = useMemo(
    () => ({
      loading,
      refreshing,
      session,
      profile,
      partner,
      reviews,
      signInWithEmail,
      signUpWithEmail,
      signOutUser,
      updateProfile,
      generatePairLink,
      connectToPartner,
      refreshReviews,
      submitReview
    }),
    [
      loading,
      refreshing,
      session,
      profile,
      partner,
      reviews,
      signInWithEmail,
      signUpWithEmail,
      signOutUser,
      updateProfile,
      generatePairLink,
      connectToPartner,
      refreshReviews,
      submitReview
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
