/**
 * 채팅 메시지 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/design/tokens/colors';
import { typography } from '@/design/tokens/typography';
import { spacing } from '@/design/tokens/spacing';
import type { ChatMessage as ChatMessageType } from '@/types/api';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={[styles.text, isUser && styles.userText]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#2D2D2D', // 어두운 회색/검정
  },
  aiBubble: {
    backgroundColor: '#F5F5F5', // 연한 회색
  },
  text: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  userText: {
    color: colors.text.inverse, // 흰색 텍스트
  },
});

