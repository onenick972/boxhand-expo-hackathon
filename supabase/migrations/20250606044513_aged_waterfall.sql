/*
  # Add wallet address to users table
  
  1. Changes
    - Add wallet_address column to users table
    - Add unique constraint on wallet_address
    - Add validation check for valid Algorand addresses
*/

-- Add wallet_address column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS wallet_address text UNIQUE;

-- Add check constraint for valid Algorand addresses
ALTER TABLE users
ADD CONSTRAINT valid_wallet_address 
CHECK (
  wallet_address IS NULL OR 
  (wallet_address ~ '^[A-Z2-7]{58}$')
);