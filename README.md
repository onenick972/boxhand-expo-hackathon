# BoxHand - Decentralized Micro-Savings Circles App

BoxHand is a React Native mobile application that facilitates decentralized micro-savings circles using the Algorand blockchain. The app enables users to create or join savings groups, manage contributions, and build trust through consistent participation.

## Features

- **User Authentication & Wallet Integration**: Secure login system with Algorand wallet integration
- **Savings Circle Management**: Create and join savings circles with customizable contribution schedules
- **Smart Contract Logic**: Algorand-based smart contracts for transparent fund management
- **Trust Score System**: On-chain reputation engine tracking participation consistency
- **Collateral-Free Micro-Loans**: Request loans based on participation history
- **Analytics Dashboard**: Track trust score, contribution history, and circle statistics

## Technical Stack

- **Framework**: React Native with Expo
- **UI Components**: Custom styled components
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Blockchain Integration**: Algorand SDK
- **Authentication**: Firebase Authentication
- **Secure Storage**: Expo SecureStore

## Smart Contract Interaction

The app interacts with Algorand smart contracts to manage the following:

1. **Circle Creation**: Deploying new smart contracts for each savings circle
2. **Contribution Tracking**: Recording contributions with timestamps
3. **Disbursement Logic**: Automated rotation-based payouts to members
4. **Trust Score Calculation**: On-chain reputation based on participation history
5. **Loan Management**: Handling loan requests and repayments

### Wallet Setup

To use the BoxHand app:

1. Create a BoxHand account using email or social login
2. Connect an existing Algorand wallet (Pera Wallet or MyAlgoConnect)
3. Ensure your wallet has sufficient ALGO for transactions and contributions

## Project Structure

```
/app                     # Main screens and navigation
  /(auth)                # Authentication screens
  /(tabs)                # Main tab screens
  /circles               # Circle management screens
/components              # Reusable UI components
/contexts                # React contexts (Auth, Theme)
/constants               # App constants and theme definitions
/hooks                   # Custom React hooks
/services                # API and blockchain services
/types                   # TypeScript type definitions
```

## Development Setup

1. Clone the repository
2. Copy environment variables:
   ```
   cp .env.example .env.local
   ```
3. Fill in your environment variables in `.env.local`
4. Install dependencies:
   ```
   npm install
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Environment Setup

### Required Environment Variables

1. **Supabase**: Create a project at [supabase.com](https://supabase.com)
   - `EXPO_PUBLIC_SUPABASE_URL`: Your project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your project's anon/public key

2. **WalletConnect**: Create a project at [cloud.walletconnect.com](https://cloud.walletconnect.com)
   - `EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your project ID

3. **Algorand**: Configure blockchain connection
   - For TestNet (development): Use the provided TestNet endpoints
   - For MainNet (production): Use MainNet endpoints

### Environment Files

- `.env.example`: Template with all required variables
- `.env.local`: Your local development configuration (not committed)
- Production: Set environment variables in your hosting platform

## Building for Production

```
npm run build:web
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT