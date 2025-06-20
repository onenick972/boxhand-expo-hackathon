import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface WalletSelectorProps {
  visible: boolean;
  onSelect: (wallet: 'pera' | 'myalgo' | 'defly' | 'exodus' | 'lute') => void;
  onClose: () => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ visible, onSelect, onClose }) => {
  const { theme } = useTheme();
  
  const wallets = [
    { id: 'pera', name: 'Pera Wallet' },
    { id: 'myalgo', name: 'MyAlgo Wallet' },
    { id: 'defly', name: 'Defly Wallet' },
    { id: 'exodus', name: 'Exodus Wallet' },
    { id: 'lute', name: 'Lute Wallet' },
  ] as const;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Select Wallet</Text>
          {wallets.map(wallet => (
            <Pressable 
              key={wallet.id} 
              style={[styles.option, { borderBottomColor: theme.border }]} 
              onPress={() => onSelect(wallet.id)}
            >
              <Text style={[styles.optionText, { color: theme.text }]}>{wallet.name}</Text>
            </Pressable>
          ))}
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: theme.inactive }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
  },
  option: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
  cancelText: {
    fontSize: 14,
  },
});

export default WalletSelector;