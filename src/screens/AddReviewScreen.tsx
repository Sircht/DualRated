import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAuth } from '@/contexts/AuthContext';
import { palette, radius, spacing } from '@/styles/theme';
import { PrimaryButton } from '@/components/PrimaryButton';

const CATEGORY_OPTIONS = [
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Dish', value: 'dish' },
  { label: 'Movie', value: 'movie' },
  { label: 'Other', value: 'other' }
];

export const AddReviewScreen: React.FC = () => {
  const { submitReview } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('restaurant');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give the experience a name so you can find it later.');
      return;
    }
    setLoading(true);
    try {
      await submitReview({ name: name.trim(), category, rating, comment: comment.trim() });
      Alert.alert('Saved', 'Your rating is live. Your partner can now add theirs.');
      setName('');
      setComment('');
      setRating(5);
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'Could not submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <Text style={styles.label}>Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="eg. Sushi Place or Dune"
              placeholderTextColor={palette.muted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORY_OPTIONS.map((option) => (
                <Text
                  key={option.value}
                  style={[styles.chip, option.value === category && styles.chipActive]}
                  onPress={() => setCategory(option.value)}
                >
                  {option.label}
                </Text>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.label}>Your rating</Text>
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
            <Slider
              minimumValue={0}
              maximumValue={10}
              step={0.5}
              value={rating}
              onValueChange={setRating}
              minimumTrackTintColor={palette.primary}
            />
          </View>

          <View>
            <Text style={styles.label}>Comment (optional)</Text>
            <TextInput
              style={[styles.input, styles.commentInput]}
              value={comment}
              onChangeText={setComment}
              placeholder="What stood out?"
              placeholderTextColor={palette.muted}
              multiline
            />
          </View>

          <PrimaryButton label="Save review" onPress={handleSubmit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.secondary,
    marginBottom: spacing.sm
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: palette.secondary
  },
  commentInput: {
    minHeight: 120,
    textAlignVertical: 'top'
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    color: palette.secondary
  },
  chipActive: {
    backgroundColor: palette.primary,
    color: '#fff'
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.primary,
    marginBottom: spacing.sm
  }
});
