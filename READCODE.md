# MoodPick App - 코드 구조 및 로직 상세 설명

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [전체 아키텍처](#전체-아키텍처)
3. [프론트엔드 구조](#프론트엔드-구조)
4. [백엔드 구조](#백엔드-구조)
5. [데이터 흐름](#데이터-흐름)
6. [주요 기능별 상세 설명](#주요-기능별-상세-설명)
7. [상태 관리](#상태-관리)
8. [에러 처리](#에러-처리)
9. [애니메이션 로직](#애니메이션-로직)

---

## 프로젝트 개요

**MoodPick**은 사용자의 감정 상태를 입력받아 AI가 맞춤 추천(메시지, 노래, 향)을 제공하고, 감정에 대해 깊이 있게 대화할 수 있는 모바일 앱입니다.

### 기술 스택

**프론트엔드:**
- React Native (Expo)
- TypeScript
- Expo Router (파일 기반 라우팅)
- React Native Animated

**백엔드:**
- NestJS
- TypeScript
- OpenAI GPT-4o-mini API

---

## 전체 아키텍처

```
┌─────────────────┐
│  React Native   │
│   (Expo App)    │
└────────┬────────┘
         │ HTTP POST
         │
         ▼
┌─────────────────┐
│  NestJS Server  │
│  (Port 4001)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenAI API     │
│  (GPT-4o-mini)  │
└─────────────────┘
```

### 프로젝트 구조

```
moodpick-app/              # 프론트엔드
├── app/
│   ├── index.tsx         # 메인 화면 (감정 입력)
│   ├── result.tsx        # 결과 화면 (AI 추천 + 채팅)
│   └── _layout.tsx       # 라우트 레이아웃
├── lib/
│   └── api.ts            # API 설정
└── package.json

moodpick-api/              # 백엔드
├── src/
│   ├── main.ts           # 서버 진입점
│   ├── app.module.ts     # 루트 모듈
│   └── modules/
│       └── ai/
│           ├── ai.controller.ts  # API 엔드포인트
│           └── ai.service.ts     # AI 로직
└── package.json
```

---

## 프론트엔드 구조

### 1. 메인 화면 (`app/index.tsx`)

#### 역할
사용자가 감정 상태를 입력하는 첫 화면입니다.

#### 주요 로직

```typescript
// 상태 관리
const [moodText, setMoodText] = useState("");

// 네비게이션
const router = useRouter();

// 버튼 클릭 시 결과 화면으로 이동
router.push({
  pathname: "/result",
  params: { text: moodText },
});
```

#### UI 구성
1. **헤더**: "오늘의 선택 ✨" 타이틀
2. **입력 필드**: 
   - 다중 줄 텍스트 입력 (`multiline`, `numberOfLines={4}`)
   - 최소 높이 100px
   - 둥근 모서리 (borderRadius: 20)
   - 그림자 효과
3. **추천 버튼**:
   - 입력이 있을 때만 활성화
   - 눌림 효과 (scale: 0.98)
   - 핑크 그라데이션 배경 (#FFB6C1)

#### 특징
- **동적 버튼 상태**: 입력이 없으면 비활성화 및 회색 배경
- **안전 영역 처리**: `SafeAreaView` 사용으로 노치/홈 인디케이터 대응
- **반응형 디자인**: flex 레이아웃으로 다양한 화면 크기 지원

---

### 2. 결과 화면 (`app/result.tsx`)

#### 역할
AI 추천 결과를 표시하고, AI와 대화할 수 있는 화면입니다.

#### 상태 관리

```typescript
// 로딩 및 결과 상태
const [loading, setLoading] = useState(true);
const [result, setResult] = useState<AiResult | null>(null);
const [error, setError] = useState<string>("");

// 애니메이션
const fadeAnim = useRef(new Animated.Value(0)).current;
const emojiFadeAnim = useRef(new Animated.Value(1)).current;

// 로딩 이모지
const loadingEmojis = ["😊", "🤔", "💭", "✨", "😌", "🤗", "💫", "🌟"];
const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

// AI 채팅
const [showChat, setShowChat] = useState(false);
const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([]);
const [chatInput, setChatInput] = useState("");
const [chatLoading, setChatLoading] = useState(false);
```

#### 타입 정의

```typescript
type AiResult = {
  result: string;              // AI 추천 메시지
  choice?: string;            // 하위 호환성
  reason?: string;            // 하위 호환성
  song?: {                    // 노래 추천
    title: string;
    artist: string;
    reason?: string;
  };
  scent?: {                   // 향 추천
    name: string;
    reason?: string;
  };
  _raw?: string;
};
```

---

### 3. API 호출 로직 (`fetchRecommendation`)

#### 전체 흐름

```typescript
const fetchRecommendation = useCallback(async (inputText: string) => {
  // 1. 이전 요청 취소
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  // 2. 새로운 AbortController 생성
  const controller = new AbortController();
  abortControllerRef.current = controller;
  
  // 3. 타임아웃 설정 (60초)
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    // 4. API 호출
    const res = await fetch(`${API_BASE_URL}/ai/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText }),
      signal: controller.signal,  // 취소 가능
    });

    // 5. 응답 처리
    if (!res.ok) {
      // 에러 처리...
    }

    const data = await res.json() as AiResult;
    setResult(data);
    
    // 6. 페이드 인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
    }).start();
    
  } catch (e) {
    // 에러 처리...
  } finally {
    clearTimeout(timeoutId);
    setLoading(false);
  }
}, []);
```

#### 주요 특징

1. **요청 취소 기능**: 
   - `AbortController`로 이전 요청 취소
   - 컴포넌트 언마운트 시 자동 취소

2. **타임아웃 처리**: 
   - 60초 타임아웃 설정
   - 터널 서비스 사용 시 긴 응답 시간 대응

3. **에러 처리**:
   - 408 (Request Timeout): 타임아웃 안내
   - 503 (Service Unavailable): 서버 비활성화 안내
   - 네트워크 오류: 연결 실패 안내

4. **로딩 상태 관리**:
   - 로딩 중 이모지 순환 애니메이션
   - 페이드 아웃/인 효과

---

### 4. 로딩 애니메이션 로직

#### 이모지 순환 애니메이션

```typescript
useEffect(() => {
  if (loading) {
    const interval = setInterval(() => {
      // 페이드 아웃
      Animated.sequence([
        Animated.timing(emojiFadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 이모지 변경
        setCurrentEmojiIndex((prev) => (prev + 1) % loadingEmojis.length);
        
        // 페이드 인
        Animated.timing(emojiFadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }, 500); // 0.5초마다 변경
    
    return () => clearInterval(interval);
  }
}, [loading]);
```

#### 동작 원리
1. 0.5초마다 이모지 변경
2. 페이드 아웃 → 이모지 변경 → 페이드 인
3. 스케일 애니메이션 (0.8 → 1.0)

---

### 5. AI 채팅 기능

#### 채팅 전송 로직

```typescript
const sendChatMessage = useCallback(async (message: string) => {
  if (!message.trim() || chatLoading) return;

  // 1. 사용자 메시지 추가
  const userMessage = message.trim();
  setChatInput("");
  setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
  setChatLoading(true);

  try {
    // 2. API 호출
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,              // 원본 감정 입력
        message: userMessage,   // 사용자 메시지
        history: chatMessages,  // 대화 기록
      }),
    });

    // 3. AI 응답 추가
    const data = await res.json();
    setChatMessages((prev) => [...prev, { role: "ai", content: data.response }]);
  } catch (e) {
    // 에러 메시지 추가
    setChatMessages((prev) => [
      ...prev,
      { role: "ai", content: "죄송해요, 응답을 생성하는데 문제가 생겼어요." },
    ]);
  } finally {
    setChatLoading(false);
  }
}, [text, chatMessages, chatLoading]);
```

#### 자동 스크롤

```typescript
useEffect(() => {
  if (chatMessages.length > 0 && scrollViewRef.current) {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }
}, [chatMessages]);
```

#### UI 구성
1. **채팅 헤더**: AI 상담사 안내
2. **메시지 영역**: 
   - 사용자 메시지: 오른쪽 정렬, 핑크 배경
   - AI 메시지: 왼쪽 정렬, 연한 파란 배경
3. **입력 영역**: 
   - 텍스트 입력 필드
   - 전송 버튼 (입력이 있을 때만 활성화)
   - 키보드 회피 처리 (`KeyboardAvoidingView`)

---

## 백엔드 구조

### 1. 서버 진입점 (`src/main.ts`)

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4001;
  await app.listen(port, "0.0.0.0");  // 모든 네트워크 인터페이스에서 수신
}
```

