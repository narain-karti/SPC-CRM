import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) {
    envVars[key.trim()] = val.join('=').trim().replace(/"/g, '');
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: b } = await supabase.from('branches').select('*');
  console.log(`Found ${b?.length || 0} branches.`);
  const { data: t } = await supabase.from('therapists').select('*');
  console.log(`Found ${t?.length || 0} therapists.`);
}

main();
