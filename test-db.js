const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  try {
    const { data, error } = await supabase.from('projects').select('*').limit(1);
    if (error) {
      console.error('Connection error:', error.message);
      if (error.message.includes('relation "projects" does not exist')) {
        console.log('✅ Connection successful, but the table "projects" is missing.');
      } else {
        console.log('❌ Connection failed.');
      }
    } else {
      console.log('✅ Connection successful! Found projects:', data.length);
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

testConnection();
