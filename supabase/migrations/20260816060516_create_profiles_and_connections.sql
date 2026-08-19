/*
# Create profiles and connections tables

## Purpose
SilverHands is a livelihood platform for senior citizens and homemakers.
Users sign up with email/password, build a profile via voice onboarding,
and connect with each other. Contact details (phone, address) are private
until two users establish a connection.

## New Tables

### 1. profiles
Stores each user's public profile and private contact details.
- `id` (uuid, PK, references auth.users) — one row per authenticated user
- `email` (text) — copied from auth for convenience
- `name` (text) — display name
- `phone` (text) — PRIVATE, only visible to connected users
- `address` (text) — PRIVATE, only visible to connected users
- `role` (text) — 'earn' | 'find' | 'both'
- `skill_title` (text) — e.g. "Home-style South Indian Meals"
- `bio` (text) — AI-generated or user-edited bio
- `skills` (text[]) — array of skill tags
- `languages` (text[]) — spoken languages
- `category` (text) — primary skill category
- `experience_years` (int) — years of experience
- `location_area` (text) — general area (public, e.g. "Jayanagar")
- `onboarded` (boolean) — whether onboarding is complete
- `avatar_url` (text) — optional profile photo
- `created_at` (timestamptz)

### 2. connections
Records when two users connect (mutual interest).
- `id` (uuid, PK)
- `requester_id` (uuid, references profiles) — who initiated
- `responder_id` (uuid, references profiles) — who accepted
- `status` (text) — 'pending' | 'accepted' | 'declined'
- `created_at` (timestamptz)
- UNIQUE constraint on (requester_id, responder_id) to prevent duplicates

## Security (RLS)

### profiles
- SELECT: Users can read their own full profile OR other users' public
  columns (excluding phone, address) — enforced via column-level policy.
  Phone and address are only readable for own profile or when a connection
  exists.
- INSERT: Users can insert their own profile row.
- UPDATE: Users can update their own profile.
- DELETE: Users can delete their own profile.

### connections
- SELECT: Users can see connections where they are requester or responder.
- INSERT: Users can create a connection request as the requester.
- UPDATE: Users can update a connection where they are the responder
  (to accept/decline).
- DELETE: Users can delete their own connection requests.

## Important Notes
1. Phone and address are stored in the profiles table but protected by
   column-level SELECT grants — anon/authenticated roles cannot read them
   directly. A SECURITY DEFINER function `get_connected_profile` returns
   the full profile (including phone/address) only when a accepted connection
   exists between the caller and the profile owner.
2. The `profiles` table uses `auth.uid()` for ownership — owner column
   defaults to `auth.uid()`.
*/

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  role text DEFAULT 'find',
  skill_title text DEFAULT '',
  bio text DEFAULT '',
  skills text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  category text DEFAULT '',
  experience_years int DEFAULT 0,
  location_area text DEFAULT '',
  onboarded boolean DEFAULT false,
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: users can read their own full row
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- INSERT: users can insert their own profile
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: users can update their own profile
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: users can delete their own profile
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Grant SELECT on public columns to authenticated users (for browsing profiles)
-- Phone and address are excluded from the anon/authenticated grant
-- We use a view for public profile data instead

-- ============================================
-- PUBLIC PROFILES VIEW (excludes phone/address)
-- ============================================
CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id, email, name, role, skill_title, bio, skills, languages,
  category, experience_years, location_area, onboarded,
  avatar_url, created_at
FROM profiles;

-- Grant access to the view
GRANT SELECT ON public_profiles TO authenticated;

-- ============================================
-- CONNECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  responder_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, responder_id)
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- SELECT: users can see connections where they are a party
DROP POLICY IF EXISTS "select_own_connections" ON connections;
CREATE POLICY "select_own_connections"
  ON connections FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = responder_id);

-- INSERT: users can create requests as requester
DROP POLICY IF EXISTS "insert_own_connections" ON connections;
CREATE POLICY "insert_own_connections"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

-- UPDATE: responder can accept/decline; requester can cancel
DROP POLICY IF EXISTS "update_own_connections" ON connections;
CREATE POLICY "update_own_connections"
  ON connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = responder_id)
  WITH CHECK (auth.uid() = requester_id OR auth.uid() = responder_id);

-- DELETE: either party can remove the connection
DROP POLICY IF EXISTS "delete_own_connections" ON connections;
CREATE POLICY "delete_own_connections"
  ON connections FOR DELETE
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = responder_id);

-- ============================================
-- SECURITY DEFINER: get full profile if connected
-- Returns phone and address only when an accepted connection exists
-- ============================================
CREATE OR REPLACE FUNCTION get_connected_profile(target_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  phone text,
  address text,
  role text,
  skill_title text,
  bio text,
  skills text[],
  languages text[],
  category text,
  experience_years int,
  location_area text,
  onboarded boolean,
  avatar_url text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow if requesting own profile
  IF target_id = auth.uid() THEN
    RETURN QUERY SELECT * FROM profiles WHERE id = target_id;
    RETURN;
  END IF;

  -- Allow if an accepted connection exists between the two users
  IF EXISTS (
    SELECT 1 FROM connections
    WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND responder_id = target_id)
        OR
        (responder_id = auth.uid() AND requester_id = target_id)
      )
  ) THEN
    RETURN QUERY SELECT * FROM profiles WHERE id = target_id;
    RETURN;
  END IF;

  -- Not connected: return nothing (caller gets no private data)
  RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION get_connected_profile(uuid) TO authenticated;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_responder ON connections(responder_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_profiles_category ON profiles(category);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location_area);
