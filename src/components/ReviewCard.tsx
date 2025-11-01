import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { palette, radius, shadows, spacing } from '@/styles/theme';
import { DualRatedReview } from '@/services/authService';

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  dish: 'Dish',
  movie: 'Movie',
  other: 'Other'
};

const formatCategory = (category: string) =>
  CATEGORY_LABELS[category.toLowerCase()] ?? category;

const formatScore = (score?: number | null) => {
  if (typeof score !== 'number') return '—';
  return score.toFixed(1);
};

type Props = {
  review: DualRatedReview;
  isAwaitingPartner: boolean;
  onPress?: () => void;
};

export const ReviewCard: React.FC<Props> = ({ review, isAwaitingPartner, onPress }) => {
  return (
    <Pressable style={[styles.card, shadows.card]} accessibilityRole="button" onPress={onPress}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.category}>{formatCategory(review.category)}</Text>
          <Text style={styles.title}>{review.name}</Text>
        </View>
        <View style={styles.averageBadge}>
          <Text style={styles.averageLabel}>DualRated</Text>
          <Text style={styles.averageScore}>{formatScore(review.average_rating)}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>You</Text>
          <Text style={styles.scoreValue}>{formatScore(review.rating)}</Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>Partner</Text>
          <Text style={styles.scoreValue}>
            {isAwaitingPartner ? 'Waiting…' : formatScore(review.partner_rating)}
          </Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>When</Text>
          <Text style={styles.scoreValue}>{dayjs(review.created_at).format('DD MMM')}</Text>
        </View>
      </View>
      {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  category: {
    color: palette.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: spacing.xs
  },
  title: {
    color: palette.secondary,
    fontSize: 18,
    fontWeight: '600'
  },
  averageBadge: {
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    alignItems: 'center'
  },
  averageLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  averageScore: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md
  },
  scoreBlock: {
    alignItems: 'center'
  },
  scoreLabel: {
    color: palette.muted,
    fontSize: 12
  },
  scoreValue: {
    color: palette.secondary,
    fontWeight: '600',
    fontSize: 16
  },
  comment: {
    marginTop: spacing.md,
    color: palette.secondary,
    lineHeight: 20
  }
});
