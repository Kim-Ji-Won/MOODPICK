/**
 * 주간 감정 요약 그래프 컴포넌트
 * 부드러운 선 그래프로 표시 (기분 좋을 때 위로, 나쁠 때 아래로)
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import type { MoodEntry } from '@/types/history';
import { colors } from '@/design/tokens/colors';
import { spacing } from '@/design/tokens/spacing';
import { typography } from '@/design/tokens/typography';

interface WeeklySummaryChartProps {
  entries: MoodEntry[];
}

export function WeeklySummaryChart({ entries }: WeeklySummaryChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = spacing.xxl * 2; // 좌우 패딩
  const chartWidth = screenWidth - containerPadding;
  const chartHeight = 120;
  const padding = spacing.md;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2 - 30; // 하단 라벨 공간

  // 요일별 평균 감정 점수 계산 (-1 ~ 1)
  const dayScores = useMemo(() => {
    const scores: Record<string, number[]> = {
      일: [],
      월: [],
      화: [],
      수: [],
      목: [],
      금: [],
      토: [],
    };

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const dayIndex = date.getDay();
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = dayNames[dayIndex];
      
      // moodScore가 있으면 사용, 없으면 0 (중립)
      const score = entry.moodScore ?? 0;
      scores[dayName].push(score);
    });

    // 각 요일의 평균 점수 계산
    const averages: Record<string, number> = {};
    Object.keys(scores).forEach((day) => {
      if (scores[day].length > 0) {
        averages[day] = scores[day].reduce((a, b) => a + b, 0) / scores[day].length;
      } else {
        averages[day] = 0; // 기록이 없으면 0 (중립선)
      }
    });

    return averages;
  }, [entries]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  
  // 최대/최소 점수 (그래프 스케일링용)
  const maxScore = Math.max(...Object.values(dayScores).map(Math.abs), 1);
  
  // 좌표 계산 (0이 중간선, 양수는 위로, 음수는 아래로)
  const points = weekDays.map((day, index) => {
    const score = dayScores[day];
    const x = padding + (index / (weekDays.length - 1)) * graphWidth;
    // 0이 중간, 양수는 위로, 음수는 아래로
    const y = padding + graphHeight / 2 - (score / maxScore) * (graphHeight / 2);
    return { x, y, score, day };
  });

  // 부드러운 곡선 경로 생성 (Cubic Bezier)
  const createSmoothPath = () => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const prev = i > 0 ? points[i - 1] : current;
      const after = i < points.length - 2 ? points[i + 2] : next;
      
      // 제어점 계산 (부드러운 곡선을 위한)
      // 현재 점과 다음 점 사이의 중간점을 제어점으로 사용
      const cp1X = current.x + (next.x - prev.x) * 0.2;
      const cp1Y = current.y + (next.y - prev.y) * 0.2;
      const cp2X = next.x - (after.x - current.x) * 0.2;
      const cp2Y = next.y - (after.y - current.y) * 0.2;
      
      // 마지막 점이면 단순 선으로
      if (i === points.length - 2) {
        path += ` C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${next.x} ${next.y}`;
      } else {
        path += ` C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${next.x} ${next.y}`;
      }
    }

    return path;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg 
          width={chartWidth} 
          height={chartHeight} 
          style={styles.svg}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 중간선 (0 기준선) */}
          <Path
            d={`M ${padding} ${padding + graphHeight / 2} L ${padding + graphWidth} ${padding + graphHeight / 2}`}
            stroke={colors.border}
            strokeWidth={1}
            strokeDasharray="4,4"
            opacity={0.5}
          />

          {/* 부드러운 선 그래프 */}
          <Path
            d={createSmoothPath()}
            fill="none"
            stroke={colors.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 데이터 포인트 */}
          {points.map((point, index) => {
            // score가 0이 아니면 포인트 표시
            if (Math.abs(point.score) < 0.01) return null;
            
            return (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={colors.primary}
                stroke={colors.backgroundLight}
                strokeWidth={2}
              />
            );
          })}
        </Svg>

        {/* 요일 라벨 */}
        <View style={styles.labelsContainer}>
          {points.map((point, index) => {
            const hasEntry = entries.some((entry) => {
              const date = new Date(entry.date);
              const dayIndex = date.getDay();
              return dayIndex === index;
            });

            return (
              <View key={index} style={styles.labelItem}>
                <Text style={styles.dayLabel}>{point.day}</Text>
                {hasEntry && (
                  <Text style={[
                    styles.scoreLabel,
                    point.score > 0 && styles.positiveScore,
                    point.score < 0 && styles.negativeScore,
                  ]}>
                    {point.score > 0 ? '↑' : point.score < 0 ? '↓' : '—'}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
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
  chartContainer: {
    alignItems: 'center',
  },
  svg: {
    marginBottom: spacing.md,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  labelItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    ...typography.captionSmall,
    color: colors.text.secondary,
  },
  scoreLabel: {
    ...typography.captionSmall,
    fontWeight: '600',
    marginTop: 2,
  },
  positiveScore: {
    color: colors.primary,
  },
  negativeScore: {
    color: colors.error,
  },
});
