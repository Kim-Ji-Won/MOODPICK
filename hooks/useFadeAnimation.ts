/**
 * 페이드 애니메이션 Hook
 */

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useFadeAnimation(trigger: boolean) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [trigger, fadeAnim]);

  return fadeAnim;
}

