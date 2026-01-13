/**
 * 심플한 로딩 스피너 컴포넌트
 * 부드럽게 돌아가는 원형 로딩 인디케이터
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';

interface RippleLoadingProps {
  loading?: boolean;
  message?: string;
}

export function RippleLoading({ loading = true, message = 'AI가 추천을 준비하고 있어요...' }: RippleLoadingProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (loading) {
      // 회전 애니메이션
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      );

      // 투명도 펄스 애니메이션 (부드러운 효과)
      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

      spinAnimation.start();
      opacityAnimation.start();

      return () => {
        spinAnimation.stop();
        opacityAnimation.stop();
      };
    } else {
      spinValue.setValue(0);
      opacityValue.setValue(0.6);
    }
  }, [loading, spinValue, opacityValue]);

  if (!loading) return null;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrapper}>
        {/* 배경 원 (전체) */}
        <View style={styles.circleBackground} />
        
        {/* 회전하는 원 (일부만 보임) */}
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              transform: [{ rotate: spin }],
              opacity: opacityValue,
            },
          ]}
        >
          <View style={styles.circleSpinner} />
        </Animated.View>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
  },
  spinnerWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleBackground: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.border,
  },
  spinnerContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '500',
    marginTop: spacing.xxl,
  },
});

