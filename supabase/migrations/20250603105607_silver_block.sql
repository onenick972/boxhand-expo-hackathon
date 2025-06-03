/*
  # Add INSERT policy for users table
  
  1. Changes
    - Add INSERT policy to allow new users to create their profile
    
  2. Security
    - New policy allows users to insert their own profile data
    - Policy ensures user can only create a profile with their own auth.uid
*/

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can create own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);