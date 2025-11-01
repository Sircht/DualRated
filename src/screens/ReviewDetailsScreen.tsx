import React, { useMemo } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing } from '@/styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackParamList } from '@/navigation/AppNavigator';

export const ReviewDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ReviewDetails'>>();
  const { reviews, profile, partner } = useAuth();
  const review = useMemo(() => reviews.find((item) => item.id === route.params.reviewId), [
    reviews,
    route.params.reviewId
  ]);

  if (!review) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Review not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{review.name}</Text>
          <Text style={styles.subtitle}>{review.category}</Text>
          <View style={styles.row}>
            <View style={styles.scoreBlock}>
              <Text style={styles.label}>{profile?.display_name ?? 'You'}</Text>
              <Text style={styles.score}>{review.rating.toFixed(1)}</Text>
              {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
            </View>
            <View style={styles.scoreBlock}>
              <Text style={styles.label}>{partner?.display_name ?? 'Partner'}</Text>
              <Text style={styles.score}>
                {review.partner_rating != null ? review.partner_rating.toFixed(1) : 'Waiting'}
              </Text>
              {review.partner_comment ? (
                <Text style={styles.comment}>{review.partner_comment}</Text>
              ) : null}
            </View>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>DualRated score</Text>
          <Text style={styles.summaryScore}>
            {review.average_rating != null ? review.average_rating.toFixed(1) : '—'}
          </Text>
          <Text style={styles.summaryBody}>
            {review.partner_rating != null
              ? `You rated this ${review.rating.toFixed(1)}. Your partner rated ${review.partner_rating.toFixed(1)}. DualRated score: ${
                  review.average_rating?.toFixed(1) ?? '—'
                } ⭐️`
              : 'Your partner has not rated this yet. Give them a nudge and come back later.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  container: {
    padding: spacing.xl,
    gap: spacing.lg
  },
  card: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
    borderColor: palette.border,
    borderWidth: 1
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.secondary
  },
  subtitle: {
    color: palette.muted,
    textTransform: 'capitalize'
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg
  },
  scoreBlock: {
    flex: 1,
    gap: spacing.sm
  },
  label: {
    fontWeight: '600',
    color: palette.secondary
  },
  score: {
    fontSize: 32,
    fontWeight: '700',
    color: palette.primary
  },
  comment: {
    color: palette.secondary
  },
  summaryCard: {
    backgroundColor: palette.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md
  },
  summaryTitle: {
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  summaryScore: {
    fontSize: 42,
    fontWeight: '700',
    color: palette.secondary
  },
  summaryBody: {
    color: palette.secondary,
    lineHeight: 22
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: palette.muted
  }
});
