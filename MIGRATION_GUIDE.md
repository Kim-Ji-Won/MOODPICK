# 피그마 디자인 적용 마이그레이션 가이드

## 📋 체크리스트

### 1단계: 디자인 토큰 설정 ✅
- [x] `design/tokens/colors.ts` - 색상 팔레트 정의
- [x] `design/tokens/typography.ts` - 타이포그래피 시스템 정의
- [x] `design/tokens/spacing.ts` - 간격 시스템 정의
- [ ] 피그마에서 실제 색상/폰트 값으로 업데이트

### 2단계: 기본 UI 컴포넌트 생성
- [x] `components/ui/Button.tsx` - 버튼 컴포넌트
- [ ] `components/ui/Input.tsx` - 입력 필드 컴포넌트
- [ ] `components/ui/Card.tsx` - 카드 컴포넌트
- [ ] `components/ui/Header.tsx` - 헤더 컴포넌트
- [ ] `components/ui/LoadingSpinner.tsx` - 로딩 컴포넌트

### 3단계: 로직을 Hook으로 분리
- [x] `hooks/useMoodRecommendation.ts` - 추천 로직
- [ ] `hooks/useChat.ts` - 채팅 로직
- [ ] `hooks/useApi.ts` - API 호출 로직

### 4단계: 기능별 컴포넌트 생성
- [ ] `components/features/recommendation/ResultCard.tsx`
- [ ] `components/features/recommendation/SongCard.tsx`
- [ ] `components/features/recommendation/ScentCard.tsx`
- [ ] `components/features/chat/ChatMessage.tsx`
- [ ] `components/features/chat/ChatInput.tsx`

### 5단계: 화면 리팩토링
- [ ] `app/index.tsx` - 메인 화면 UI 교체
- [ ] `app/result.tsx` - 결과 화면 UI 교체 (로직은 hook 사용)
- [ ] `app/chat.tsx` - 채팅 화면 UI 교체

## 🎨 피그마에서 디자인 토큰 추출하기

### 색상 추출
1. 피그마에서 색상 팔레트 확인
2. `design/tokens/colors.ts`에 색상 값 업데이트
3. 예: `primary: '#FFB6C1'` → 피그마의 실제 색상 코드로 변경

### 타이포그래피 추출
1. 피그마에서 텍스트 스타일 확인
2. 폰트 크기, 굵기, 줄 간격 추출
3. `design/tokens/typography.ts`에 업데이트

### 간격 추출
1. 피그마에서 사용하는 간격 값 확인 (4px, 8px, 16px 등)
2. `design/tokens/spacing.ts`에 업데이트

## 🔄 화면 마이그레이션 예시

### Before (기존 코드)
```typescript
// app/result.tsx
export default function ResultScreen() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  // ... 모든 로직이 여기에
  
  return (
    <View style={{ backgroundColor: '#FAF9F6' }}>
      <Text style={{ fontSize: 32, fontWeight: '800' }}>추천 결과</Text>
      {/* ... */}
    </View>
  );
}
```

### After (마이그레이션 후)
```typescript
// app/result.tsx
import { useMoodRecommendation } from '@/hooks/useMoodRecommendation';
import { ResultCard } from '@/components/features/recommendation/ResultCard';
import { Button } from '@/components/ui/Button';
import { SafeContainer } from '@/components/layout/SafeContainer';

export default function ResultScreen() {
  const params = useLocalSearchParams<{ text?: string }>();
  const text = (params.text ?? '').toString();
  
  // 로직은 hook으로 분리
  const { loading, result, error, refetch } = useMoodRecommendation(text);
  
  return (
    <SafeContainer>
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay error={error} />}
      {result && (
        <>
          <ResultCard result={result} />
          <Button title="다시 추천받기" onPress={refetch} />
        </>
      )}
    </SafeContainer>
  );
}
```

## 📝 다음 단계

1. **피그마 디자인 토큰 업데이트**
   - 피그마에서 실제 색상, 폰트, 간격 값 추출
   - `design/tokens/` 파일들 업데이트

2. **기본 컴포넌트 생성**
   - 피그마 디자인에 맞춰 `components/ui/` 컴포넌트 생성
   - Button, Input, Card 등

3. **기능별 컴포넌트 생성**
   - `components/features/` 폴더에 기능별 컴포넌트 생성
   - 기존 화면의 UI 부분을 컴포넌트로 추출

4. **화면 리팩토링**
   - 기존 화면 파일에서 로직을 hook으로 분리
   - UI는 새로 만든 컴포넌트로 교체

## 💡 팁

- **점진적 마이그레이션**: 한 번에 다 바꾸지 말고, 화면별로 하나씩 진행
- **로직 유지**: 비즈니스 로직은 그대로 유지하고, UI만 교체
- **테스트**: 각 단계마다 앱이 정상 작동하는지 확인
- **피그마 연동**: 피그마 플러그인을 사용하면 디자인 토큰을 자동으로 추출할 수 있습니다

