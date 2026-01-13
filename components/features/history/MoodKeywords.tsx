/**
 * 감정 키워드 컴포넌트
 * 자주 나오는 감정 키워드를 태그 형태로 표시
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MoodKeyword } from '@/types/history';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';

interface MoodKeywordsProps {
  keywords: MoodKeyword[];
}

export function MoodKeywords({ keywords }: MoodKeywordsProps) {
  if (keywords.length === 0) {
    return null;
  }

  // 빈도에 따라 색상 결정
  const getKeywordStyle = (frequency: number) => {
    if (frequency >= 0.5) {
      return { backgroundColor: colors.primary, color: colors.text.inverse };
    } else if (frequency >= 0.3) {
      return { backgroundColor: colors.primaryLight, color: colors.text.primary };
    } else {
      return { backgroundColor: colors.border, color: colors.text.secondary };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.keywordsContainer}>
        {keywords.map((keyword, index) => {
          const keywordStyle = getKeywordStyle(keyword.frequency);
          return (
            <View
              key={index}
              style={[styles.keywordTag, { backgroundColor: keywordStyle.backgroundColor }]}
            >
              <Text
                style={[
                  styles.keywordText,
                  { color: keywordStyle.color },
                ]}
              >
                {keyword.keyword} ({keyword.count})
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: spacing.lg,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  keywordTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  keywordText: {
    ...typography.caption,
    fontWeight: '600',
  },
});

