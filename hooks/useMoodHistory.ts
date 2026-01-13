/**
 * 감정 히스토리 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAllMoodEntries,
  saveMoodEntry,
  getMoodEntriesByDateRange,
  deleteMoodEntry,
} from '@/lib/storage';
import type { MoodEntry, MoodKeyword } from '@/types/history';

export function useMoodHistory() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 모든 기록 불러오기
  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllMoodEntries();
      setEntries(data);
    } catch (error) {
      console.error('기록 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 기록 저장
  const addEntry = useCallback(
    async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
      try {
        const newEntry: MoodEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };
        await saveMoodEntry(newEntry);
        await loadEntries();
        return newEntry;
      } catch (error) {
        console.error('기록 저장 실패:', error);
        throw error;
      }
    },
    [loadEntries]
  );

  // 기록 삭제
  const removeEntry = useCallback(
    async (id: string) => {
      try {
        await deleteMoodEntry(id);
        await loadEntries();
      } catch (error) {
        console.error('기록 삭제 실패:', error);
        throw error;
      }
    },
    [loadEntries]
  );

  // 특정 기간 기록 가져오기
  const getEntriesByDateRange = useCallback(
    async (startDate: string, endDate: string) => {
      try {
        return await getMoodEntriesByDateRange(startDate, endDate);
      } catch (error) {
        console.error('기간별 기록 가져오기 실패:', error);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return {
    entries,
    loading,
    loadEntries,
    addEntry,
    removeEntry,
    getEntriesByDateRange,
  };
}

/**
 * 감정 키워드 분석
 */
export function analyzeMoodKeywords(entries: MoodEntry[]): MoodKeyword[] {
  const keywordMap = new Map<string, number>();
  const commonWords = new Set([
    '은', '는', '이', '가', '을', '를', '의', '에', '에서', '와', '과', '도', '로', '으로',
    '그', '이', '저', '그것', '이것', '저것', '그런', '이런', '저런',
    '있다', '없다', '하다', '되다', '이다', '아니다',
    '오늘', '어제', '내일', '지금', '그때', '언제',
    '너무', '많이', '조금', '좀', '정말', '진짜', '완전',
  ]);

  // 모든 텍스트에서 키워드 추출
  entries.forEach((entry) => {
    const words = entry.text
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 1 && !commonWords.has(word));

    words.forEach((word) => {
      keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
    });
  });

  // 빈도순으로 정렬
  const keywords: MoodKeyword[] = Array.from(keywordMap.entries())
    .map(([keyword, count]) => ({
      keyword,
      count,
      frequency: count / entries.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 상위 10개만

  return keywords;
}

