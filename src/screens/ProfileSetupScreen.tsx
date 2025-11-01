import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { palette, radius, spacing } from '@/styles/theme';

export const ProfileSetupScreen: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Give us a name to show your partner.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ display_name: displayName.trim(), avatar_url: avatarUrl.trim() });
    } catch (err: any) {
      setError(err.message ?? 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.subtitle}>
            DualRated works best when both of you have a complete profile.
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Display name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
            placeholder="How should we call you?"
            placeholderTextColor={palette.muted}
          />
          <Text style={styles.label}>Avatar URL (optional)</Text>
          <TextInput
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            style={styles.input}
            placeholder="Paste a link to an image"
            placeholderTextColor={palette.muted}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <PrimaryButton label="Save and continue" onPress={handleSave} loading={saving} />
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
  header: {
    gap: spacing.sm
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.secondary
  },
  subtitle: {
    color: palette.muted,
    lineHeight: 20
  },
  form: {
    gap: spacing.sm
  },
  label: {
    fontWeight: '600',
    color: palette.secondary
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.secondary
  },
  error: {
    color: palette.primary
  }
});
