/**
 * 타임라인 카드 컴포넌트
 * 개별 감정 기록을 카드 형태로 표시
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { MoodEntry } from '@/types/history';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';

interface TimelineCardProps {
  entry: MoodEntry;
  onPress?: () => void;
}

export function TimelineCard({ entry, onPress }: TimelineCardProps) {
  const date = new Date(entry.date);
  const time = new Date(entry.timestamp);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
  const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const CardContent = (
    <View style={styles.card}>
      {/* 날짜/시간 헤더 */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{dateStr}</Text>
        <Text style={styles.timeText}>{timeStr}</Text>
      </View>

      {/* 감정 텍스트 */}
      <Text style={styles.moodText} numberOfLines={2}>
        {entry.text}
      </Text>

      {/* AI 추천 메시지 (있는 경우) */}
      {entry.result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>AI 위로</Text>
          <Text style={styles.resultText} numberOfLines={2}>
            {entry.result}
          </Text>
        </View>
      )}

      {/* 노래/향 정보 (있는 경우) */}
      {(entry.song || entry.scent) && (
        <View style={styles.recommendations}>
          {entry.song && (
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationEmoji}>🎵</Text>
              <Text style={styles.recommendationText} numberOfLines={1}>
                {entry.song.title} - {entry.song.artist}
              </Text>
            </View>
          )}
          {entry.scent && (
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationEmoji}>🌸</Text>
              <Text style={styles.recommendationText} numberOfLines={1}>
                {entry.scent.name}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  timeText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  moodText: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  resultContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resultLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  resultText: {
    ...typography.caption,
    color: colors.text.tertiary,
    lineHeight: 18,
  },
  recommendations: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  recommendationEmoji: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  recommendationText: {
    ...typography.captionSmall,
    color: colors.text.secondary,
  },
});

