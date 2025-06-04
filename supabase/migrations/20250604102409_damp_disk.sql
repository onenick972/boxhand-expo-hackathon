/*
  # Create Savings Circles Schema
  
  1. New Tables
    - circles: Main circle information
    - circle_members: Member relationships and roles
    - circle_contributions: Contribution tracking
  
  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    
  3. Performance
    - Add indexes for frequently queried columns
    - Add updated_at trigger
*/

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create circles table
CREATE TABLE IF NOT EXISTS circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  contribution_amount integer NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('Weekly', 'Bi-weekly', 'Monthly')),
  total_pool integer DEFAULT 0,
  contract_address text,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create circle_members table
CREATE TABLE IF NOT EXISTS circle_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  next_payout timestamptz,
  total_contributed integer DEFAULT 0,
  contribution_streak integer DEFAULT 0,
  UNIQUE(circle_id, user_id)
);

-- Create circle_contributions table
CREATE TABLE IF NOT EXISTS circle_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  amount integer NOT NULL,
  transaction_hash text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_contributions ENABLE ROW LEVEL SECURITY;

-- Circles policies
CREATE POLICY "Users can view circles they are members of"
  ON circles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circles.id
      AND circle_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create circles"
  ON circles
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Circle admins can update circles"
  ON circles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circles.id
      AND circle_members.user_id = auth.uid()
      AND circle_members.role = 'admin'
    )
  );

-- Circle members policies
CREATE POLICY "Users can view circle members"
  ON circle_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_members.circle_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Circle admins can manage members"
  ON circle_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_members.circle_id
      AND circle_members.user_id = auth.uid()
      AND circle_members.role = 'admin'
    )
  );

-- Circle contributions policies
CREATE POLICY "Users can view contributions in their circles"
  ON circle_contributions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_contributions.circle_id
      AND circle_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own contributions"
  ON circle_contributions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger to circles table
CREATE TRIGGER update_circles_updated_at
  BEFORE UPDATE ON circles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user_id ON circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_contributions_circle_id ON circle_contributions(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_contributions_user_id ON circle_contributions(user_id);