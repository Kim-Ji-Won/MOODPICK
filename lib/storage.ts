/**
 * 감정 히스토리 저장소
 * AsyncStorage를 사용하여 로컬에 감정 기록 저장
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MoodEntry } from '@/types/history';

const STORAGE_KEY = '@moodpick_history';

/**
 * 모든 감정 기록 가져오기
 */
export async function getAllMoodEntries(): Promise<MoodEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('감정 기록 가져오기 실패:', error);
    return [];
  }
}

/**
 * 감정 기록 저장
 */
export async function saveMoodEntry(entry: MoodEntry): Promise<void> {
  try {
    const entries = await getAllMoodEntries();
    entries.push(entry);
    // 날짜순으로 정렬 (최신순)
    entries.sort((a, b) => b.timestamp - a.timestamp);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('감정 기록 저장 실패:', error);
  }
}

/**
 * 특정 날짜의 감정 기록 가져오기
 */
export async function getMoodEntriesByDate(date: string): Promise<MoodEntry[]> {
  try {
    const entries = await getAllMoodEntries();
    return entries.filter((entry) => entry.date === date);
  } catch (error) {
    console.error('날짜별 감정 기록 가져오기 실패:', error);
    return [];
  }
}

/**
 * 특정 기간의 감정 기록 가져오기
 */
export async function getMoodEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<MoodEntry[]> {
  try {
    const entries = await getAllMoodEntries();
    return entries.filter(
      (entry) => entry.date >= startDate && entry.date <= endDate
    );
  } catch (error) {
    console.error('기간별 감정 기록 가져오기 실패:', error);
    return [];
  }
}

/**
 * 감정 기록 삭제
 */
export async function deleteMoodEntry(id: string): Promise<void> {
  try {
    const entries = await getAllMoodEntries();
    const filtered = entries.filter((entry) => entry.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('감정 기록 삭제 실패:', error);
  }
}

/**
 * 모든 감정 기록 삭제
 */
export async function clearAllMoodEntries(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('모든 감정 기록 삭제 실패:', error);
  }
}

