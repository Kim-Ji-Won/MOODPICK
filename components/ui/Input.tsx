/**
 * Input 컴포넌트
 * 재사용 가능한 입력 필드
 */

import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  tip?: string;
  error?: string;
}

export function Input({ label, tip, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.emoji}>💭</Text>
        </View>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.text.disabled}
        {...props}
      />
      {tip && !error && <Text style={styles.tip}>{tip}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  emoji: {
    fontSize: 20,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1, // 테두리 두께 (기존: 2)
    borderColor: colors.border, // 테두리 색상 (더 연한 색상)
    borderRadius: 10,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    ...typography.body,
    color: colors.text.primary,
    minHeight: 170, // 높이 (기존: 100)
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  tip: {
    ...typography.captionSmall,
    color: colors.text.tertiary,
    lineHeight: 18,
    paddingLeft: spacing.xs,
    marginTop: spacing.md, // 간격 증가 (기존: spacing.xs)
  },
  error: {
    ...typography.captionSmall,
    color: colors.error,
    marginTop: spacing.xs,
    paddingLeft: spacing.xs,
  },
});

