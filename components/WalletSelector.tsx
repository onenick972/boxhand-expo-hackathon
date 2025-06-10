// components/WalletSelector.tsx
import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

interface WalletSelectorProps {
  visible: boolean;
  onSelect: (wallet: 'pera' | 'myalgo' | 'defly' | 'exodus' | 'lute') => void;
  onClose: () => void;
}

const WalletSelector:  React.FC<WalletSelectorProps> = ({ visible, onSelect, onClose })=>{
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
        <View style={styles.modal}>
          <Text style={styles.title}>Select Wallet</Text>
          {wallets.map(wallet => (
            <Pressable key={wallet.id} style={styles.option} onPress={() => onSelect(wallet.id)}>
              <Text style={styles.optionText}>{wallet.name}</Text>
            </Pressable>
          ))}
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
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
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
  cancelText: {
    color: '#999',
    fontSize: 14,
  },
});

export default WalletSelector;