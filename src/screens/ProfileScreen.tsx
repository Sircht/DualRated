import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { palette, spacing } from '@/styles/theme';
import { PrimaryButton } from '@/components/PrimaryButton';

export const ProfileScreen: React.FC = () => {
  const { profile, partner, signOutUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'Unable to sign out.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{profile?.display_name ?? 'Your profile'}</Text>
          <Text style={styles.subtitle}>{profile?.email}</Text>
          <Text style={styles.label}>Partner</Text>
          <Text style={styles.value}>{partner?.display_name ?? 'Not connected yet'}</Text>
        </View>
        <PrimaryButton label="Sign out" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: 24,
    gap: spacing.md
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.secondary
  },
  subtitle: {
    color: palette.muted
  },
  label: {
    fontWeight: '600',
    color: palette.secondary
  },
  value: {
    color: palette.secondary
  }
});
