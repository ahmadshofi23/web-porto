-- ==========================================
-- 1. SCHEMA SETUP (TABLES & SECURITY)
-- ==========================================

-- Table for General Profile Settings
CREATE TABLE IF NOT EXISTS profile_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  cv_url TEXT,
  email TEXT,
  location TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table for Work Experience
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  duration TEXT, -- e.g., "Jan 2022 - Present"
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table for Contact Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE profile_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies (Safe check to avoid errors if they already exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public read profile') THEN
        CREATE POLICY "Public read profile" ON profile_info FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public read experiences') THEN
        CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public insert messages') THEN
        CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admin manage profile') THEN
        CREATE POLICY "Admin manage profile" ON profile_info FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admin manage experiences') THEN
        CREATE POLICY "Admin manage experiences" ON experiences FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admin manage messages') THEN
        CREATE POLICY "Admin manage messages" ON messages FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- ==========================================
-- 2. SEED DATA (INITIAL CONTENT)
-- ==========================================

-- Insert Initial Profile (Only if empty)
INSERT INTO profile_info (full_name, title, bio, email, location)
SELECT 
  'Ahmad Shofi', 
  'Senior Flutter Developer', 
  'Saya adalah developer aplikasi mobile yang berfokus pada performa tinggi, UI yang cantik, dan pengalaman pengguna yang mulus menggunakan Flutter. Berpengalaman dalam mengintegrasikan berbagai API kompleks dan Firebase.',
  'hello@ahmadshofi.dev',
  'Jakarta, Indonesia'
WHERE NOT EXISTS (SELECT 1 FROM profile_info);

-- Insert Sample Experiences (Only if empty)
INSERT INTO experiences (company, position, duration, description, order_index)
SELECT 'Tech Solutions Inc.', 'Lead Mobile Developer', 'Jan 2022 - Present', 'Memimpin tim untuk membangun aplikasi fintech skala besar dengan Flutter dan Clean Architecture.', 1
WHERE NOT EXISTS (SELECT 1 FROM experiences);

INSERT INTO experiences (company, position, duration, description, order_index)
SELECT 'Creative Apps Studio', 'Flutter Developer', 'Mei 2020 - Des 2021', 'Membangun aplikasi e-commerce dan sosial media dengan integrasi realtime database.', 2
WHERE NOT EXISTS (SELECT 1 FROM experiences);
