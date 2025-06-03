import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, ChevronRight, ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

// Frequency options
const frequencyOptions = ['Weekly', 'Bi-weekly', 'Monthly'];

export default function CreateCircleScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  
  // Form state
  const [circleName, setCircleName] = useState('');
  const [description, setDescription] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [memberEmails, setMemberEmails] = useState('');
  
  // Form validation
  const isFormValid = circleName && contributionAmount && memberEmails;
  
  // Handle form submission
  const handleCreateCircle = () => {
    // In a real app, this would connect to the blockchain to create a new circle
    // and invite members via email
    
    // For this demo, we'll just navigate back to the circles screen
    router.replace('/circles');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create Circle</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.infoCard, { borderColor: theme.border }]}
            >
              <Info size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.text }]}>
                Creating a circle will deploy a smart contract on the Algorand blockchain. 
                All members will need to connect their wallets to participate.
              </Text>
            </BlurView>
            
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Circle Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Circle Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={circleName}
                onChangeText={setCircleName}
                placeholder="Enter circle name"
                placeholderTextColor={theme.inactive}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Description</Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the purpose of this circle"
                placeholderTextColor={theme.inactive}
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Contribution Settings</Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Contribution Amount</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={[
                    styles.amountInput,
                    { 
                      backgroundColor: theme.card,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={contributionAmount}
                  onChangeText={setContributionAmount}
                  placeholder="0"
                  placeholderTextColor={theme.inactive}
                  keyboardType="numeric"
                />
                <View style={[styles.currencyLabel, { backgroundColor: theme.primary }]}>
                  <Text style={styles.currencyText}>ALGO</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Frequency</Text>
              <Pressable
                style={[
                  styles.dropdown,
                  { 
                    backgroundColor: theme.card,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setShowFrequencyDropdown(!showFrequencyDropdown)}
              >
                <Text style={[styles.dropdownText, { color: theme.text }]}>
                  {frequency}
                </Text>
                {showFrequencyDropdown ? (
                  <ChevronUp size={20} color={theme.text} />
                ) : (
                  <ChevronDown size={20} color={theme.text} />
                )}
              </Pressable>
              
              {showFrequencyDropdown && (
                <View 
                  style={[
                    styles.dropdownMenu, 
                    { 
                      backgroundColor: theme.card,
                      borderColor: theme.border
                    }
                  ]}
                >
                  {frequencyOptions.map((option) => (
                    <Pressable
                      key={option}
                      style={[
                        styles.dropdownItem,
                        option === frequency && { backgroundColor: theme.primary + '20' }
                      ]}
                      onPress={() => {
                        setFrequency(option);
                        setShowFrequencyDropdown(false);
                      }}
                    >
                      <Text 
                        style={[
                          styles.dropdownItemText, 
                          { 
                            color: option === frequency ? theme.primary : theme.text 
                          }
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Invite Members</Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Member Emails</Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={memberEmails}
                onChangeText={setMemberEmails}
                placeholder="Enter email addresses separated by commas"
                placeholderTextColor={theme.inactive}
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <Pressable
              style={[
                styles.createButton,
                { backgroundColor: theme.primary },
                !isFormValid && { opacity: 0.7 }
              ]}
              onPress={handleCreateCircle}
              disabled={!isFormValid}
            >
              <Text style={styles.createButtonText}>Create Circle</Text>
            </Pressable>
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
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'flex-start',
    gap: 12,
    overflow: 'hidden',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  currencyLabel: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  currencyText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  dropdown: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  createButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});