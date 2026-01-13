/**
 * 채팅 입력 컴포넌트
 */

import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/design/tokens/colors';
import { typography } from '@/design/tokens/typography';
import { spacing } from '@/design/tokens/spacing';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChangeText, onSend, loading = false, disabled = false }: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const canSend = value.trim() && !loading && !disabled;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0 },
      ]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor={colors.text.disabled}
          style={styles.input}
          multiline
          maxLength={500}
          onSubmitEditing={onSend}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          style={({ pressed }) => [
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
            pressed && styles.sendButtonPressed,
          ]}
        >
          <Text style={styles.sendButtonIcon}>✈️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundLight, // 흰색 배경
    borderWidth: 1,
    borderColor: colors.border, // 연한 회색 테두리
    borderRadius: 22,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    maxHeight: 100,
    minHeight: 44,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 44, // 원형 버튼
    height: 44,
    borderRadius: 22, // 완전한 원형
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#E8E8E8', // 연한 회색
  },
  sendButtonDisabled: {
    backgroundColor: '#E8E8E8', // 연한 회색
  },
  sendButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  sendButtonIcon: {
    fontSize: 20,
    color: colors.text.secondary,
  },
});

