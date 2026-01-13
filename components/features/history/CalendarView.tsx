/**
 * 캘린더 뷰 컴포넌트
 * 감정 기록이 있는 날짜를 표시
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { MoodEntry } from '@/types/history';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';

interface CalendarViewProps {
  entries: MoodEntry[];
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

export function CalendarView({
  entries,
  selectedDate,
  onDateSelect,
}: CalendarViewProps) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // 이번 달의 날짜별 기록 수
  const dateEntryCount = useMemo(() => {
    const count: Record<string, number> = {};
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      if (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      ) {
        count[entry.date] = (count[entry.date] || 0) + 1;
      }
    });
    return count;
  }, [entries, currentMonth, currentYear]);

  // 이번 달의 첫 날과 마지막 날
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 날짜 배열 생성
  const days = useMemo(() => {
    const daysArray: (number | null)[] = [];
    // 빈 칸 추가 (첫 날 전)
    for (let i = 0; i < startingDayOfWeek; i++) {
      daysArray.push(null);
    }
    // 날짜 추가
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  }, [startingDayOfWeek, daysInMonth]);

  const formatDate = (day: number): string => {
    // 로컬 날짜를 직접 포맷하여 타임존 문제 방지
    const year = currentYear;
    const month = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day: number): boolean => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return formatDate(day) === selectedDate;
  };

  const hasEntries = (day: number): boolean => {
    const dateStr = formatDate(day);
    return !!dateEntryCount[dateStr];
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <View style={styles.container}>
      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* 캘린더 그리드 */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={index} style={styles.dayCell} />;
          }

          const dateStr = formatDate(day);
          const entryCount = dateEntryCount[dateStr] || 0;
          const isSelectedDay = isSelected(day);
          const isTodayDay = isToday(day);
          const hasEntry = hasEntries(day);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isSelectedDay && styles.selectedDay,
                isTodayDay && styles.todayDay,
              ]}
              onPress={() => {
                if (isSelectedDay) {
                  onDateSelect(null);
                } else {
                  onDateSelect(dateStr);
                }
              }}
            >
              <View style={styles.dayContent}>
                {hasEntry && (
                  <View style={styles.entryIndicator}>
                    <Text style={styles.entryCount}>{entryCount}</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.dayText,
                    isSelectedDay && styles.selectedDayText,
                    isTodayDay && !isSelectedDay && styles.todayDayText,
                    hasEntry && styles.hasEntryText,
                  ]}
                >
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: spacing.lg,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    justifyContent: 'space-between',
  },
  weekDay: {
    width: '14.28%',
    alignItems: 'center',
  },
  weekDayText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  dayContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayText: {
    ...typography.caption,
    color: colors.text.primary,
  },
  selectedDayText: {
    color: colors.text.inverse,
    fontWeight: '700',
  },
  todayDayText: {
    color: colors.primary,
    fontWeight: '700',
  },
  hasEntryText: {
    fontWeight: '600',
  },
  entryIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    zIndex: 1,
  },
  entryCount: {
    ...typography.captionSmall,
    color: colors.text.inverse,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
});

