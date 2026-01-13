/**
 * 타이포그래피 시스템
 * 피그마에서 추출한 폰트 스타일을 여기에 정의하세요
 */

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  
  // Caption
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  captionSmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  
  // Button Text
  button: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};

// 타입 정의
export type TypographyKey = keyof typeof typography;

