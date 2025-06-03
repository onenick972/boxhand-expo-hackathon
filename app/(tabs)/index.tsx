import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, ArrowUpRight, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import TrustScoreRing from '@/components/TrustScoreRing';
import CircleCard from '@/components/CircleCard';
import ActivityFeed from '@/components/ActivityFeed';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();

  // Mocked data for the home screen
  const activeCircles = [
    {
      id: '1',
      name: 'Family Circle',
      members: 5,
      totalPool: 1000,
      nextPayout: '2025-01-15',
      contributionAmount: 200,
      frequency: 'Monthly',
      progress: 0.75,
    },
    {
      id: '2',
      name: 'Friends Savings',
      members: 8,
      totalPool: 2400,
      nextPayout: '2025-02-03',
      contributionAmount: 300,
      frequency: 'Monthly',
      progress: 0.5,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: theme.text }]}>
                Hello, {user?.name?.split(' ')[0] || 'User'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.inactive }]}>
                Welcome to your savings dashboard
              </Text>
            </View>
            <Pressable style={styles.notificationButton}>
              <Bell color={theme.text} size={24} />
              <View style={[styles.notificationBadge, { backgroundColor: theme.notification }]} />
            </Pressable>
          </View>

          {/* Trust Score */}
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.trustScoreCard, { borderColor: theme.border }]}
          >
            <View style={styles.trustScoreContent}>
              <TrustScoreRing score={user?.trustScore || 0} size={100} strokeWidth={10} />
              <View style={styles.trustScoreInfo}>
                <Text style={[styles.trustScoreLabel, { color: theme.text }]}>Trust Score</Text>
                <Text style={[styles.trustScoreValue, { color: theme.text }]}>
                  {user?.trustScore || 0}
                </Text>
                <Text style={[styles.trustScoreDescription, { color: theme.inactive }]}>
                  {getTrustScoreDescription(user?.trustScore || 0)}
                </Text>
              </View>
            </View>
            <Pressable
              style={[styles.viewDetailsButton, { backgroundColor: theme.primary + '20' }]}
              onPress={() => router.push('/analytics')}
            >
              <Text style={[styles.viewDetailsText, { color: theme.primary }]}>View Details</Text>
              <ArrowUpRight size={16} color={theme.primary} />
            </Pressable>
          </BlurView>

          {/* Active Circles */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Circles</Text>
              <Pressable 
                style={styles.viewAllButton}
                onPress={() => router.push('/circles')}
              >
                <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
              </Pressable>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.circlesScrollContent}
            >
              {activeCircles.map(circle => (
                <CircleCard key={circle.id} circle={circle} />
              ))}
              
              <Pressable 
                style={[styles.createCircleCard, { borderColor: theme.border }]}
                onPress={() => router.push('/circles/create')}
              >
                <Plus size={32} color={theme.primary} />
                <Text style={[styles.createCircleText, { color: theme.text }]}>
                  Create New Circle
                </Text>
              </Pressable>
            </ScrollView>
          </View>

          {/* Recent Activity */}
          <View style={[styles.sectionContainer, { marginBottom: 100 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
            </View>
            <ActivityFeed />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function getTrustScoreDescription(score: number): string {
  if (score >= 90) return 'Excellent standing';
  if (score >= 75) return 'Good standing';
  if (score >= 60) return 'Fair standing';
  if (score >= 40) return 'Building trust';
  return 'New member';
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  trustScoreCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  trustScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  trustScoreInfo: {
    marginLeft: 16,
    flex: 1,
  },
  trustScoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  trustScoreValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginVertical: 4,
  },
  trustScoreDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  sectionContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllButton: {
    padding: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  circlesScrollContent: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 8,
  },
  createCircleCard: {
    width: 200,
    height: 180,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  createCircleText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});