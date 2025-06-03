export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  inactive: string;
  cardBackground: string;
  shadow: string;
};

export const lightTheme: ThemeColors = {
  primary: '#7B61FF',
  secondary: '#5B4CC3',
  accent: '#00D2C6',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  border: '#E1E4E8',
  notification: '#FF5A5A',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  inactive: '#9E9E9E',
  cardBackground: 'rgba(255, 255, 255, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme: ThemeColors = {
  primary: '#7B61FF',
  secondary: '#6B5CD3',
  accent: '#00D2C6',
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  border: '#2C2C2C',
  notification: '#FF5A5A',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  inactive: '#6E6E6E',
  cardBackground: 'rgba(30, 30, 30, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.2)',
};