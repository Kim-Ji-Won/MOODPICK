/**
 * 채팅 로딩 점 애니메이션 컴포넌트
 * 점 3개가 파도처럼 물결치는 효과
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';

export function ChatLoadingDots() {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 각 점을 순차적으로 애니메이션 (파도 효과)
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(dot1Anim, 0);
    const anim2 = createAnimation(dot2Anim, 150);
    const anim3 = createAnimation(dot3Anim, 300);

    Animated.parallel([anim1, anim2, anim3]).start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  // Y축 이동 범위 (위아래로 움직임)
  const translateY1 = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const translateY2 = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const translateY3 = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              styles.dotMargin,
              {
                transform: [{ translateY: translateY1 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              styles.dotMargin,
              {
                transform: [{ translateY: translateY2 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                transform: [{ translateY: translateY3 }],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  bubble: {
    backgroundColor: '#F5F5F5', // AI 메시지와 동일한 배경색
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.secondary,
  },
  dotMargin: {
    marginRight: spacing.xs,
  },
});

