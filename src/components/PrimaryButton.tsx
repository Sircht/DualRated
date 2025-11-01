import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { palette, radius, spacing } from '@/styles/theme';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export const PrimaryButton: React.FC<Props> = ({ label, onPress, loading, disabled }) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, isDisabled && styles.disabled]}
      disabled={isDisabled}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center'
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.65
  }
});
