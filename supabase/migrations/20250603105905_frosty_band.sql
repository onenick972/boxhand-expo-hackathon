/*
  # Fix RLS policies for users table

  1. Changes
    - Drop existing duplicate policies
    - Create new comprehensive RLS policies for users table
    
  2. Security
    - Enable RLS
    - Add policy for authenticated users to:
      - Insert their own profile
      - Read their own data
      - Update their own data
*/

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can manage own profile"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);