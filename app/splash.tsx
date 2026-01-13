/**
 * 스플래시 화면 테스트 페이지
 */

import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SplashScreen } from '@/components/layout/SplashScreen';

export default function SplashTestScreen() {
  const router = useRouter();

  useEffect(() => {
    // 2초 후 메인 화면으로 이동
    const timer = setTimeout(() => {
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}