#### 특징
- 포트: 4001 (환경 변수로 변경 가능)
- 0.0.0.0 바인딩: 로컬 네트워크에서 접근 가능

---

### 2. 루트 모듈 (`src/app.module.ts`)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // 환경 변수 전역 설정
    AiModule,                                  // AI 모듈
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

### 3. AI 컨트롤러 (`src/modules/ai/ai.controller.ts`)

#### 엔드포인트

##### 1. `GET /ai/ping`
- **용도**: 서버 상태 확인
- **응답**: `{ ok: true }`

##### 2. `POST /ai/recommend`
- **요청**: `{ text: string }`
- **응답**: 
```typescript
{
  result: string;        // AI 추천 메시지
  song?: {               // 노래 추천 (선택)
    title: string;
    artist: string;
    reason?: string;
  };
  scent?: {              // 향 추천 (선택)
    name: string;
    reason?: string;
  };
}
```

**로직:**
```typescript
// 병렬 처리로 성능 최적화
const [result, song, scent] = await Promise.all([
  this.aiService.analyzeMood(body.text),
  this.aiService.recommendSong(body.text),
  this.aiService.recommendScent(body.text),
]);
```

##### 3. `POST /ai/chat`
- **요청**: 
```typescript
{
  text: string;                    // 원본 감정 입력
  message: string;                 // 사용자 메시지
  history?: Array<{                 // 대화 기록 (선택)
    role: string;
    content: string;
  }>;
}
```
- **응답**: `{ response: string }`

