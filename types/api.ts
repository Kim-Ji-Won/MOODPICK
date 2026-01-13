/**
 * API 관련 타입 정의
 */

export type AiResult = {
  result: string;
  choice?: string; // 하위 호환성을 위해 유지
  reason?: string; // 하위 호환성을 위해 유지
  song?: {
    title: string;
    artist: string;
    reason?: string;
  };
  scent?: {
    name: string;
    reason?: string;
  };
  _raw?: string;
};

export type ChatMessage = {
  role: "user" | "ai";
  content: string;
};

export type ChatRequest = {
  text: string; // 원본 감정 입력
  message: string; // 사용자 메시지
  history: ChatMessage[]; // 대화 기록
};

export type ChatResponse = {
  response: string;
};

