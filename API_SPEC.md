# MoodPick API 스펙 문서

## 엔드포인트

### POST `/ai/recommend`

감정 상태를 입력받아 AI 추천(메시지, 노래, 향)을 반환합니다.

#### Request

```json
{
  "text": "오늘은 너무 지치고, 위로가 필요해"
}
```

#### Response (200 OK)

```json
{
  "result": "그 기분을 즐기세요! 좋은 것들이 더 많이 찾아올 거예요!",
  "song": {
    "title": "노래 제목",
    "artist": "아티스트명",
    "reason": "이 노래가 이 감정에 왜 좋은지 설명 (선택)"
  },
  "scent": {
    "name": "향 이름",
    "reason": "이 향이 이 감정에 왜 좋은지 설명 (선택)"
  }
}
```

#### Response 필드 설명

- `result` (string, 필수): AI가 추천하는 메시지
- `song` (object, 선택): 추천 노래 정보
  - `title` (string, 필수): 노래 제목
  - `artist` (string, 필수): 아티스트명
  - `reason` (string, 선택): 추천 이유
- `scent` (object, 선택): 추천 향 정보
  - `name` (string, 필수): 향 이름
  - `reason` (string, 선택): 추천 이유

#### 에러 응답

- `408 Request Timeout`: 요청 시간 초과
- `503 Service Unavailable`: 서버 일시적 사용 불가
- `500 Internal Server Error`: 서버 내부 오류

#### 예시

**요청:**
```bash
curl -X POST https://your-api-url/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"text": "외롭고 힘들어"}'
```

**응답:**
```json
{
  "result": "혼자가 아니에요. 당신을 응원하는 마음이 전해지길 바라요.",
  "song": {
    "title": "You Are Not Alone",
    "artist": "Michael Jackson",
    "reason": "외로움을 위로해주는 따뜻한 메시지가 담긴 곡이에요"
  },
  "scent": {
    "name": "라벤더",
    "reason": "불안과 스트레스를 완화하고 마음을 진정시켜주는 향이에요"
  }
}
```

## 하위 호환성

기존 API 응답 형식도 지원합니다:

```json
{
  "result": "추천 메시지"
}
```

또는

```json
{
  "choice": "선택",
  "reason": "이유"
}
```

## 백엔드 구현 가이드

백엔드 API를 업데이트하는 방법은 [BACKEND_UPDATE_GUIDE.md](./BACKEND_UPDATE_GUIDE.md)를 참고하세요.

이 가이드에는 다음이 포함되어 있습니다:
- Node.js/Express 구현 예시
- Python/Flask 구현 예시
- AI 모델을 사용한 고급 구현
- 감정 분석 예시
- 테스트 방법

