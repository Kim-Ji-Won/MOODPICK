/**
 * 감정 히스토리 타입 정의
 */

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD 형식
  timestamp: number; // Unix timestamp
  text: string; // 사용자가 입력한 감정 텍스트
  result?: string; // AI 추천 메시지
  song?: {
    title: string;
    artist: string;
    reason?: string;
  };
  scent?: {
    name: string;
    reason?: string;
  };
  moodScore?: number; // -1 (매우 나쁨) ~ 1 (매우 좋음), 저장 시 계산
}

export interface WeeklySummary {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  entries: MoodEntry[];
  averageMood?: number; // 0-100 점수 (나중에 감정 분석 추가 시)
}

export interface MoodKeyword {
  keyword: string;
  count: number;
  frequency: number; // 0-1 사이 값
}

