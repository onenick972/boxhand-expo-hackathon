import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch,Alert  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { connectWallet as connectAlgorandWallet, isValidAlgorandAddress } from '@/lib/algorand';
import { User, Moon, Bell, Shield, Globe, CircleHelp as HelpCircle, LogOut, ChevronRight ,WalletCards} from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut, connectWallet: updateWallet } = useAuth();
  
  const handleConnectWallet = async () => {
    try {
      // Get wallet address from Algorand wallet
      const walletAddress = await connectAlgorandWallet('pera');
      
      // Validate the address
      if (!isValidAlgorandAddress(walletAddress)) {
        throw new Error('Invalid wallet address');
      }
      
      // Update user profile with wallet address
      await updateWallet(walletAddress);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Show error message to user
      Alert.alert(
        'Wallet Connection Failed',
        'Unable to connect your wallet. Please try again.'
      );
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
          </View>

          {/* Profile Section */}
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.profileCard, { borderColor: theme.border }]}
          >
            <View style={[styles.profileAvatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.profileInitial}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {user?.name || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.inactive }]}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
            <Pressable style={styles.editButton}>
              <Text style={[styles.editButtonText, { color: theme.primary }]}>
                Edit
              </Text>
            </Pressable>
          </BlurView>

          {/* Settings Sections */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
            
            <SettingItem 
              icon={<Moon size={20} color={theme.text} />}
              title="Dark Mode"
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.inactive, true: theme.primary }}
                  thumbColor="white"
                />
              }
              theme={theme}
            />
          </View>

          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
            
            <SettingItem 
              icon={<Bell size={20} color={theme.text} />}
              title="Push Notifications"
              rightElement={
                <Switch
                  value={true}
                  trackColor={{ false: theme.inactive, true: theme.primary }}
                  thumbColor="white"
                />
              }
              theme={theme}
            />
            
            <SettingItem 
              icon={<Bell size={20} color={theme.text} />}
              title="Payment Reminders"
              rightElement={
                <Switch
                  value={true}
                  trackColor={{ false: theme.inactive, true: theme.primary }}
                  thumbColor="white"
                />
              }
              theme={theme}
            />
          </View>

          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Account & Security</Text>
            
            <SettingItem 
              icon={<WalletCards size={20} color={theme.text} />}
              title="Connect Wallet"
              rightText={user?.walletAddress ? 'Connected' : 'Not Connected'}
              onPress={handleConnectWallet}
              showChevron
              theme={theme}
            />
            
            <SettingItem 
              icon={<Shield size={20} color={theme.text} />}
              title="Security Settings"
              showChevron
              theme={theme}
            />
          </View>

          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>General</Text>
            
            <SettingItem 
              icon={<Globe size={20} color={theme.text} />}
              title="Language"
              rightText="English"
              showChevron
              theme={theme}
            />
            
            <SettingItem 
              icon={<HelpCircle size={20} color={theme.text} />}
              title="Help & Support"
              showChevron
              theme={theme}
            />
          </View>

          <Pressable 
            style={[styles.logoutButton, { borderColor: theme.error }]}
            onPress={signOut}
          >
            <LogOut size={20} color={theme.error} />
            <Text style={[styles.logoutText, { color: theme.error }]}>
              Log Out
            </Text>
          </Pressable>

          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: theme.inactive }]}>
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  rightText?: string;
  showChevron?: boolean;
  theme: any;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  rightElement, 
  onPress,
  rightText, 
  showChevron = false,
  theme 
}) => {
  return (
    <Pressable 
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        {icon}
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
      </View>
      
      <View style={styles.settingRight}>
        {rightText && (
          <Text style={[styles.settingRightText, { color: theme.inactive }]}>
            {rightText}
          </Text>
        )}
        {rightElement}
        {showChevron && <ChevronRight size={20} color={theme.inactive} />}
      </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  profileCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  settingsSection: {
    marginTop: 24,
    marginHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 100,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});