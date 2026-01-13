/**
 * 감정 히스토리 & 타임라인 화면
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeContainer } from '@/components/layout/SafeContainer';
import { useMoodHistory, analyzeMoodKeywords } from '@/hooks/useMoodHistory';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';
import { CalendarView } from '@/components/features/history/CalendarView';
import { TimelineCard } from '@/components/features/history/TimelineCard';
import { WeeklySummaryChart } from '@/components/features/history/WeeklySummaryChart';
import { MoodKeywords } from '@/components/features/history/MoodKeywords';
import { RippleLoading } from '@/components/ui/RippleLoading';

export default function HistoryScreen() {
  const { entries, loading } = useMoodHistory();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 날짜 표시 포맷 (YYYY-MM-DD -> M월 D일)
  const formatDisplayDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${parseInt(month)}월 ${parseInt(day)}일 기록`;
  };

  // 이번 주 기록
  const thisWeekEntries = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // 이번 주 일요일
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // 이번 주 토요일

    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];

    return entries.filter(
      (entry) => entry.date >= startStr && entry.date <= endStr
    );
  }, [entries]);

  // 선택된 날짜의 기록
  const selectedDateEntries = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter((entry) => entry.date === selectedDate);
  }, [entries, selectedDate]);

  // 감정 키워드 분석
  const keywords = useMemo(() => {
    return analyzeMoodKeywords(entries);
  }, [entries]);

  if (loading) {
    return (
      <SafeContainer style={{ backgroundColor: colors.backgroundLight }}>
        <RippleLoading loading={loading} message="기록을 불러오는 중..." />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer style={{ backgroundColor: colors.backgroundLight }}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>감정 히스토리</Text>
          <Text style={styles.subtitle}>나의 감정 기록을 확인해보세요</Text>
        </View>

        {/* 이번 주 요약 */}
        {thisWeekEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이번 주 감정 요약</Text>
            <WeeklySummaryChart entries={thisWeekEntries} />
          </View>
        )}

        {/* 자주 나오는 감정 키워드 */}
        {keywords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>자주 나오는 감정 키워드</Text>
            <MoodKeywords keywords={keywords} />
          </View>
        )}

        {/* 캘린더 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>캘린더</Text>
          <CalendarView
            entries={entries}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </View>

        {/* 타임라인 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedDate ? formatDisplayDate(selectedDate) : '최근 기록'}
          </Text>
          {selectedDate ? (
            // 날짜가 선택된 경우
            selectedDateEntries.length > 0 ? (
              selectedDateEntries.map((entry) => (
                <TimelineCard key={entry.id} entry={entry} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>이 날짜에는 기록이 없어요</Text>
                <Text style={styles.emptySubtext}>
                  감정을 입력하면 여기에 기록됩니다
                </Text>
              </View>
            )
          ) : (
            // 날짜가 선택되지 않은 경우 - 최근 기록 표시
            entries.length > 0 ? (
              entries.slice(0, 10).map((entry) => (
                <TimelineCard key={entry.id} entry={entry} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>아직 기록이 없어요</Text>
                <Text style={styles.emptySubtext}>
                  감정을 입력하면 여기에 기록됩니다
                </Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    fontSize: 32,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});

