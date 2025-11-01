import React, { useMemo, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { palette, radius, spacing } from '@/styles/theme';

export const PairingScreen: React.FC = () => {
  const { profile, partner, generatePairLink, connectToPartner } = useAuth();
  const [linkInfo, setLinkInfo] = useState<{ pair_id: string; link: string } | null>(null);
  const [pairCodeInput, setPairCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPartner = Boolean(partner);

  const pairCode = useMemo(() => {
    if (!linkInfo?.pair_id && profile?.pair_id) {
      return profile.pair_id;
    }
    return linkInfo?.pair_id ?? '';
  }, [linkInfo?.pair_id, profile?.pair_id]);

  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePairLink();
      setLinkInfo(result);
      await Clipboard.setStringAsync(result.link);
      Alert.alert('Link copied', 'Share it with your partner to connect.');
    } catch (err: any) {
      setError(err.message ?? 'Unable to generate link.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!pairCodeInput.trim()) {
      setError('Enter the code that your partner shared.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await connectToPartner(pairCodeInput.trim());
      setPairCodeInput('');
    } catch (err: any) {
      setError(err.message ?? 'Could not connect to that code.');
    } finally {
      setLoading(false);
    }
  };

  if (hasPartner) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          title="You're connected!"
          description={`You're now sharing experiences with ${partner?.display_name ?? 'your partner'}. Add reviews to see your combined score.`}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Share your link</Text>
          <Text style={styles.description}>
            Generate a private link to share with your partner. Once they join, your ratings will
            sync automatically.
          </Text>
          <PrimaryButton
            label={pairCode ? 'Copy link again' : 'Generate link'}
            onPress={handleGenerateLink}
            loading={loading}
          />
          {pairCode ? <Text style={styles.code}>{pairCode}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Got a link?</Text>
          <Text style={styles.description}>
            Paste the code from your partner here to complete the pairing.
          </Text>
          <TextInput
            value={pairCodeInput}
            onChangeText={setPairCodeInput}
            style={styles.input}
            placeholder="Enter partner code"
            placeholderTextColor={palette.muted}
          />
          <PrimaryButton label="Connect" onPress={handleConnect} loading={loading} />
        </View>
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
    gap: spacing.lg
  },
  card: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.border
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.secondary
  },
  description: {
    color: palette.muted,
    lineHeight: 20
  },
  code: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 2,
    color: palette.secondary
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: palette.secondary
  },
  error: {
    color: palette.primary
  }
});
