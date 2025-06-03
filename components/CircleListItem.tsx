import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Calendar, ShieldCheck } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface CircleProps {
  id: string;
  name: string;
  members: number;
  totalPool: number;
  nextPayout: string;
  contributionAmount: number;
  frequency: string;
  progress: number;
  isAdmin: boolean;
}

interface CircleListItemProps {
  circle: CircleProps;
  onPress: () => void;
}

const CircleListItem: React.FC<CircleListItemProps> = ({ circle, onPress }) => {
  const { theme, isDark } = useTheme();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <Pressable onPress={onPress}>
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.container, { borderColor: theme.border }]}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: theme.text }]}>{circle.name}</Text>
            {circle.isAdmin && (
              <View style={styles.adminBadge}>
                <ShieldCheck size={12} color={theme.primary} />
                <Text style={[styles.adminText, { color: theme.primary }]}>Admin</Text>
              </View>
            )}
          </View>
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
          <View style={styles.progressInfo}>
            <Text style={[styles.poolAmount, { color: theme.text }]}>
              {circle.totalPool} ALGO
            </Text>
            <Text style={[styles.progressText, { color: theme.inactive }]}>
              {Math.round(circle.progress * 100)}% Funded
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Calendar size={16} color={theme.accent} />
            <Text style={[styles.footerText, { color: theme.text }]}>
              Next: {formatDate(circle.nextPayout)}
            </Text>
          </View>
          
          <View style={styles.footerItem}>
            <Text style={[styles.contribution, { color: theme.text }]}>
              {circle.contributionAmount} ALGO / {circle.frequency}
            </Text>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adminText: {
    fontSize: 12,
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
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poolAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  contribution: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});

export default CircleListItem;