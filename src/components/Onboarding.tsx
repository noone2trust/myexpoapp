import { useRef, useState } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
} from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const slides = [
  {
    eyebrow: 'A FRESH START',
    title: 'Make space for what matters.',
    description:
      'A calmer, clearer way to get started. Your next step is always right here.',
    art: 'welcome',
  },
  {
    eyebrow: 'MADE FOR YOU',
    title: 'Find your own rhythm.',
    description:
      'Keep things simple, move at your pace, and make the experience your own.',
    art: 'rhythm',
  },
  {
    eyebrow: 'READY WHEN YOU ARE',
    title: 'Let’s make it happen.',
    description:
      'Create your account and take the first step. You can pick up where you left off anytime.',
    art: 'ready',
  },
] as const;

type OnboardingProps = {
  error?: string;
  onComplete: () => void;
};

export function Onboarding({ error, onComplete }: OnboardingProps) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    setActiveIndex(
      Math.min(
        slides.length - 1,
        Math.max(
          0,
          Math.round(event.nativeEvent.contentOffset.x / width),
        ),
      ),
    );
  };

  const goToNext = () => {
    if (activeIndex === slides.length - 1) {
      onComplete();
      return;
    }

    const nextIndex = activeIndex + 1;
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    setActiveIndex(nextIndex);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>m</Text>
            </View>
            <Text style={styles.brandName}>myexpoapp</Text>
          </View>
          {activeIndex < slides.length - 1 ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              onPress={onComplete}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipButton} />
          )}
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          style={styles.slides}
        >
          {slides.map((slide, index) => (
            <View key={slide.eyebrow} style={[styles.slide, { width }]}>
              <View style={styles.artwork}>
                <View style={styles.artHalo} />
                <Illustration kind={slide.art} />
                <View style={styles.artCaption}>
                  <View style={styles.captionDot} />
                  <Text style={styles.captionText}>
                    {index === 0
                      ? 'A little progress goes a long way'
                      : index === 1
                        ? 'Thoughtful by design'
                        : 'Your journey starts here'}
                  </Text>
                </View>
              </View>
              <View style={styles.copy}>
                <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View
            accessibilityLabel={`Screen ${activeIndex + 1} of ${slides.length}`}
            accessibilityRole="progressbar"
            style={styles.pagination}
          >
            {slides.map((slide, index) => (
              <View
                key={slide.eyebrow}
                style={[
                  styles.pageIndicator,
                  index === activeIndex && styles.activePageIndicator,
                ]}
              />
            ))}
          </View>
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={goToNext}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {activeIndex === slides.length - 1 ? 'Get started' : 'Continue'}
            </Text>
            <Text style={styles.nextButtonArrow}>→</Text>
          </TouchableOpacity>
          <Text style={styles.footerHint}>
            {activeIndex === slides.length - 1
              ? 'Your next chapter starts with one step.'
              : 'Swipe to explore'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

type IllustrationProps = {
  kind: (typeof slides)[number]['art'];
};

function Illustration({ kind }: IllustrationProps) {
  if (kind === 'welcome') {
    return (
      <View style={styles.welcomeIllustration}>
        <View style={styles.welcomeOrb} />
        <View style={styles.welcomeCard}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>✦</Text>
          </View>
          <View style={styles.welcomeCardCopy}>
            <View style={styles.lineLong} />
            <View style={styles.lineShort} />
          </View>
          <View style={styles.checkCircle}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        </View>
        <View style={styles.welcomeNote}>
          <View style={styles.noteStar}>
            <Text style={styles.noteStarText}>✦</Text>
          </View>
          <Text style={styles.noteText}>One step at a time</Text>
        </View>
      </View>
    );
  }

  if (kind === 'rhythm') {
    return (
      <View style={styles.rhythmIllustration}>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <View style={styles.lineMedium} />
              <View style={styles.chartSubline} />
            </View>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>THIS WEEK</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {[34, 52, 42, 72, 58, 88, 66].map((height, index) => (
              <View key={index} style={styles.chartBarTrack}>
                <View
                  style={[
                    styles.chartBar,
                    { height },
                    index === 5 && styles.chartBarActive,
                  ]}
                />
              </View>
            ))}
          </View>
          <View style={styles.chartDays}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.chartDay}>
                {day}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.rhythmTag}>
          <View style={styles.rhythmTagDot} />
          <Text style={styles.rhythmTagText}>Your pace, your way</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.readyIllustration}>
      <View style={styles.readyRingOuter} />
      <View style={styles.readyRingInner} />
      <View style={styles.readyCard}>
        <View style={styles.readyIcon}>
          <Text style={styles.readyIconText}>✓</Text>
        </View>
        <View style={styles.readyCardLines}>
          <View style={styles.lineLong} />
          <View style={styles.lineShort} />
        </View>
      </View>
      <View style={styles.readySparkle}>
        <Text style={styles.readySparkleText}>✦</Text>
      </View>
      <View style={styles.readyDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 10,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  brandMarkText: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 25,
  },
  brandName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  skipButton: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 52,
  },
  skipText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
  slides: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 26,
  },
  artwork: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 240,
    position: 'relative',
  },
  artHalo: {
    backgroundColor: '#e9f0ff',
    borderRadius: 180,
    height: 268,
    position: 'absolute',
    width: 268,
  },
  artCaption: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e8edf5',
    borderRadius: 24,
    borderWidth: 1,
    bottom: 10,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'absolute',
  },
  captionDot: {
    backgroundColor: '#22c58b',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  captionText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  welcomeIllustration: {
    alignItems: 'center',
    height: 230,
    justifyContent: 'center',
    width: '100%',
  },
  welcomeOrb: {
    backgroundColor: '#d5e2ff',
    borderRadius: 70,
    height: 140,
    position: 'absolute',
    right: 28,
    top: 8,
    width: 140,
  },
  welcomeCard: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: '#edf1f7',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 17,
    shadowColor: '#18366c',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    width: '90%',
  },
  cardIcon: {
    alignItems: 'center',
    backgroundColor: '#edf2ff',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  cardIconText: {
    color: '#2563eb',
    fontSize: 25,
  },
  welcomeCardCopy: {
    flex: 1,
    gap: 9,
  },
  lineLong: {
    backgroundColor: '#25344d',
    borderRadius: 4,
    height: 9,
    width: '76%',
  },
  lineMedium: {
    backgroundColor: '#25344d',
    borderRadius: 4,
    height: 9,
    width: 96,
  },
  lineShort: {
    backgroundColor: '#d8dfeb',
    borderRadius: 4,
    height: 7,
    width: '55%',
  },
  checkCircle: {
    alignItems: 'center',
    backgroundColor: '#e9fbf3',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkText: {
    color: '#12a873',
    fontSize: 17,
    fontWeight: '700',
  },
  welcomeNote: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#edf1f7',
    borderRadius: 14,
    borderWidth: 1,
    bottom: 25,
    flexDirection: 'row',
    gap: 8,
    left: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    position: 'absolute',
  },
  noteStar: {
    alignItems: 'center',
    backgroundColor: '#fff4da',
    borderRadius: 10,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  noteStarText: {
    color: '#f3a526',
    fontSize: 13,
  },
  noteText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  rhythmIllustration: {
    alignItems: 'center',
    height: 230,
    justifyContent: 'center',
    width: '100%',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderColor: '#edf1f7',
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#18366c',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    width: '94%',
  },
  chartHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartSubline: {
    backgroundColor: '#d8dfeb',
    borderRadius: 4,
    height: 6,
    marginTop: 8,
    width: 60,
  },
  chartBadge: {
    backgroundColor: '#edf2ff',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  chartBadgeText: {
    color: '#3862b9',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 108,
    justifyContent: 'space-between',
    marginTop: 22,
    paddingHorizontal: 5,
  },
  chartBarTrack: {
    alignItems: 'center',
    backgroundColor: '#f1f4fa',
    borderRadius: 7,
    height: 94,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: 24,
  },
  chartBar: {
    backgroundColor: '#b8cbff',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
  },
  chartBarActive: {
    backgroundColor: '#3972ed',
  },
  chartDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 3,
  },
  chartDay: {
    color: '#94a3b8',
    fontSize: 10,
    textAlign: 'center',
    width: 24,
  },
  rhythmTag: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#edf1f7',
    borderRadius: 20,
    borderWidth: 1,
    bottom: 3,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 9,
    position: 'absolute',
    right: 0,
  },
  rhythmTagDot: {
    backgroundColor: '#3972ed',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  rhythmTagText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  readyIllustration: {
    alignItems: 'center',
    height: 230,
    justifyContent: 'center',
    width: '100%',
  },
  readyRingOuter: {
    borderColor: '#ccdaff',
    borderRadius: 140,
    borderWidth: 1,
    height: 240,
    position: 'absolute',
    width: 240,
  },
  readyRingInner: {
    borderColor: '#d8e3ff',
    borderRadius: 110,
    borderWidth: 1,
    height: 190,
    position: 'absolute',
    width: 190,
  },
  readyCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#edf1f7',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    padding: 18,
    shadowColor: '#18366c',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    width: '88%',
  },
  readyIcon: {
    alignItems: 'center',
    backgroundColor: '#e8fbf3',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  readyIconText: {
    color: '#12a873',
    fontSize: 27,
    fontWeight: '700',
  },
  readyCardLines: {
    flex: 1,
    gap: 10,
  },
  readySparkle: {
    alignItems: 'center',
    backgroundColor: '#fff3d9',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 22,
    top: 17,
    width: 40,
  },
  readySparkleText: {
    color: '#efa526',
    fontSize: 22,
  },
  readyDot: {
    backgroundColor: '#9aaff4',
    borderRadius: 7,
    height: 14,
    left: 20,
    position: 'absolute',
    top: 64,
    width: 14,
  },
  copy: {
    paddingBottom: 18,
    paddingTop: 8,
  },
  eyebrow: {
    color: '#3972ed',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    color: '#111c32',
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 37,
    marginBottom: 11,
    maxWidth: 340,
  },
  description: {
    color: '#64748b',
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 340,
  },
  footer: {
    paddingBottom: 18,
    paddingHorizontal: 26,
    paddingTop: 6,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    marginBottom: 19,
  },
  pageIndicator: {
    backgroundColor: '#d7dfed',
    borderRadius: 3,
    height: 6,
    width: 7,
  },
  activePageIndicator: {
    backgroundColor: '#3972ed',
    width: 23,
  },
  error: {
    color: '#b91c1c',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 15,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonArrow: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '500',
    marginLeft: 10,
  },
  footerHint: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
