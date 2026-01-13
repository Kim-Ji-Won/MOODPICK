/**
 * 감정 추천 로직 Hook
 * 기존 result.tsx의 로직을 hook으로 분리
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import type { AiResult } from '@/types/api';

export function useMoodRecommendation(text: string) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRecommendation = useCallback(async (inputText: string) => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      setLoading(true);
      setError('');

      if (!inputText || inputText.trim().length === 0) {
        throw new Error('입력한 내용이 없습니다.');
      }

      timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000);

      const res = await fetch(`${API_BASE_URL}/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
        signal: controller.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (!res.ok) {
        let msg = '';
        try {
          msg = await res.text();
          if (msg.includes('<h1>') || msg.includes('</h1>')) {
            msg = msg.replace(/<[^>]*>/g, '').trim();
          }
        } catch (e) {
          msg = '응답을 읽을 수 없습니다';
        }

        if (res.status === 408) {
          throw new Error(
            `요청 시간이 초과되었습니다 (408).\n\n가능한 원인:\n1. 백엔드 서버가 응답하는데 너무 오래 걸립니다\n2. 터널 서비스의 타임아웃이 짧게 설정되어 있습니다\n3. 백엔드 서버가 실행되지 않았거나 응답하지 않습니다\n\n해결 방법:\n1. 백엔드 서버가 정상적으로 실행 중인지 확인\n2. 서버 로그를 확인하여 응답 지연 원인 파악\n3. 터널을 재시작하거나 다른 터널 서비스 사용 고려`
          );
        }

        if (res.status === 503) {
          const isTunnelError =
            msg.toLowerCase().includes('no tunnel') ||
            msg.toLowerCase().includes('tunnel');
          const errorMsg = isTunnelError
            ? `터널 연결이 끊어졌습니다 (503).\n\n터널 서비스가 비활성화되었거나 연결이 끊어진 것 같아요.\n\n해결 방법:\n1. 터널 서비스를 다시 시작하세요\n2. 새로운 터널 URL을 발급받아 API 주소를 업데이트하세요\n3. 서버가 정상적으로 실행 중인지 확인하세요`
            : `서버가 일시적으로 사용할 수 없습니다 (503).\n\n가능한 원인:\n1. 터널 서비스가 비활성화되었을 수 있습니다\n2. 서버가 실행되지 않았을 수 있습니다\n3. 터널 연결이 끊어졌을 수 있습니다\n\n터널을 다시 시작하거나 서버 상태를 확인해주세요.`;
          throw new Error(errorMsg);
        }

        throw new Error(
          `API 오류 (${res.status}): ${msg || '서버에서 오류가 발생했습니다'}`
        );
      }

      const data = (await res.json()) as AiResult;

      if (!controller.signal.aborted) {
        setResult(data);
      }
    } catch (e: any) {
      if (!controller.signal.aborted) {
        let errorMessage = '알 수 없는 오류';

        if (e?.name === 'AbortError' || e?.message?.includes('Aborted')) {
          errorMessage =
            '서버 응답 시간이 초과되었습니다.\n\n확인 사항:\n1. 서버가 실행 중인지 확인\n2. 터널 서비스가 활성화되어 있는지 확인\n3. 네트워크 연결을 확인해주세요';
        } else if (
          e?.message?.includes('Network request failed') ||
          e?.message?.includes('Failed to fetch') ||
          e?.message?.includes('NetworkError')
        ) {
          errorMessage = `서버에 연결할 수 없습니다.\n\n확인 사항:\n1. 서버가 실행 중인지 확인\n2. 터널 서비스가 활성화되어 있는지 확인\n3. 터널 주소가 올바른지 확인 (현재: ${API_BASE_URL})`;
        } else if (e?.message?.includes('408')) {
          errorMessage = e.message;
        } else if (e?.message?.includes('503')) {
          errorMessage = e.message;
        } else if (e?.message) {
          errorMessage = e.message;
        }

        setError(errorMessage);
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchRecommendation(text);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [text, fetchRecommendation]);

  const refetch = useCallback(() => {
    fetchRecommendation(text);
  }, [text, fetchRecommendation]);

  return {
    loading,
    result,
    error,
    refetch,
  };
}

