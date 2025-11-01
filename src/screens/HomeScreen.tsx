import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { palette, spacing } from '@/styles/theme';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ReviewCard } from '@/components/ReviewCard';
import { EmptyState } from '@/components/EmptyState';
import { useFilterStore, SortOption } from '@/store/useFilterStore';
import type { DualRatedReview } from '@/services/authService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';

const filterReviews = (
  reviews: DualRatedReview[],
  filters: { category: string | null; minimumRating: number | null; sort: SortOption }
) => {
  let filtered = [...reviews];
  if (filters.category) {
    filtered = filtered.filter((review) => review.category === filters.category);
  }
  if (filters.minimumRating != null) {
    filtered = filtered.filter((review) => (review.average_rating ?? review.rating) >= filters.minimumRating);
  }
  if (filters.sort === 'highest') {
    filtered.sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0));
  } else if (filters.sort === 'lowest') {
    filtered.sort((a, b) => (a.average_rating ?? 0) - (b.average_rating ?? 0));
  } else {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  return filtered;
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, partner, reviews, refreshing, refreshReviews } = useAuth();
  const { category, minimumRating, sort, setCategory, setMinimumRating, setSort, reset } =
    useFilterStore();

  const data = useMemo(
    () => filterReviews(reviews, { category, minimumRating, sort }),
    [category, minimumRating, sort, reviews]
  );

  const awaitingPartnerIds = useMemo(() => new Set(reviews.filter((r) => !r.partner_rating).map((r) => r.id)), [
    reviews
  ]);

  const renderReview = ({ item }: { item: DualRatedReview }) => (
    <ReviewCard
      review={item}
      isAwaitingPartner={awaitingPartnerIds.has(item.id)}
      onPress={() => navigation.navigate('ReviewDetails', { reviewId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={refreshReviews}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Hello, {profile?.display_name ?? 'you'} 👋</Text>
              <Text style={styles.subtitle}>
                {partner
                  ? `You're rating alongside ${partner.display_name}.`
                  : 'Pair with your partner to start syncing ratings.'}
              </Text>
              <View style={styles.filterRow}>
                {['restaurant', 'dish', 'movie', 'other'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.filterChip, category === value && styles.filterChipActive]}
                    onPress={() => setCategory(category === value ? null : value)}
                  >
                    <Text
                      style={[styles.filterChipLabel, category === value && styles.filterChipLabelActive]}
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.filterChip} onPress={() => reset()}>
                  <Text style={styles.filterChipLabel}>Reset</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.filterRow}>
                {[null, 6, 8].map((value) => (
                  <TouchableOpacity
                    key={value ?? 'all'}
                    style={[styles.filterChip, minimumRating === value && styles.filterChipActive]}
                    onPress={() => setMinimumRating(value)}
                  >
                    <Text
                      style={[
                        styles.filterChipLabel,
                        minimumRating === value && styles.filterChipLabelActive
                      ]}
                    >
                      {value == null ? 'All ratings' : `≥ ${value}`}
                    </Text>
                  </TouchableOpacity>
                ))}
                {(['newest', 'highest', 'lowest'] as SortOption[]).map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.filterChip, sort === value && styles.filterChipActive]}
                    onPress={() => setSort(value)}
                  >
                    <Text
                      style={[styles.filterChipLabel, sort === value && styles.filterChipLabelActive]}
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <PrimaryButton label="+ Add Review" onPress={() => navigation.navigate('AddReview')} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No ratings yet"
            description="Add your first review to see DualRated scores here."
            action={<PrimaryButton label="Add your first review" onPress={() => navigation.navigate('AddReview')} />}
          />
        }
        renderItem={renderReview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.md
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.secondary
  },
  subtitle: {
    color: palette.muted,
    lineHeight: 20
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border
  },
  filterChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary
  },
  filterChipLabel: {
    color: palette.secondary,
    fontSize: 12,
    fontWeight: '500'
  },
  filterChipLabelActive: {
    color: '#fff'
  }
});
