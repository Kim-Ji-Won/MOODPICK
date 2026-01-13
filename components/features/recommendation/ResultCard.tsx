/**
 * 결과 카드 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/design/tokens/colors';
import { typography } from '@/design/tokens/typography';
import { spacing } from '@/design/tokens/spacing';
import type { AiResult } from '@/types/api';

interface ResultCardProps {
  result: AiResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>📄</Text>
        <Text style={styles.title}>AI 한줄평</Text>
      </View>
      {result.result ? (
        <Text style={styles.content}>{result.result}</Text>
      ) : (
        <>
          {result.choice && <Text style={styles.choice}>{result.choice}</Text>}
          {result.reason && <Text style={styles.reason}>{result.reason}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F0F0', // 조금 더 진한 회색
    borderRadius: 12,
    padding: spacing.xl,
    marginBottom: spacing.lg,
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
  content: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  icon: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  choice: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  reason: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});

