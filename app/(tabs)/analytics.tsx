import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import TrustScoreRing from '@/components/TrustScoreRing';
import { ArrowUp, TrendingUp, Calendar, Clock, Award } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AnalyticsScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();

  // Mock data for analytics
  const trustScoreHistory = [85, 82, 78, 75, 72, 68, 65, 62, 60, 58, 55];
  const contributionRate = 95; // Percentage
  const participationRate = 100; // Percentage
  const onTimeRate = 90; // Percentage
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Analytics</Text>
          </View>

          {/* Trust Score Section */}
          <Animated.View entering={FadeInDown.duration(600)}>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.trustScoreCard, { borderColor: theme.border }]}
            >
              <View style={styles.trustScoreHeader}>
                <Text style={[styles.trustScoreTitle, { color: theme.text }]}>
                  Your Trust Score
                </Text>
                <View style={[styles.trustScoreBadge, { backgroundColor: theme.primary + '20' }]}>
                  <ArrowUp size={12} color={theme.primary} />
                  <Text style={[styles.trustScoreBadgeText, { color: theme.primary }]}>
                    +5 pts
                  </Text>
                </View>
              </View>

              <View style={styles.trustScoreContent}>
                <TrustScoreRing score={user?.trustScore || 0} size={120} strokeWidth={12} />
                <View style={styles.trustScoreDetails}>
                  <Text style={[styles.trustScoreValue, { color: theme.text }]}>
                    {user?.trustScore || 0}
                  </Text>
                  <Text style={[styles.trustScoreLabel, { color: theme.inactive }]}>
                    {getTrustScoreLevel(user?.trustScore || 0)}
                  </Text>
                </View>
              </View>

              <Text style={[styles.trustScoreDescription, { color: theme.text }]}>
                Your trust score is calculated based on your participation history, on-time contributions, and overall engagement with savings circles.
              </Text>
            </BlurView>
          </Animated.View>

          {/* Performance Metrics */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <View style={styles.metricsContainer}>
              <MetricCard
                icon={<TrendingUp size={24} color={theme.primary} />}
                title="Contribution Rate"
                value={`${contributionRate}%`}
                description="of required payments made"
                theme={theme}
                isDark={isDark}
              />
              <MetricCard
                icon={<Calendar size={24} color={theme.accent} />}
                title="Participation Rate"
                value={`${participationRate}%`}
                description="of circles attended"
                theme={theme}
                isDark={isDark}
              />
              <MetricCard
                icon={<Clock size={24} color={theme.success} />}
                title="On-Time Rate"
                value={`${onTimeRate}%`}
                description="payments made on schedule"
                theme={theme}
                isDark={isDark}
              />
            </View>
          </Animated.View>

          {/* Loan Eligibility */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.loanEligibilityCard, { borderColor: theme.border }]}
            >
              <View style={styles.loanEligibilityHeader}>
                <Award size={24} color={theme.primary} />
                <Text style={[styles.loanEligibilityTitle, { color: theme.text }]}>
                  Loan Eligibility
                </Text>
              </View>

              <View style={styles.loanEligibilityStatus}>
                <View style={[styles.loanStatusIndicator, { backgroundColor: theme.success }]} />
                <Text style={[styles.loanStatusText, { color: theme.text }]}>
                  Eligible for loans up to 500 ALGO
                </Text>
              </View>

              <Text style={[styles.loanEligibilityDescription, { color: theme.inactive }]}>
                Based on your trust score and participation history, you can request loans from your savings circles. Higher trust scores enable larger loan amounts.
              </Text>

              <Pressable
                style={[styles.requestLoanButton, { backgroundColor: theme.primary }]}
                onPress={() => {}}
              >
                <Text style={styles.requestLoanText}>Request a Loan</Text>
              </Pressable>
            </BlurView>
          </Animated.View>

          {/* Trust Score History */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.historySection}>
            <Text style={[styles.historySectionTitle, { color: theme.text }]}>
              Trust Score History
            </Text>
            <View style={styles.historyChart}>
              {trustScoreHistory.map((score, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.historyBar,
                    { 
                      height: score * 1.5,
                      backgroundColor: getScoreColor(score, theme),
                    }
                  ]} 
                />
              ))}
            </View>
            <View style={styles.monthLabels}>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Jan</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Feb</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Mar</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Apr</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>May</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Jun</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Jul</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Aug</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Sep</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Oct</Text>
              <Text style={[styles.monthLabel, { color: theme.inactive }]}>Nov</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  theme: any;
  isDark: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon, title, value, description, theme, isDark 
}) => {
  return (
    <BlurView
      intensity={80}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.metricCard, { borderColor: theme.border }]}
    >
      {icon}
      <Text style={[styles.metricTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricDescription, { color: theme.inactive }]}>
        {description}
      </Text>
    </BlurView>
  );
};

// Helper functions
function getTrustScoreLevel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Building';
  return 'Beginner';
}

function getScoreColor(score: number, theme: any): string {
  if (score >= 90) return theme.success;
  if (score >= 75) return theme.primary;
  if (score >= 60) return theme.accent;
  if (score >= 40) return theme.warning;
  return theme.error;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  trustScoreCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
  },
  trustScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trustScoreTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  trustScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trustScoreBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  trustScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trustScoreDetails: {
    flex: 1,
    alignItems: 'center',
  },
  trustScoreValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
  },
  trustScoreLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
  trustScoreDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    gap: 16,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  metricTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  metricDescription: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  loanEligibilityCard: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
  },
  loanEligibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  loanEligibilityTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  loanEligibilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  loanStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loanStatusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loanEligibilityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 24,
  },
  requestLoanButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestLoanText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  historySection: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 100,
  },
  historySectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  historyChart: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyBar: {
    width: 20,
    borderRadius: 10,
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
});