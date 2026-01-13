import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { Easing, Animated } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SplashScreen } from '@/components/layout/SplashScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 앱 시작 시 스플래시 화면 표시
    const timer = setTimeout(() => {
      // 페이드 아웃 애니메이션
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start(() => {
        setIsSplashVisible(false);
      });
    }, 2000); // 2초

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  // 스플래시 화면 표시 중이면 스플래시만 보여줌
  if (isSplashVisible) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SplashScreen />
        <StatusBar style="auto" />
      </Animated.View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          animationDuration: 500,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 500,
                easing: Easing.bezier(0.28, 0, 0.2, 1), // Material Design easing
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 400,
                easing: Easing.bezier(0.4, 0, 0.2, 1), // Material Design easing
              },
            },
          },
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                  {
                    scale: next
                      ? next.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.95],
                        })
                      : 1,
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.3, 0.5, 0.7, 1],
                  outputRange: [0, 0.5, 0.75, 0.9, 1],
                }),
              },
            };
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="chat" 
          options={{ 
            headerShown: true, 
            title: 'chat',
          }} 
        />
        <Stack.Screen 
          name="result" 
          options={{ 
            headerShown: true, 
            title: 'result',
          }} 
        />
        <Stack.Screen 
          name="history" 
          options={{ 
            headerShown: true, 
            title: 'history',
          }} 
        />
        <Stack.Screen 
          name="splash" 
          options={{ 
            headerShown: false,
            animation: 'fade',
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 600,
                  easing: Easing.bezier(0.28, 0, 0.2, 1),
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 300,
                  easing: Easing.bezier(0.4, 0, 0.2, 1),
                },
              },
            },
            cardStyleInterpolator: ({ current }) => {
              return {
                cardStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              };
            },
          }} 
        />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal', 
            title: 'Modal',
            animation: 'slide_from_bottom',
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                  easing: Easing.bezier(0.28, 0, 0.2, 1),
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 400,
                  easing: Easing.bezier(0.4, 0, 0.2, 1),
                },
              },
            },
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
