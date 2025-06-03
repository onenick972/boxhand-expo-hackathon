import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { Users, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

interface CircleProps {
  id: string;
  name: string;
  members: number;
  totalPool: number;
  nextPayout: string;
  contributionAmount: number;
  frequency: string;
  progress: number;
}

interface CircleCardProps {
  circle: CircleProps;
}

const CircleCard: React.FC<CircleCardProps> = ({ circle }) => {
  const { theme, isDark } = useTheme();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <Pressable
      onPress={() => router.push(`/circles/${circle.id}`)}
    >
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.card, { borderColor: theme.border }]}
      >
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.text }]}>{circle.name}</Text>
          <View style={styles.memberInfo}>
            <Users size={16} color={theme.text} />
            <Text style={[styles.members, { color: theme.text }]}>{circle.members}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: theme.border,
                width: '100%',
              }
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: `${circle.progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.inactive }]}>
            {Math.round(circle.progress * 100)}% Funded
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.inactive }]}>
              Total Pool
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {circle.totalPool} ALGO
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.inactive }]}>
              Contribution
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {circle.contributionAmount} ALGO
            </Text>
          </View>
        </View>
        
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Calendar size={16} color={theme.primary} />
          <Text style={[styles.nextPayout, { color: theme.text }]}>
            Next payout: <Text style={{ color: theme.primary }}>{formatDate(circle.nextPayout)}</Text>
          </Text>
        </View>
      </BlurView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 240,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  members: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    textAlign: 'right',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoItem: {},
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  nextPayout: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});

export default CircleCard;