---

### 4. AI 서비스 (`src/modules/ai/ai.service.ts`)

#### 초기화

```typescript
constructor(private configService: ConfigService) {
  const apiKey = this.configService.get<string>("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  this.openai = new OpenAI({ apiKey });
}
```

#### 메서드별 상세 설명

##### 1. `analyzeMood(text: string)`

**역할**: 감정 분석 및 추천 메시지 생성

**프롬프트:**
```
시스템: "너는 사용자의 감정을 분석해서 짧은 추천 문구를 만드는 감정 기반 추천 AI야."
사용자: {text}
```

**반환**: 추천 메시지 문자열

---

##### 2. `recommendSong(text: string)`

**역할**: 감정에 맞는 노래 추천

**프롬프트:**
```
시스템: "너는 음악 추천 전문가야. 반드시 다음 JSON 형식으로만 응답해줘: 
        {\"title\": \"노래 제목\", \"artist\": \"아티스트명\", \"reason\": \"추천 이유\"}"
사용자: "다음 감정 상태에 맞는 노래를 추천해줘: {text}"
```

**설정:**
- `response_format: { type: "json_object" }` - JSON 형식 강제
- 에러 시 `null` 반환 (메인 추천은 유지)

**반환:**
```typescript
{
  title: string;
  artist: string;
  reason?: string;
} | null
```

---

##### 3. `recommendScent(text: string)`

**역할**: 감정에 맞는 향 추천

**프롬프트:**
```
시스템: "너는 향 추천 전문가야. 반드시 다음 JSON 형식으로만 응답해줘: 
        {\"name\": \"향 이름\", \"reason\": \"추천 이유\"}"
사용자: "다음 감정 상태에 맞는 향을 추천해줘: {text}"
```

**설정:**
- `response_format: { type: "json_object" }`
- 에러 시 `null` 반환

**반환:**
```typescript
{
  name: string;
  reason?: string;
} | null
```

---

##### 4. `chat(originalMood, userMessage, history)`

