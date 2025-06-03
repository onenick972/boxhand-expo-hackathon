import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TrustScoreRingProps {
  score: number;
  size: number;
  strokeWidth: number;
}

const TrustScoreRing: React.FC<TrustScoreRingProps> = ({ score, size, strokeWidth }) => {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  
  // Calculate properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = size / 2;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.success;
    if (score >= 75) return theme.primary;
    if (score >= 60) return theme.accent;
    if (score >= 40) return theme.warning;
    return theme.error;
  };

  // Animation effect
  React.useEffect(() => {
    progress.value = withTiming(score / 100, { duration: 1500 });
  }, [score]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation={`-90 ${center} ${center}`}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      
      {/* Score Text (optional) */}
      <View style={[styles.scoreContainer, { width: size, height: size }]}>
        <Text style={[styles.scoreText, { color: theme.text }]}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
});

export default TrustScoreRing;