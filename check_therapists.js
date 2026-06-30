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
  console.log("Fetching therapists...");
  const { data, error } = await supabase.from('therapists').select('*');
  if (error) {
    console.error("Error fetching therapists:", error);
  } else {
    console.log(`Found ${data.length} therapists.`);
  }
}

main();
