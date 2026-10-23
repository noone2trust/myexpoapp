import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';

void SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  console.warn('Failed to keep native splash screen visible:', error);
});

export default function SplashScreenComponent() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const useNativeDriver = Platform.OS !== 'web';

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver,
    }).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver,
        }),
      ]),
    );
    pulseAnimation.start();

    const checkAppState = async () => {
      try {
        await new Promise<void>((resolve) => {
          timeout = setTimeout(resolve, 5000);
        });
        if (!isMounted) return;

        const hasSeenOnboarding = await AsyncStorage.getItem(
          'hasSeenOnboarding',
        );
        if (!isMounted) return;

        router.replace(
          hasSeenOnboarding ? '/home' : '/onboarding/screen1',
        );
      } catch (checkError) {
        if (!isMounted) return;
        console.error('Error checking app state:', checkError);
        setError(
          checkError instanceof Error
            ? checkError.message
            : 'Unable to load your app settings.',
        );
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (splashError) {
          console.error('Failed to hide native splash screen:', splashError);
        }
        if (isMounted) setIsLoading(false);
      }
    };

    void checkAppState();

    return () => {
      isMounted = false;
      if (timeout) clearTimeout(timeout);
      pulseAnimation.stop();
    };
  }, [fadeAnim, pulseAnim, retryCount, router]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            setError(null);
            setIsLoading(true);
            setRetryCount((count) => count + 1);
          }}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="BrillPrime Logo"
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Initializing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  retryText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
});