**역할**: 감정에 대한 깊이 있는 대화

**대화 단계별 전략:**

###### 첫 메시지 (isFirstMessage)
```typescript
시스템 프롬프트:
- 편향/오해 가능성 지적
- 되묻기 질문 1~2개
- 다양한 해석 2~3가지 제시
- 간단한 요약
```

###### 중간 대화 (isMidConversation)
```typescript
시스템 프롬프트:
- 새로운 편향/오해 지적
- 더 깊은 되묻기 질문
- 새로운 관점 제시
- 대화 요약
```

###### 마무리 단계 (isFinalStage)
```typescript
시스템 프롬프트:
- 편향/오해 종합 정리
- 제시된 해석 요약
- 최종 요약 및 핵심 인사이트
```

**메시지 구성:**
```typescript
messages = [
  { role: "system", content: systemPrompt },
  ...history.map(msg => ({ role: msg.role === "user" ? "user" : "assistant", content: msg.content })),
  { role: "user", content: userMessage }
]
```

**설정:**
- `temperature: 0.8` - 창의적이고 다양한 해석
- `max_tokens: 1000` - 충분한 길이의 응답

---

## 데이터 흐름

### 1. 추천 요청 흐름

```
사용자 입력
    ↓
app/index.tsx
    ↓ (router.push)
app/result.tsx
    ↓ (fetchRecommendation)
POST /ai/recommend
    ↓
ai.controller.ts
    ↓ (Promise.all)
ai.service.ts
    ├─ analyzeMood() → OpenAI
    ├─ recommendSong() → OpenAI
    └─ recommendScent() → OpenAI
    ↓
응답 병합
    ↓
app/result.tsx
    ↓ (setResult)
UI 렌더링
```

### 2. 채팅 흐름

```
사용자 메시지 입력
    ↓
sendChatMessage()
    ↓
POST /ai/chat
    ↓
ai.controller.ts
    ↓
ai.service.chat()
    ↓
대화 단계 판단
    ↓
시스템 프롬프트 생성
    ↓
OpenAI API 호출
    ↓
응답 반환
    ↓
chatMessages 업데이트
    ↓
UI 렌더링
```

---

## 상태 관리

### 프론트엔드 상태

#### 로컬 상태 (useState)
- `loading`: 로딩 상태
- `result`: AI 추천 결과
- `error`: 에러 메시지
- `showChat`: 채팅창 표시 여부
- `chatMessages`: 채팅 메시지 배열
- `chatInput`: 채팅 입력 텍스트
- `chatLoading`: 채팅 로딩 상태
- `currentEmojiIndex`: 현재 로딩 이모지 인덱스

#### Ref (useRef)
- `abortControllerRef`: 요청 취소용
- `fadeAnim`: 페이드 애니메이션
- `emojiFadeAnim`: 이모지 페이드 애니메이션
- `scrollViewRef`: 채팅 스크롤 제어

#### 파라미터 (useLocalSearchParams)
- `text`: URL 파라미터로 전달된 감정 텍스트

---

## 에러 처리

### 프론트엔드 에러 처리

#### 1. 네트워크 에러
```typescript
if (e?.message?.includes("Network request failed")) {
  errorMessage = "서버에 연결할 수 없습니다...";
}
```

#### 2. 타임아웃 에러
```typescript
if (e?.name === "AbortError") {
  errorMessage = "서버 응답 시간이 초과되었습니다...";
}
```

#### 3. HTTP 상태 코드별 처리
- **408**: Request Timeout - 타임아웃 안내
- **503**: Service Unavailable - 서버 비활성화 안내
- **기타**: 일반 에러 메시지

#### 4. 사용자 친화적 에러 메시지
- 구체적인 원인 설명
- 해결 방법 제시
- 재시도 버튼 제공

### 백엔드 에러 처리

#### 1. 입력 검증
```typescript
if (!body || !body.text) {
  throw new InternalServerErrorException("Text field is required");
}
```

#### 2. OpenAI API 에러
- try-catch로 감싸서 처리
- 에러 로깅
- 사용자에게 전달

