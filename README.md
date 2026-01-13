# MoodPick App 💝

감정 상태를 입력하면 AI가 맞춤 추천(메시지, 노래, 향)을 해주는 모바일 앱입니다.

## 주요 기능

- ✨ 감정 기반 AI 추천
- 🎵 맞춤 노래 추천
- 🌸 맞춤 향 추천
- 💫 귀여운 UI/UX
- 🎨 부드러운 애니메이션

## 시작하기

1. 의존성 설치

   ```bash
   npm install
   ```

2. 앱 실행

   ```bash
   npx expo start
   ```

3. API 서버 설정

   `lib/api.ts` 파일에서 API_BASE_URL을 설정하세요.

   ```typescript
   export const API_BASE_URL = "https://your-api-url";
   ```

## 프로젝트 구조

```
app/
  ├── index.tsx          # 메인 화면 (감정 입력)
  ├── result.tsx         # 결과 화면 (AI 추천 표시)
  └── (tabs)/           # 탭 네비게이션
lib/
  └── api.ts            # API 설정
```

## API 스펙

자세한 API 스펙은 [API_SPEC.md](./API_SPEC.md)를 참고하세요.

### 기본 요청 형식

```json
POST /ai/recommend
{
  "text": "오늘은 너무 지치고, 위로가 필요해"
}
```

### 응답 형식

```json
{
  "result": "추천 메시지",
  "song": {
    "title": "노래 제목",
    "artist": "아티스트명",
    "reason": "추천 이유 (선택)"
  },
  "scent": {
    "name": "향 이름",
    "reason": "추천 이유 (선택)"
  }
}
```

## 기술 스택

- React Native
- Expo Router
- TypeScript
- React Native Animated

## 개발

프로젝트는 [file-based routing](https://docs.expo.dev/router/introduction)을 사용합니다.

## 라이선스

Private
