/*
  # Add INSERT policy for users table
  
  1. Changes
    - Add INSERT policy to allow new user registration
    
  2. Security
    - Enables new users to create their profile during registration
    - Only allows users to insert a row with their own auth.uid()
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);