#### 3. 부분 실패 처리
- 노래/향 추천 실패 시 `null` 반환
- 메인 추천은 유지

---

## 애니메이션 로직

### 1. 페이드 인 애니메이션

```typescript
// 결과 표시 시
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true,
}).start();
```

### 2. 이모지 순환 애니메이션

```typescript
// 페이드 아웃 → 변경 → 페이드 인
Animated.sequence([
  Animated.timing(emojiFadeAnim, { toValue: 0, duration: 150 }),
]).start(() => {
  setCurrentEmojiIndex((prev) => (prev + 1) % loadingEmojis.length);
  Animated.timing(emojiFadeAnim, { toValue: 1, duration: 150 }).start();
});
```

### 3. 버튼 눌림 효과

```typescript
style={({ pressed }) => ({
  transform: [{ scale: pressed ? 0.98 : 1 }],
})}
```

---

## 주요 설계 패턴

### 1. 관심사 분리
- **프론트엔드**: UI/UX, 상태 관리, 애니메이션
- **백엔드**: 비즈니스 로직, AI 통신, 데이터 처리

### 2. 에러 복원력
- 부분 실패 허용 (노래/향 추천 실패해도 메인 추천 유지)
- 명확한 에러 메시지
- 재시도 기능

### 3. 성능 최적화
- **병렬 처리**: `Promise.all`로 동시 API 호출
- **요청 취소**: `AbortController`로 불필요한 요청 취소
- **네이티브 드라이버**: 애니메이션 성능 최적화

### 4. 사용자 경험
- 로딩 애니메이션 (이모지 순환)
- 부드러운 전환 (페이드 인/아웃)
- 키보드 회피 처리
- 자동 스크롤

---

## 환경 변수

### 백엔드
- `OPENAI_API_KEY`: OpenAI API 키 (필수)
- `PORT`: 서버 포트 (기본값: 4001)

### 프론트엔드
- `API_BASE_URL`: 백엔드 서버 주소 (`lib/api.ts`)

---

## API 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/ai/ping` | 서버 상태 확인 |
| POST | `/ai/recommend` | AI 추천 (메시지, 노래, 향) |
| POST | `/ai/chat` | AI 채팅 |

---

## 파일별 역할 요약

### 프론트엔드

| 파일 | 역할 |
|------|------|
| `app/index.tsx` | 감정 입력 화면 |
| `app/result.tsx` | 결과 표시 및 AI 채팅 |
| `app/_layout.tsx` | 라우트 레이아웃 설정 |
| `lib/api.ts` | API 기본 URL 설정 |

### 백엔드

| 파일 | 역할 |
|------|------|
| `src/main.ts` | 서버 진입점 |
| `src/app.module.ts` | 루트 모듈 |
| `src/modules/ai/ai.controller.ts` | API 엔드포인트 정의 |
| `src/modules/ai/ai.service.ts` | AI 비즈니스 로직 |

---

## 향후 개선 가능한 부분

1. **캐싱**: 같은 감정에 대한 추천 캐싱
2. **오프라인 지원**: 로컬 저장소 활용
3. **히스토리**: 과거 추천 기록 저장
4. **통계**: 감정 패턴 분석
5. **푸시 알림**: 감정 관리 알림

---

## 디버깅 팁

### 프론트엔드
- 콘솔 로그 확인: API 호출/응답 로그
- 네트워크 탭: 요청/응답 확인
- React DevTools: 상태 확인

### 백엔드
- 콘솔 로그: 각 단계별 로그 출력
- OpenAI API 응답 확인
- 에러 스택 트레이스 확인

---

## 주의사항

1. **API 키 보안**: 환경 변수로 관리, 절대 커밋하지 않기
2. **타임아웃**: 터널 서비스 사용 시 긴 타임아웃 필요
3. **에러 처리**: 모든 API 호출에 에러 처리 필수
4. **메모리 관리**: 컴포넌트 언마운트 시 정리 작업 수행

---

이 문서는 MoodPick 앱의 전체 코드 구조와 로직을 상세히 설명합니다. 
추가 질문이나 개선 사항이 있으면 언제든지 문의하세요!

