import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  DollarSign, 
  Timer, 
  BarChart3,
  User
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock circle data (would fetch from API in real app)
const mockCircle = {
  id: '1',
  name: 'Family Circle',
  description: 'Monthly savings circle for family members to help each other with financial goals.',
  members: [
    { id: '1', name: 'You', role: 'admin', trustScore: 85 },
    { id: '2', name: 'Sarah Johnson', role: 'member', trustScore: 78 },
    { id: '3', name: 'Mike Peterson', role: 'member', trustScore: 92 },
    { id: '4', name: 'Anna Williams', role: 'member', trustScore: 65 },
    { id: '5', name: 'John Davis', role: 'member', trustScore: 71 },
  ],
  totalPool: 1000,
  nextPayout: '2025-01-15',
  contributionAmount: 200,
  frequency: 'Monthly',
  progress: 0.75,
  nextContribution: '2025-01-05',
  payoutSchedule: [
    { memberId: '3', date: '2024-11-15', amount: 1000, completed: true },
    { memberId: '2', date: '2024-12-15', amount: 1000, completed: true },
    { memberId: '1', date: '2025-01-15', amount: 1000, completed: false },
    { memberId: '5', date: '2025-02-15', amount: 1000, completed: false },
    { memberId: '4', date: '2025-03-15', amount: 1000, completed: false },
  ],
  contractAddress: '0x1234...5678',
};

// Tab type
type TabType = 'details' | 'members' | 'schedule';

