/**
 * 색상 팔레트
 * 피그마에서 추출한 색상을 여기에 정의하세요
 */

export const colors = {
  // Primary Colors
  primary: '#7f7d7eff',
  primaryLight: '#bbbbbbe9',
  primaryDark: '#FF8FA3',
  
  // Secondary Colors
  secondary: '#E8F4F8',
  secondaryLight: '#F0F8FB',
  secondaryDark: '#B3E5FC',
  
  // Background Colors
  background: '#FAF9F6',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#F5F5F5',
  
  // Text Colors
  text: {
    primary: '#2D2D2D',
    secondary: '#666',
    tertiary: '#888',
    disabled: '#AAA',
    inverse: '#FFFFFF',
  },
  
  // Accent Colors
  accent: {
    yellow: '#FFF8E1',
    yellowBorder: '#FFE082',
    pink: '#FFF0F5',
    blue: '#E8F4F8',
  },
  
  // Status Colors
  success: '#4CAF50',
  error: '#FF6B6B',
  warning: '#FFA726',
  info: '#2196F3',
  
  // Border Colors
  border: '#E8E6E3',
  borderLight: '#F5F5F5',
  borderDark: '#CCCCCC',
  
  // Shadow Colors
  shadow: '#000000',
};

// 타입 정의
export type ColorKey = keyof typeof colors;
export type TextColorKey = keyof typeof colors.text;
export type AccentColorKey = keyof typeof colors.accent;

