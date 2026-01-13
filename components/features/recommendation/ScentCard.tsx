/**
 * 향 추천 카드 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/design/tokens/colors';
import { typography } from '@/design/tokens/typography';
import { spacing } from '@/design/tokens/spacing';
import type { AiResult } from '@/types/api';

interface ScentCardProps {
  scent: NonNullable<AiResult['scent']>;
}

export function ScentCard({ scent }: ScentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🌸</Text>
        <Text style={styles.title}>오늘의 향</Text>
      </View>
      <View>
        <Text style={styles.scentName}>{scent.name}</Text>
        {scent.reason && <Text style={styles.reason}>{scent.reason}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F0F0', // 조금 더 진한 회색
    borderRadius: 12,
    padding: spacing.xl,
    marginBottom: spacing.xl, // 간격 증가 (기존: spacing.lg)
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 16,
    marginRight: spacing.sm,
    color: colors.text.secondary,
  },
  title: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  scentName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  reason: {
    ...typography.caption,
    color: colors.text.tertiary,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
});

