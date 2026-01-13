# 백엔드 API 업데이트 가이드

이 문서는 MoodPick 앱의 백엔드 API를 노래와 향 추천 기능을 포함하도록 업데이트하는 방법을 설명합니다.

## 📋 업데이트 요약

기존 API는 `result` 필드만 반환했지만, 이제 다음 필드들을 추가로 반환해야 합니다:
- `song`: 노래 추천 정보
- `scent`: 향 추천 정보

## 🔄 변경 사항

### 기존 응답 형식
```json
{
  "result": "추천 메시지"
}
```

### 새로운 응답 형식
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

## 💻 구현 예시

### Node.js / Express 예시

```javascript
// routes/ai.js 또는 app.js
app.post('/ai/recommend', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'text 필드가 필요합니다' });
    }

    // AI 모델을 사용하여 추천 생성
    const aiRecommendation = await generateAIRecommendation(text);
    
    // 노래 추천 생성 (감정에 맞는 노래 선택)
    const songRecommendation = await recommendSong(text);
    
    // 향 추천 생성 (감정에 맞는 향 선택)
    const scentRecommendation = await recommendScent(text);

    // 응답 구성
    const response = {
      result: aiRecommendation.message,
      song: songRecommendation ? {
        title: songRecommendation.title,
        artist: songRecommendation.artist,
        reason: songRecommendation.reason
      } : undefined,
      scent: scentRecommendation ? {
        name: scentRecommendation.name,
        reason: scentRecommendation.reason
      } : undefined
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('API 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 노래 추천 함수 예시
async function recommendSong(moodText) {
  // 감정 분석
  const emotion = analyzeEmotion(moodText); // 예: "sad", "happy", "anxious"
  
  // 감정별 노래 데이터베이스 또는 AI 모델 사용
  const songs = {
    sad: { title: "Someone Like You", artist: "Adele", reason: "슬픔을 공감하고 위로해주는 곡이에요" },
    happy: { title: "Happy", artist: "Pharrell Williams", reason: "기쁨을 더욱 증폭시켜주는 밝은 곡이에요" },
    anxious: { title: "Weightless", artist: "Marconi Union", reason: "불안을 완화하고 마음을 진정시켜주는 곡이에요" },
    tired: { title: "Breathe", artist: "Pink Floyd", reason: "지친 마음을 달래주는 편안한 곡이에요" }
  };
  
  return songs[emotion] || songs.sad; // 기본값
}

// 향 추천 함수 예시
async function recommendScent(moodText) {
  const emotion = analyzeEmotion(moodText);
  
  const scents = {
    sad: { name: "라벤더", reason: "우울감을 완화하고 마음을 진정시켜주는 향이에요" },
    happy: { name: "시트러스", reason: "기분을 더욱 상쾌하게 만들어주는 향이에요" },
    anxious: { name: "카모마일", reason: "불안을 완화하고 편안함을 주는 향이에요" },
    tired: { name: "유칼립투스", reason: "피로를 회복하고 정신을 맑게 해주는 향이에요" }
  };
  
  return scents[emotion] || scents.sad;
}
```

### Python / Flask 예시

```python
from flask import Flask, request, jsonify
import openai  # 또는 사용하는 AI 라이브러리

app = Flask(__name__)

@app.route('/ai/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'text 필드가 필요합니다'}), 400
        
        # AI 추천 생성
        ai_message = generate_ai_recommendation(text)
        
        # 노래 추천
        song = recommend_song(text)
        
        # 향 추천
        scent = recommend_scent(text)
        
        response = {
            'result': ai_message,
            'song': {
                'title': song['title'],
                'artist': song['artist'],
                'reason': song.get('reason')
            } if song else None,
            'scent': {
                'name': scent['name'],
                'reason': scent.get('reason')
            } if scent else None
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f'API 오류: {e}')
        return jsonify({'error': '서버 오류가 발생했습니다'}), 500

def recommend_song(mood_text):
    # 감정 분석
    emotion = analyze_emotion(mood_text)
    
    songs = {
        'sad': {'title': 'Someone Like You', 'artist': 'Adele', 'reason': '슬픔을 공감하고 위로해주는 곡이에요'},
        'happy': {'title': 'Happy', 'artist': 'Pharrell Williams', 'reason': '기쁨을 더욱 증폭시켜주는 밝은 곡이에요'},
        'anxious': {'title': 'Weightless', 'artist': 'Marconi Union', 'reason': '불안을 완화하고 마음을 진정시켜주는 곡이에요'},
        'tired': {'title': 'Breathe', 'artist': 'Pink Floyd', 'reason': '지친 마음을 달래주는 편안한 곡이에요'}
    }
    
    return songs.get(emotion, songs['sad'])

def recommend_scent(mood_text):
    emotion = analyze_emotion(mood_text)
    
    scents = {
        'sad': {'name': '라벤더', 'reason': '우울감을 완화하고 마음을 진정시켜주는 향이에요'},
        'happy': {'name': '시트러스', 'reason': '기분을 더욱 상쾌하게 만들어주는 향이에요'},
        'anxious': {'name': '카모마일', 'reason': '불안을 완화하고 편안함을 주는 향이에요'},
        'tired': {'name': '유칼립투스', 'reason': '피로를 회복하고 정신을 맑게 해주는 향이에요'}
    }
    
    return scents.get(emotion, scents['sad'])
```

