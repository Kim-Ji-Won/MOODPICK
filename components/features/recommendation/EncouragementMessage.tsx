/**
 * 위로 메시지 컴포넌트
 */

import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EncouragementMessageProps {
  message?: string; // AI가 생성한 메시지
}

export function EncouragementMessage({ message }: EncouragementMessageProps) {
  // AI 메시지가 있으면 사용, 없으면 기본 메시지
  const defaultMessage = "괜찮아요, 이 순간도 지나갈 거예요. 당신은 충분히 잘하고 있어요.";
  const displayMessage = message || defaultMessage;

  // 문장 끝(마침표, 느낌표, 물음표)을 기준으로 줄바꿈
  const formatMessage = (text: string): string[] => {
    // 먼저 기존 줄바꿈(\n) 처리
    const lines = text.split('\n');
    
    // 각 줄에서 문장 끝을 기준으로 분리
    const sentences: string[] = [];
    lines.forEach(line => {
      // 문장 끝 패턴: 마침표, 느낌표, 물음표 뒤에 공백 또는 끝
      const sentenceEndRegex = /([.!?])\s+/g;
      const parts = line.split(sentenceEndRegex);
      
      let currentSentence = '';
      for (let i = 0; i < parts.length; i++) {
        currentSentence += parts[i];
        // 문장 끝 문자를 만나면 문장 완성
        if (i < parts.length - 1 && /[.!?]/.test(parts[i])) {
          sentences.push(currentSentence.trim());
          currentSentence = '';
        }
      }
      // 남은 텍스트가 있으면 추가
      if (currentSentence.trim()) {
        sentences.push(currentSentence.trim());
      }
    });
    
    return sentences.filter(s => s.length > 0);
  };

  const formattedLines = formatMessage(displayMessage);

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.textContainer}>
        {formattedLines.map((line, index) => (
          <Text key={index} style={styles.text}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // 세로선과 텍스트를 중앙 정렬
    marginBottom: spacing.huge, // 하단 여백 더 증가 (기존: spacing.xxl)
  },
  line: {
    width: 3, // 두께는 원래대로
    backgroundColor: colors.text.primary,
    marginRight: spacing.md,
    minHeight: 74, // 세로선 높이 조금 더 증가 (기존: 60)
  },
  textContainer: {
    flex: 1,
  },
  text: {
    ...typography.bodyLarge,
    fontSize: 20, // 폰트 크기 증가
    color: colors.text.primary,
    lineHeight: 28, // 줄 간격도 조정
    marginBottom: spacing.xs,
    fontWeight: '500', // 시프트 느낌을 위한 약간의 굵기
  },
});

