/**
 * 순차적 애니메이션 Hook
 * 여러 요소가 하나씩 순차적으로 나타나는 애니메이션
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseStaggeredAnimationOptions {
  itemCount: number;
  delay?: number; // 각 아이템 간 지연 시간 (ms)
  duration?: number; // 각 애니메이션 지속 시간 (ms)
  startDelay?: number; // 전체 애니메이션 시작 지연 시간 (ms)
}

export function useStaggeredAnimation({
  itemCount,
  delay = 150,
  duration = 500,
  startDelay = 0,
}: UseStaggeredAnimationOptions) {
  const animations = useRef(
    Array.from({ length: itemCount }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  useEffect(() => {
    // 모든 애니메이션을 초기 상태로 리셋
    animations.forEach((anim) => {
      anim.opacity.setValue(0);
      anim.translateY.setValue(30);
    });

    const animationsToRun = animations.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration,
          delay: startDelay + index * delay,
          easing: Easing.bezier(0.28, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration,
          delay: startDelay + index * delay,
          easing: Easing.bezier(0.28, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animationsToRun).start();
  }, [animations, delay, duration, startDelay, itemCount]);

  const getAnimatedStyle = (index: number) => {
    if (index >= animations.length) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }

    return {
      opacity: animations[index].opacity,
      transform: [{ translateY: animations[index].translateY }],
    };
  };

  return { getAnimatedStyle };
}

