/**
 * 간격 시스템
 * 피그마에서 사용하는 간격 단위를 여기에 정의하세요
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 60,
};

// 타입 정의
export type SpacingKey = keyof typeof spacing;

// 간격 값 가져오기 헬퍼
export const getSpacing = (key: SpacingKey | number): number => {
  if (typeof key === 'number') return key;
  return spacing[key];
};

