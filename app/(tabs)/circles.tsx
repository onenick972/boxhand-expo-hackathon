import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import CircleListItem from '@/components/CircleListItem';
import { BlurView } from 'expo-blur';

// Mock data for circles
const mockCircles = [
  {
    id: '1',
    name: 'Family Circle',
    members: 5,
    totalPool: 1000,
    nextPayout: '2025-01-15',
    contributionAmount: 200,
    frequency: 'Monthly',
    progress: 0.75,
    isAdmin: true,
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
    isAdmin: false,
  },
  {
    id: '3',
    name: 'Neighborhood Group',
    members: 12,
    totalPool: 3600,
    nextPayout: '2025-01-22',
    contributionAmount: 300,
    frequency: 'Monthly',
    progress: 0.3,
    isAdmin: false,
  },
  {
    id: '4',
    name: 'Work Colleagues',
    members: 6,
    totalPool: 1200,
    nextPayout: '2025-01-30',
    contributionAmount: 200,
    frequency: 'Monthly',
    progress: 0.6,
    isAdmin: true,
  },
];

// Filter types
type FilterType = 'all' | 'admin' | 'member';

export default function CirclesScreen() {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter circles based on search query and active filter
  const filteredCircles = mockCircles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'admin' && circle.isAdmin) || 
      (activeFilter === 'member' && !circle.isAdmin);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Savings Circles</Text>
          <Pressable 
            style={[styles.createButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/circles/create')}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Create</Text>
          </Pressable>
        </View>

        {/* Search bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={20} color={theme.inactive} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search circles"
            placeholderTextColor={theme.inactive}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter tabs */}
        <View style={styles.filterContainer}>
          <FilterTab 
            label="All Circles" 
            isActive={activeFilter === 'all'} 
            onPress={() => setActiveFilter('all')}
          />
          <FilterTab 
            label="I'm Admin" 
            isActive={activeFilter === 'admin'} 
            onPress={() => setActiveFilter('admin')}
          />
          <FilterTab 
            label="I'm Member" 
            isActive={activeFilter === 'member'} 
            onPress={() => setActiveFilter('member')}
          />
        </View>

        {/* Circles list */}
        <FlatList
          data={filteredCircles}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CircleListItem 
              circle={item} 
              onPress={() => router.push(`/circles/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No circles found.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, isActive, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <Pressable 
      style={[
        styles.filterTab,
        isActive && { backgroundColor: theme.primary },
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.filterTabText,
          { color: isActive ? 'white' : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});