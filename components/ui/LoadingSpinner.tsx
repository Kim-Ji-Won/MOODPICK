/**
 * 로딩 스피너 컴포넌트
 * 이모지 순환 애니메이션
 */

import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useLoadingAnimation } from '@/hooks/useLoadingAnimation';
import { typography } from '@/design/tokens/typography';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';

interface LoadingSpinnerProps {
  loading?: boolean;
  message?: string;
}

export function LoadingSpinner({ loading = true, message = 'AI가 추천을 준비하고 있어요...' }: LoadingSpinnerProps) {
  const { currentEmoji, emojiFadeAnim } = useLoadingAnimation(loading);

  if (!loading) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.emojiContainer,
          {
            opacity: emojiFadeAnim,
            transform: [
              {
                scale: emojiFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.emoji}>{currentEmoji}</Text>
      </Animated.View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
  },
  emojiContainer: {
    // 애니메이션 스타일은 인라인으로 적용
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '500',
    marginTop: spacing.xxl,
  },
});

