import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Platform } from "react-native";
import type { ScaledSize } from 'react-native';
import { useRouter } from "expo-router";

export default function OnboardingScreen1() {
  const router = useRouter();
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setScreenData(window);
    });

    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    return () => subscription?.remove();
  }, []);

  const styles = getResponsiveStyles(screenData);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/onboarding_img1.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome to{"\n"}Brill Prime</Text>
        <Text style={styles.description}>
          Your trusted financial partner for secure transactions and seamless money management
        </Text>

      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push("/onboarding/screen2")}
        >
          <Text style={styles.nextButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getResponsiveStyles = (screenData: { width: number; height: number }) => {
  const { width, height } = screenData;
  const isTablet = width >= 768;
  const isSmallScreen = width < 350;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: Math.max(16, width * 0.06),
      paddingVertical: Math.max(20, height * 0.04),
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: Math.max(8, width * 0.02),
    },
    imageContainer: {
      width: Math.min(width * 0.7, isTablet ? 320 : 280),
      height: Math.min(height * 0.4, isTablet ? 360 : 320),
      marginBottom: Math.max(20, height * 0.04),
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
    },
    title: {
      fontSize: isTablet ? 36 : isSmallScreen ? 20 : 24,
      fontWeight: '800',
      color: 'rgb(11, 26, 81)',
      textAlign: "center",
      marginBottom: Math.max(12, height * 0.02),
      lineHeight: isTablet ? 40 : isSmallScreen ? 28 : 32,
      maxWidth: width * 0.9,
    },
    description: {
      fontSize: isTablet ? 16 : isSmallScreen ? 13 : 14,
      color: 'rgb(136, 136, 136)',
      textAlign: "center",
      lineHeight: isTablet ? 24 : 20,
      marginBottom: Math.max(40, height * 0.06),
      maxWidth: Math.min(width * 0.85, 320),
    },
    pagination: {
      flexDirection: "row",
      gap: 8,
    },
    dot: {
      width: isTablet ? 10 : 8,
      height: isTablet ? 10 : 8,
      borderRadius: isTablet ? 5 : 4,
      backgroundColor: "rgb(224, 224, 224)",
    },
    activeDot: {
      backgroundColor: "rgb(11, 26, 81)",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Math.max(8, width * 0.02),
      paddingBottom: Math.max(16, height * 0.02),
    },
    nextButton: {
      width: isTablet ? 64 : 56,
      height: isTablet ? 64 : 56,
      borderRadius: 28,
      backgroundColor: 'rgb(70, 130, 180)',
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
    },
    nextButtonText: {
      color: 'white',
      fontSize: isTablet ? 32 : 24,
      fontWeight: 'bold',
    },
  });
};