import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import { Onboarding } from './src/components/Onboarding';

const ONBOARDING_STORAGE_KEY = 'myexpoapp.onboarding-complete';

void SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  console.warn('Unable to keep the native splash screen visible.', error);
});

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    const initialize = async () => {
      try {
        const [sessionResult, onboardingResult] = await Promise.all([
          supabase.auth.getSession(),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
        ]);
        if (!isMounted) return;
        if (sessionResult.error) throw sessionResult.error;
        setSession(sessionResult.data.session);
        setOnboardingComplete(onboardingResult === 'complete');
      } catch (bootError) {
        if (!isMounted) return;
        setError(
          bootError instanceof Error
            ? bootError.message
            : 'Unable to load your app settings.',
        );
      } finally {
        if (isMounted) setIsBooting(false);
      }
    };

    void initialize();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isBooting) return;

    void SplashScreen.hideAsync().catch((splashError: unknown) => {
      console.error('Unable to hide the native splash screen.', splashError);
    });
    const timeout = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(timeout);
  }, [isBooting]);

  const completeOnboarding = async () => {
    setError('');
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'complete');
      setOnboardingComplete(true);
    } catch (storageError) {
      setError(
        storageError instanceof Error
          ? storageError.message
          : 'Unable to save your onboarding progress. Please try again.',
      );
    }
  };

  const handleAuth = async () => {
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const result = isSigningUp
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

      if (result.error) {
        setError(result.error.message);
      } else if (
        isSigningUp &&
        result.data.user &&
        !result.data.session
      ) {
        setMessage('Check your email to confirm your account, then sign in.');
        setIsSigningUp(false);
      }
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : 'Authentication failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setError('');
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) setError(signOutError.message);
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : 'Unable to sign out. Please try again.',
      );
    }
  };

  if (isBooting || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashMark}>
          <Text style={styles.splashMarkText}>m</Text>
        </View>
        <Text style={styles.splashTitle}>myexpoapp</Text>
        <Text style={styles.splashSubtitle}>A little progress, every day.</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!session && !onboardingComplete) {
    return (
      <>
        <Onboarding error={error} onComplete={completeOnboarding} />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {session
            ? "You're signed in"
            : isSigningUp
              ? 'Create account'
              : 'Welcome back'}
        </Text>
        <Text style={styles.subtitle}>
          {session?.user.email ??
            (isSigningUp
              ? 'Sign up with your email and a password.'
              : 'Sign in to continue.')}
        </Text>

        {session ? (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleSignOut}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={email}
            />
            <TextInput
              autoCapitalize="none"
              autoComplete={isSigningUp ? 'new-password' : 'password'}
              onChangeText={setPassword}
              onSubmitEditing={handleAuth}
              placeholder="Password"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              value={password}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isSubmitting || !email.trim() || !password}
              onPress={handleAuth}
              style={[
                styles.button,
                (isSubmitting || !email.trim() || !password) &&
                  styles.buttonDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSigningUp ? 'Create account' : 'Sign in'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={() => {
                setIsSigningUp(!isSigningUp);
                setError('');
                setMessage('');
              }}
              style={styles.switchButton}
            >
              <Text style={styles.switchText}>
                {isSigningUp
                  ? 'Already have an account? Sign in'
                  : 'New here? Create an account'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {session && error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  splashMark: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 24,
    height: 76,
    justifyContent: 'center',
    marginBottom: 18,
    width: 76,
  },
  splashMarkText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 57,
  },
  splashTitle: {
    color: '#0f172a',
    fontSize: 25,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#cbd5e1',
    borderRadius: 10,
    borderWidth: 1,
    color: '#0f172a',
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  switchText: {
    color: '#1d4ed8',
    fontSize: 15,
    fontWeight: '500',
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    marginBottom: 12,
  },
  message: {
    color: '#166534',
    fontSize: 14,
    marginBottom: 12,
  },
});