export default function CircleDetailScreen() {
  const { theme, isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('details');

  // In a real app, fetch circle data based on ID
  const circle = mockCircle;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate days until next payout/contribution
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Circle Details</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Circle Info Card */}
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.circleInfoCard, { borderColor: theme.border }]}
          >
            <Text style={[styles.circleName, { color: theme.text }]}>{circle.name}</Text>
            
            <View style={styles.circleStatsRow}>
              <View style={styles.circleStat}>
                <Users size={16} color={theme.primary} />
                <Text style={[styles.circleStatText, { color: theme.text }]}>
                  {circle.members.length} Members
                </Text>
              </View>
              
              <View style={styles.circleStat}>
                <DollarSign size={16} color={theme.primary} />
                <Text style={[styles.circleStatText, { color: theme.text }]}>
                  {circle.contributionAmount} ALGO / {circle.frequency}
                </Text>
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
          </BlurView>
          
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <Pressable 
              style={[
                styles.tab, 
                activeTab === 'details' && { 
                  borderBottomColor: theme.primary,
                  borderBottomWidth: 2,
                }
              ]}
              onPress={() => setActiveTab('details')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  { 
                    color: activeTab === 'details' ? theme.primary : theme.inactive 
                  }
                ]}
              >
                Details
              </Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.tab, 
                activeTab === 'members' && { 
                  borderBottomColor: theme.primary,
                  borderBottomWidth: 2,
                }
              ]}
              onPress={() => setActiveTab('members')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  { 
                    color: activeTab === 'members' ? theme.primary : theme.inactive 
                  }
                ]}
              >
                Members
              </Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.tab, 
                activeTab === 'schedule' && { 
                  borderBottomColor: theme.primary,
                  borderBottomWidth: 2,
                }
              ]}
              onPress={() => setActiveTab('schedule')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  { 
                    color: activeTab === 'schedule' ? theme.primary : theme.inactive 
                  }
                ]}
              >
                Schedule
              </Text>
            </Pressable>
          </View>
          
          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'details' && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>About this Circle</Text>
                <Text style={[styles.description, { color: theme.text }]}>
                  {circle.description}
                </Text>
                
                <View style={styles.detailsGrid}>
                  <BlurView
                    intensity={80}
                    tint={isDark ? 'dark' : 'light'}
                    style={[styles.detailCard, { borderColor: theme.border }]}
                  >
                    <Calendar size={24} color={theme.primary} />
                    <Text style={[styles.detailTitle, { color: theme.text }]}>Next Payout</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {formatDate(circle.nextPayout)}
                    </Text>
                    <Text style={[styles.detailSubtext, { color: theme.inactive }]}>
                      {getDaysUntil(circle.nextPayout)} days left
                    </Text>
                  </BlurView>
                  
                  <BlurView
                    intensity={80}
                    tint={isDark ? 'dark' : 'light'}
                    style={[styles.detailCard, { borderColor: theme.border }]}
                  >
                    <Timer size={24} color={theme.accent} />
                    <Text style={[styles.detailTitle, { color: theme.text }]}>Next Contribution</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {formatDate(circle.nextContribution)}
                    </Text>
                    <Text style={[styles.detailSubtext, { color: theme.inactive }]}>
                      {getDaysUntil(circle.nextContribution)} days left
                    </Text>
                  </BlurView>
                </View>
                
                <BlurView
                  intensity={80}
                  tint={isDark ? 'dark' : 'light'}
                  style={[styles.contractCard, { borderColor: theme.border }]}
                >
                  <View style={styles.contractHeader}>
                    <BarChart3 size={20} color={theme.primary} />
                    <Text style={[styles.contractTitle, { color: theme.text }]}>
                      Smart Contract
                    </Text>
                  </View>
                  <Text style={[styles.contractAddress, { color: theme.text }]}>
                    {circle.contractAddress}
                  </Text>
                  <Pressable
                    style={[styles.viewButton, { backgroundColor: theme.primary + '20' }]}
                  >
                    <Text style={[styles.viewButtonText, { color: theme.primary }]}>
                      View on Explorer
                    </Text>
                  </Pressable>
                </BlurView>
                
                <View style={styles.actionButtons}>
                  <Pressable
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                  >
                    <Text style={styles.actionButtonText}>Contribute Now</Text>
                  </Pressable>
                  
                  <Pressable
                    style={[styles.actionButton, { backgroundColor: theme.accent }]}
                  >
                    <Text style={styles.actionButtonText}>Request Loan</Text>
                  </Pressable>
                </View>
              </Animated.View>
            )}
            
            {activeTab === 'members' && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Circle Members</Text>
                
                {circle.members.map((member, index) => (
                  <BlurView
                    key={member.id}
                    intensity={80}
                    tint={isDark ? 'dark' : 'light'}
                    style={[styles.memberCard, { borderColor: theme.border }]}
                  >
                    <View style={styles.memberInfo}>
                      <View 
                        style={[
                          styles.memberAvatar, 
                          { 
                            backgroundColor: member.id === '1' ? theme.primary : theme.accent 
                          }
                        ]}
                      >
                        <User size={16} color="white" />
                      </View>
                      <View style={styles.memberDetails}>
                        <Text style={[styles.memberName, { color: theme.text }]}>
                          {member.name}
                        </Text>
                        <View style={styles.memberRoleContainer}>
                          <Text 
                            style={[
                              styles.memberRole,
                              { 
                                color: member.role === 'admin' ? theme.primary : theme.inactive 
                              }
                            ]}
                          >
                            {member.role === 'admin' ? 'Admin' : 'Member'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.trustScoreContainer}>
                      <Text style={[styles.trustScoreLabel, { color: theme.inactive }]}>
                        Trust Score
                      </Text>
                      <Text style={[styles.trustScoreValue, { color: theme.text }]}>
                        {member.trustScore}
                      </Text>
                    </View>
                  </BlurView>
                ))}
                
                <Pressable
                  style={[styles.inviteButton, { borderColor: theme.primary }]}
                >
                  <Text style={[styles.inviteButtonText, { color: theme.primary }]}>
                    Invite New Member
                  </Text>
                </Pressable>
              </Animated.View>
            )}
            
            {activeTab === 'schedule' && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Payout Schedule</Text>
                
                {circle.payoutSchedule.map((payout, index) => {
                  const member = circle.members.find(m => m.id === payout.memberId);
                  
                  return (
                    <BlurView
                      key={index}
                      intensity={80}
                      tint={isDark ? 'dark' : 'light'}
                      style={[styles.scheduleCard, { borderColor: theme.border }]}
                    >
                      <View style={styles.scheduleHeader}>
                        <Text style={[styles.scheduleDate, { color: theme.text }]}>
                          {formatDate(payout.date)}
                        </Text>
                        <View 
                          style={[
                            styles.statusBadge, 
                            { 
                              backgroundColor: payout.completed ? 
                                theme.success + '20' : theme.primary + '20' 
                            }
                          ]}
                        >
                          <Text 
                            style={[
                              styles.statusText, 
                              { 
                                color: payout.completed ? theme.success : theme.primary 
                              }
                            ]}
                          >
                            {payout.completed ? 'Completed' : 'Upcoming'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.scheduleContent}>
                        <View style={styles.recipientInfo}>
                          <Text style={[styles.recipientLabel, { color: theme.inactive }]}>
                            Recipient
                          </Text>
                          <Text style={[styles.recipientName, { color: theme.text }]}>
                            {member?.name || 'Unknown'}
                          </Text>
                        </View>
                        
                        <View style={styles.amountInfo}>
                          <Text style={[styles.amountLabel, { color: theme.inactive }]}>
                            Amount
                          </Text>
                          <Text style={[styles.amountValue, { color: theme.text }]}>
                            {payout.amount} ALGO
                          </Text>
                        </View>
                      </View>
                    </BlurView>
                  );
                })}
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  circleInfoCard: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
  },
  circleName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  circleStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  circleStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    width: '100%',
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  tabContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  detailCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  detailSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  contractCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  contractTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  contractAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberDetails: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  memberRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRole: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  trustScoreContainer: {
    alignItems: 'flex-end',
  },
  trustScoreLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  trustScoreValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  inviteButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 8,
  },
  inviteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  scheduleCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  scheduleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipientInfo: {},
  recipientLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});