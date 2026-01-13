/**
 * AI 채팅 카드 컴포넌트
 * 어두운 배경의 채팅 카드
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/design/tokens/colors';
import { typography } from '@/design/tokens/typography';
import { spacing } from '@/design/tokens/spacing';

interface ChatCardProps {
  onPress: () => void;
}

export function ChatCard({ onPress }: ChatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.title}>AI와 감정 채팅 나누기</Text>
      </View>
      <Text style={styles.subtitle}>더 깊은 대화가 필요하신가요?</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
    color: colors.text.inverse,
  },
  title: {
    ...typography.bodySmall,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.inverse,
    opacity: 0.8,
  },
});

