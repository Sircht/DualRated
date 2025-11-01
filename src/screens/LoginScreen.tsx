import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { palette, radius, spacing } from '@/styles/theme';
import { PrimaryButton } from '@/components/PrimaryButton';

export const LoginScreen: React.FC = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isCreatingAccount) {
        if (!name.trim()) {
          setError('Share your name to keep things personal.');
          return;
        }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message ?? 'We could not complete that request. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[palette.background, '#F0F0F2']} style={styles.gradient}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.content}
        >
          <View style={styles.logoBlock}>
            <Image source={require('../../assets/icon.png')} style={styles.logo} />
            <Text style={styles.heading}>DualRated</Text>
            <Text style={styles.tagline}>
              Rate experiences together. Keep a shared memory of what you both love.
            </Text>
          </View>

          <View style={styles.form}>
            {isCreatingAccount ? (
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={palette.muted}
                style={styles.input}
              />
            ) : null}
            <TextInput
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor={palette.muted}
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={palette.muted}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PrimaryButton
              label={isCreatingAccount ? 'Create account' : 'Sign in'}
              onPress={handleSubmit}
              loading={loading}
            />
            <Text
              style={styles.toggle}
              onPress={() => setIsCreatingAccount((prev) => !prev)}
            >
              {isCreatingAccount ? 'Already have an account? Sign in' : 'New here? Create account'}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between'
  },
  logoBlock: {
    alignItems: 'center'
  },
  logo: {
    width: 82,
    height: 82,
    marginBottom: spacing.md
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.secondary
  },
  tagline: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: palette.muted
  },
  form: {
    gap: spacing.md
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.secondary
  },
  toggle: {
    textAlign: 'center',
    color: palette.secondary,
    fontWeight: '600'
  },
  error: {
    color: palette.primary,
    textAlign: 'center'
  }
});
