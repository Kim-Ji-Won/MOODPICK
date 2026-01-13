# 폴더 구조 가이드

피그마 디자인을 적용하면서 기존 로직을 유지하기 위한 권장 폴더 구조입니다.

## 📁 권장 폴더 구조

```
moodpick-app/
├── app/                          # 화면 (라우팅)
│   ├── _layout.tsx              # 루트 레이아웃
│   ├── index.tsx                # 메인 입력 화면
│   ├── result.tsx                # 결과 화면
│   ├── chat.tsx                  # 채팅 화면
│   └── (tabs)/                   # 탭 네비게이션 (필요시)
│
├── components/                    # 재사용 가능한 컴포넌트
│   ├── ui/                       # 기본 UI 컴포넌트 (피그마 디자인 기반)
│   │   ├── Button.tsx            # 버튼 컴포넌트
│   │   ├── Input.tsx             # 입력 필드 컴포넌트
│   │   ├── Card.tsx               # 카드 컴포넌트
│   │   ├── Header.tsx             # 헤더 컴포넌트
│   │   ├── LoadingSpinner.tsx     # 로딩 컴포넌트
│   │   └── MessageBubble.tsx      # 메시지 버블 (채팅용)
│   │
│   ├── features/                 # 기능별 컴포넌트
│   │   ├── mood/                 # 감정 관련 컴포넌트
│   │   │   ├── MoodInput.tsx     # 감정 입력 컴포넌트
│   │   │   └── MoodCard.tsx      # 감정 카드 컴포넌트
│   │   │
│   │   ├── recommendation/       # 추천 관련 컴포넌트
│   │   │   ├── ResultCard.tsx    # 결과 카드
│   │   │   ├── SongCard.tsx      # 노래 추천 카드
│   │   │   └── ScentCard.tsx     # 향 추천 카드
│   │   │
│   │   └── chat/                 # 채팅 관련 컴포넌트
│   │       ├── ChatMessage.tsx   # 채팅 메시지
│   │       └── ChatInput.tsx     # 채팅 입력
│   │
│   └── layout/                   # 레이아웃 컴포넌트
│       ├── SafeContainer.tsx     # SafeArea 래퍼
│       └── KeyboardAvoidingContainer.tsx
│
├── design/                       # 디자인 시스템 (피그마 기반)
│   ├── tokens/                   # 디자인 토큰
│   │   ├── colors.ts             # 색상 팔레트
│   │   ├── typography.ts         # 타이포그래피
│   │   ├── spacing.ts            # 간격
│   │   ├── shadows.ts            # 그림자
│   │   └── borderRadius.ts      # 둥근 모서리
│   │
│   ├── theme/                    # 테마 설정
│   │   ├── light.ts              # 라이트 테마
│   │   ├── dark.ts               # 다크 테마 (선택)
│   │   └── index.ts              # 테마 통합
│   │
│   └── assets/                   # 디자인 에셋
│       ├── icons/                # 아이콘
│       └── images/                # 이미지
│
├── hooks/                        # 커스텀 훅 (로직)
│   ├── useMoodRecommendation.ts  # 추천 로직
│   ├── useChat.ts                # 채팅 로직
│   └── useApi.ts                 # API 호출 로직
│
├── lib/                          # 유틸리티 & 서비스
│   ├── api.ts                    # API 클라이언트 (기존 유지)
│   ├── storage.ts                # 로컬 스토리지 (필요시)
│   └── utils.ts                   # 유틸리티 함수
│
├── constants/                    # 상수
│   ├── config.ts                 # 앱 설정
│   └── routes.ts                 # 라우트 상수
│
└── types/                        # TypeScript 타입
    ├── api.ts                    # API 타입
    ├── mood.ts                   # 감정 관련 타입
    └── chat.ts                   # 채팅 관련 타입
```

## 🎨 디자인 시스템 적용 방법

### 1. 디자인 토큰 생성 (`design/tokens/`)

피그마에서 추출한 디자인 토큰을 코드로 변환:

```typescript
// design/tokens/colors.ts
export const colors = {
  primary: '#FFB6C1',
  secondary: '#E8F4F8',
  background: '#FAF9F6',
  text: {
    primary: '#2D2D2D',
    secondary: '#666',
    tertiary: '#888',
  },
  // ... 피그마 색상 팔레트
};

// design/tokens/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: '800' },
  h2: { fontSize: 24, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24 },
  // ... 피그마 타이포그래피
};

// design/tokens/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  // ... 피그마 간격 시스템
};
```

### 2. UI 컴포넌트 생성 (`components/ui/`)

피그마 디자인을 기반으로 재사용 가능한 컴포넌트 생성:

```typescript
// components/ui/Button.tsx
import { colors, spacing, typography } from '@/design/tokens';
import { Pressable, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      style={[styles.button, variant === 'primary' ? styles.primary : styles.secondary]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    // 피그마 디자인 적용
  },
  // ...
});
```

### 3. 화면에서 컴포넌트 사용 (`app/`)

기존 로직은 유지하고 UI만 교체:

```typescript
// app/result.tsx (기존 로직 유지)
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/features/recommendation/ResultCard';
import { useMoodRecommendation } from '@/hooks/useMoodRecommendation';

export default function ResultScreen() {
  // 기존 로직 그대로 유지
  const { loading, result, error, fetchRecommendation } = useMoodRecommendation();
  
  return (
    <SafeContainer>
      {/* 피그마 디자인 컴포넌트 사용 */}
      <ResultCard result={result} />
      <Button title="다시 추천받기" onPress={handleRetry} />
    </SafeContainer>
  );
}
```

## 🔄 마이그레이션 전략

### 단계별 적용

1. **1단계: 디자인 토큰 생성**
   - 피그마에서 색상, 타이포그래피, 간격 추출
   - `design/tokens/` 폴더에 토큰 파일 생성

2. **2단계: 기본 UI 컴포넌트 생성**
   - Button, Input, Card 등 기본 컴포넌트 생성
   - 피그마 디자인 스타일 적용

3. **3단계: 기능별 컴포넌트 생성**
   - ResultCard, SongCard 등 기능별 컴포넌트 생성
   - 기존 로직은 hooks로 분리

4. **4단계: 화면 리팩토링**
   - 화면 파일에서 UI 컴포넌트로 교체
   - 로직은 hooks로 분리하여 유지

## 📝 예시 파일 구조

### hooks/useMoodRecommendation.ts
```typescript
// 기존 result.tsx의 로직을 hook으로 분리
export function useMoodRecommendation(text: string) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string>("");
  
  // 기존 fetchRecommendation 로직 그대로
  // ...
  
  return { loading, result, error, refetch };
}
```

### components/features/recommendation/ResultCard.tsx
```typescript
// 피그마 디자인 적용
import { Card } from '@/components/ui/Card';
import { colors, typography } from '@/design/tokens';

export function ResultCard({ result }: { result: AiResult }) {
  return (
    <Card>
      {/* 피그마 디자인 스타일 적용 */}
    </Card>
  );
}
```

## ✅ 장점

1. **로직과 UI 분리**: 비즈니스 로직은 hooks에, UI는 components에
2. **재사용성**: 공통 컴포넌트를 여러 화면에서 사용
3. **유지보수성**: 디자인 변경 시 토큰만 수정
4. **확장성**: 새로운 기능 추가 시 구조가 명확
5. **피그마 연동**: 디자인 토큰을 코드로 쉽게 변환

## 🚀 시작하기

1. `design/tokens/` 폴더 생성 및 토큰 파일 작성
2. `components/ui/` 기본 컴포넌트 생성
3. 기존 화면에서 점진적으로 교체

