/**
 * 로딩 애니메이션 Hook
 * 이모지 순환 애니메이션 로직
 */

import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const loadingEmojis = ['😊', '🤔', '💭', '✨', '😌', '🤗', '💫', '🌟'];

export function useLoadingAnimation(loading: boolean) {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const emojiFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        // 페이드 아웃 → 이모지 변경 → 페이드 인
        Animated.sequence([
          Animated.timing(emojiFadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // 페이드 아웃 완료 후 이모지 변경
          setCurrentEmojiIndex((prev) => (prev + 1) % loadingEmojis.length);
          // 페이드 인 시작
          Animated.timing(emojiFadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
        });
      }, 500); // 0.5초마다 이모지 변경

      return () => clearInterval(interval);
    } else {
      setCurrentEmojiIndex(0); // 로딩 끝나면 초기화
      emojiFadeAnim.setValue(1);
    }
  }, [loading, emojiFadeAnim]);

  return {
    currentEmoji: loadingEmojis[currentEmojiIndex],
    emojiFadeAnim,
  };
}

