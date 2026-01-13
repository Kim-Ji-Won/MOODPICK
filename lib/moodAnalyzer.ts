/**
 * 감정 텍스트 분석
 * 긍정/부정 점수를 계산하여 그래프에 사용
 */

export interface MoodScore {
  score: number; // -1 (매우 나쁨) ~ 1 (매우 좋음)
  intensity: number; // 0 ~ 1 (감정 강도)
}

/**
 * 감정 텍스트를 분석하여 점수 반환
 */
export function analyzeMoodText(text: string): MoodScore {
  const lowerText = text.toLowerCase();

  // 긍정 키워드
  const positiveKeywords = [
    '좋', '행복', '기쁨', '즐거', '웃', '사랑', '감사', '감동', '뿌듯', '만족',
    '편안', '평온', '안정', '따뜻', '희망', '기대', '신나', '설레', '즐겁',
    '행복해', '기쁘', '즐거워', '웃겨', '사랑해', '감사해', '감동적', '뿌듯해',
    '만족스', '편안해', '평온해', '안정적', '따뜻해', '희망적', '기대돼', '신나',
  ];

  // 부정 키워드
  const negativeKeywords = [
    '나쁘', '슬프', '우울', '힘들', '지치', '피곤', '스트레스', '불안', '걱정',
    '두려', '무서', '짜증', '화나', '분노', '억울', '서러', '외로', '쓸쓸',
    '아픈', '아프', '고통', '괴로', '절망', '실망', '좌절', '포기', '지겨',
    '나쁘', '슬퍼', '우울해', '힘들어', '지쳐', '피곤해', '스트레스받', '불안해',
    '걱정돼', '두려워', '무서워', '짜증나', '화나', '분노해', '억울해', '서러워',
    '외로워', '쓸쓸해', '아파', '고통스', '괴로워', '절망적', '실망해', '좌절감',
  ];

  // 강도 키워드
  const intensityKeywords = {
    very: ['너무', '정말', '완전', '진짜', '엄청', '대단', '최고', '최악'],
    medium: ['조금', '약간', '좀', '그냥'],
  };

  let positiveCount = 0;
  let negativeCount = 0;
  let intensity = 0.5; // 기본 강도

  // 긍정/부정 키워드 카운트
  positiveKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      positiveCount++;
    }
  });

  negativeKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      negativeCount++;
    }
  });

  // 강도 계산
  intensityKeywords.very.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      intensity = Math.min(1, intensity + 0.3);
    }
  });

  intensityKeywords.medium.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      intensity = Math.max(0.3, intensity - 0.2);
    }
  });

  // 점수 계산 (-1 ~ 1)
  const total = positiveCount + negativeCount;
  if (total === 0) {
    return { score: 0, intensity: 0 };
  }

  const score = (positiveCount - negativeCount) / Math.max(total, 1);
  const finalScore = Math.max(-1, Math.min(1, score * intensity));

  return {
    score: finalScore,
    intensity: Math.min(1, intensity + (total > 0 ? 0.2 : 0)),
  };
}