## 🤖 AI 모델을 사용한 고급 구현

### OpenAI GPT를 사용한 예시

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function recommendSongWithAI(moodText) {
  const prompt = `
다음 감정 상태에 맞는 노래를 추천해주세요.
감정: ${moodText}

다음 JSON 형식으로 응답해주세요:
{
  "title": "노래 제목",
  "artist": "아티스트명",
  "reason": "이 노래를 추천하는 이유"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "당신은 음악 추천 전문가입니다. 감정에 맞는 노래를 추천해주세요." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}

async function recommendScentWithAI(moodText) {
  const prompt = `
다음 감정 상태에 맞는 향을 추천해주세요.
감정: ${moodText}

다음 JSON 형식으로 응답해주세요:
{
  "name": "향 이름",
  "reason": "이 향을 추천하는 이유"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "당신은 향 추천 전문가입니다. 감정에 맞는 향을 추천해주세요." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

## 📊 감정 분석 예시

```javascript
function analyzeEmotion(text) {
  const lowerText = text.toLowerCase();
  
  // 키워드 기반 감정 분석
  if (lowerText.includes('슬프') || lowerText.includes('우울') || lowerText.includes('외로')) {
    return 'sad';
  }
  if (lowerText.includes('기쁘') || lowerText.includes('행복') || lowerText.includes('좋아')) {
    return 'happy';
  }
  if (lowerText.includes('불안') || lowerText.includes('걱정') || lowerText.includes('두려')) {
    return 'anxious';
  }
  if (lowerText.includes('지치') || lowerText.includes('피곤') || lowerText.includes('힘들')) {
    return 'tired';
  }
  
  return 'neutral';
}
```

## ✅ 테스트 방법

### cURL로 테스트

```bash
curl -X POST http://localhost:4001/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"text": "오늘은 너무 지치고, 위로가 필요해"}'
```

### 예상 응답

```json
{
  "result": "그 기분을 즐기세요! 좋은 것들이 더 많이 찾아올 거예요!",
  "song": {
    "title": "Breathe",
    "artist": "Pink Floyd",
    "reason": "지친 마음을 달래주는 편안한 곡이에요"
  },
  "scent": {
    "name": "유칼립투스",
    "reason": "피로를 회복하고 정신을 맑게 해주는 향이에요"
  }
}
```

## 🔍 주의사항

1. **하위 호환성**: 기존 앱이 `song`과 `scent` 없이도 작동하도록, 이 필드들은 선택적(optional)으로 반환하세요.

2. **에러 처리**: 노래나 향 추천에 실패해도 메인 `result`는 반환하도록 하세요.

3. **응답 시간**: AI 모델 사용 시 응답 시간이 길어질 수 있으니, 타임아웃을 적절히 설정하세요.

4. **캐싱**: 같은 감정에 대한 추천은 캐싱하여 응답 속도를 개선할 수 있습니다.

## 📝 체크리스트

- [ ] `/ai/recommend` 엔드포인트에 `song` 필드 추가
- [ ] `/ai/recommend` 엔드포인트에 `scent` 필드 추가
- [ ] 감정 분석 로직 구현
- [ ] 노래 추천 로직 구현
- [ ] 향 추천 로직 구현
- [ ] 에러 처리 추가
- [ ] 테스트 완료

## 🆘 문제 해결

### 문제: 노래/향이 표시되지 않아요
- 응답 JSON이 올바른 형식인지 확인
- `song`과 `scent` 필드가 `null`이 아닌 객체인지 확인
- 프론트엔드 콘솔 로그 확인

### 문제: 응답이 너무 느려요
- AI 모델 호출을 병렬로 처리
- 캐싱 구현
- 타임아웃 설정 확인

## 📚 추가 리소스

- [API 스펙 문서](./API_SPEC.md)
- [프론트엔드 타입 정의](./app/result.tsx) - `AiResult` 타입 참고

