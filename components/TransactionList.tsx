import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowUpRight, ArrowDownRight, ArrowDownLeft } from 'lucide-react-native';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    type: 'sent',
    amount: 200,
    recipient: 'Family Circle',
    timestamp: '2023-12-28T10:30:00Z',
    txHash: '7YGTY...AB54',
  },
  {
    id: '2',
    type: 'received',
    amount: 1000,
    sender: 'Friends Savings',
    timestamp: '2023-12-26T14:15:00Z',
    txHash: 'QWER5...ZX78',
  },
  {
    id: '3',
    type: 'deposit',
    amount: 500,
    source: 'Bank Transfer',
    timestamp: '2023-12-23T09:45:00Z',
    txHash: 'POIU7...MN43',
  },
  {
    id: '4',
    type: 'sent',
    amount: 300,
    recipient: 'Work Colleagues',
    timestamp: '2023-12-20T16:30:00Z',
    txHash: 'GHJK5...FG21',
  },
];

type TransactionType = 'sent' | 'received' | 'deposit';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  recipient?: string;
  sender?: string;
  source?: string;
  timestamp: string;
  txHash: string;
}

interface TransactionListProps {
  transactions?: any[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions = mockTransactions }) => {
  const { theme } = useTheme();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const renderTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight size={20} color={theme.error} />;
      case 'received':
        return <ArrowDownRight size={20} color={theme.success} />;
      case 'deposit':
        return <ArrowDownLeft size={20} color={theme.accent} />;
      default:
        return null;
    }
  };
  
  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'sent':
        return `Sent to ${transaction.recipient}`;
      case 'received':
        return `Received from ${transaction.sender}`;
      case 'deposit':
        return `Deposit from ${transaction.source}`;
      default:
        return '';
    }
  };
  
  const getAmountColor = (type: TransactionType) => {
    switch (type) {
      case 'sent':
        return theme.error;
      case 'received':
        return theme.success;
      case 'deposit':
        return theme.accent;
      default:
        return theme.text;
    }
  };
  
  const getAmountPrefix = (type: TransactionType) => {
    switch (type) {
      case 'sent':
        return '-';
      case 'received':
      case 'deposit':
        return '+';
      default:
        return '';
    }
  };
  
  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={[styles.transactionItem, { borderBottomColor: theme.border }]}>
      <View 
        style={[
          styles.iconContainer, 
          { 
            backgroundColor: getAmountColor(item.type) + '20',
          }
        ]}
      >
        {renderTransactionIcon(item.type)}
      </View>
      
      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <Text style={[styles.transactionTitle, { color: theme.text }]}>
            {getTransactionTitle(item)}
          </Text>
          <Text 
            style={[
              styles.transactionAmount, 
              { color: getAmountColor(item.type) }
            ]}
          >
            {getAmountPrefix(item.type)}{item.amount} ALGO
          </Text>
        </View>
        
        <View style={styles.transactionFooter}>
          <Text style={[styles.transactionDate, { color: theme.inactive }]}>
            {formatDate(item.timestamp)}
          </Text>
          <Text style={[styles.transactionHash, { color: theme.inactive }]}>
            {item.txHash}
          </Text>
        </View>
      </View>
    </View>
  );
  
  return (
    <FlatList
      data={transactions}
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
  transactionItem: {
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
  transactionContent: {
    flex: 1,
    marginLeft: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionHash: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});

export default TransactionList;