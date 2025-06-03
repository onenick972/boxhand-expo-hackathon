import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowUpRight, ArrowDownRight, UserPlus, AlertCircle } from 'lucide-react-native';

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'contribution',
    amount: 200,
    circleName: 'Family Circle',
    timestamp: '2023-12-28T10:30:00Z',
  },
  {
    id: '2',
    type: 'payout',
    amount: 1000,
    circleName: 'Friends Savings',
    timestamp: '2023-12-26T14:15:00Z',
  },
  {
    id: '3',
    type: 'joined',
    circleName: 'Neighborhood Group',
    timestamp: '2023-12-23T09:45:00Z',
  },
  {
    id: '4',
    type: 'missed',
    amount: 300,
    circleName: 'Work Colleagues',
    timestamp: '2023-12-20T16:30:00Z',
  },
];

type ActivityType = 'contribution' | 'payout' | 'joined' | 'missed';

interface Activity {
  id: string;
  type: ActivityType;
  amount?: number;
  circleName: string;
  timestamp: string;
}

const ActivityFeed: React.FC = () => {
  const { theme } = useTheme();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  const renderActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'contribution':
        return <ArrowUpRight size={20} color={theme.success} />;
      case 'payout':
        return <ArrowDownRight size={20} color={theme.accent} />;
      case 'joined':
        return <UserPlus size={20} color={theme.primary} />;
      case 'missed':
        return <AlertCircle size={20} color={theme.error} />;
      default:
        return null;
    }
  };
  
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'contribution':
        return `You contributed ${activity.amount} ALGO to ${activity.circleName}`;
      case 'payout':
        return `You received ${activity.amount} ALGO from ${activity.circleName}`;
      case 'joined':
        return `You joined ${activity.circleName}`;
      case 'missed':
        return `Missed payment of ${activity.amount} ALGO to ${activity.circleName}`;
      default:
        return '';
    }
  };
  
  const renderItem = ({ item }: { item: Activity }) => (
    <View style={[styles.activityItem, { borderBottomColor: theme.border }]}>
      <View style={styles.iconContainer}>
        {renderActivityIcon(item.type)}
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityText, { color: theme.text }]}>
          {getActivityText(item)}
        </Text>
        <Text style={[styles.activityTime, { color: theme.inactive }]}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
    </View>
  );
  
  return (
    <FlatList
      data={mockActivities}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});

export default ActivityFeed;