/**
 * 채팅 로직 Hook
 * 기존 chat.tsx의 로직을 hook으로 분리
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView } from 'react-native';
import { API_BASE_URL } from '@/lib/api';
import type { ChatMessage } from '@/types/api';

export function useChat(originalMood: string) {
  // 초기 AI 메시지 (사용자가 입력한 감정을 포함)
  const initialMessage = originalMood.trim()
    ? `"${originalMood}"라고 느끼시는군요. 더 자세히 이야기해주시겠어요?`
    : '무슨 감정을 느끼는지 얘기해줄 수 있어';
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: initialMessage }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // AI 채팅 전송
  const sendChatMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || chatLoading) return;

      const userMessage = message.trim();
      setChatInput('');
      setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
      setChatLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: originalMood, // 원본 감정 입력
            message: userMessage, // 사용자 메시지
            history: chatMessages, // 대화 기록
          }),
        });

        if (!res.ok) {
          throw new Error('채팅 응답을 받을 수 없습니다');
        }

        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
      } catch (e: any) {
        console.error('채팅 오류:', e);
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            content: '죄송해요, 응답을 생성하는데 문제가 생겼어요. 다시 시도해주세요.',
          },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [originalMood, chatMessages, chatLoading]
  );

  // 채팅 스크롤 자동 이동
  useEffect(() => {
    if (chatMessages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  // 키보드가 올라올 때 스크롤 자동 이동
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardWillShow.remove();
    };
  }, []);

  return {
    chatMessages,
    chatInput,
    setChatInput,
    chatLoading,
    sendChatMessage,
    scrollViewRef,
  };
}

