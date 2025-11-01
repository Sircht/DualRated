import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette, spacing } from '@/styles/theme';

type Props = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export const EmptyState: React.FC<Props> = ({ title, description, action }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: palette.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center'
  },
  description: {
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 20
  },
  action: {
    marginTop: spacing.lg
  }
});
