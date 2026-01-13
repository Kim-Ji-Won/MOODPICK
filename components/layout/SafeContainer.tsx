/**
 * SafeArea 래퍼 컴포넌트
 */

import { colors } from '@/design/tokens/colors';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

export function SafeContainer({ 
  children, 
  style, 
  edges, 
  backgroundColor = colors.background, 
}: SafeContainerProps) {
  return (
    <SafeAreaView 
      style={[styles.container, {backgroundColor}, style]} 
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

