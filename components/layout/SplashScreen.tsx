/**
 * 스플래시 화면 컴포넌트
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@/design/tokens/colors';
import { typography } from '@/design/tokens/typography';
import { spacing } from '@/design/tokens/spacing';

export function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 페이드 인 및 스케일 애니메이션
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 아이콘 */}
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <Text style={styles.heart}>❤️</Text>
          </View>
        </View>

        {/* 브랜드명 */}
        <Text style={styles.brandName}>MOODPICK</Text>

        {/* 태그라인 */}
        <Text style={styles.tagline}>AI가 전해주는 한 줄 위로</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1A1A2E', // 어두운 파란색 (거의 검정)
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    fontSize: 40,
  },
  brandName: {
    ...typography.h1,
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A2E', // 어두운 파란색
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.body,
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '400',
  },
});

