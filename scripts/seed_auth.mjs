import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const usersToCreate = [
  {
    email: "admin@stabilityphysio.com",
    password: "Password123!",
    name: "Master Admin",
    role: "master_admin"
  },
  {
    email: "branch@stabilityphysio.com",
    password: "Password123!",
    name: "Branch Admin",
    role: "branch_admin"
  },
  {
    email: "reception@stabilityphysio.com",
    password: "Password123!",
    name: "Receptionist",
    role: "receptionist"
  },
  {
    email: "physio@stabilityphysio.com",
    password: "Password123!",
    name: "Physiotherapist",
    role: "physiotherapist"
  }
];

async function seedAuth() {
  console.log("Seeding Auth Users...");

  for (const u of usersToCreate) {
    console.log(`Creating ${u.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: {
        data: {
          name: u.name,
          role: u.role,
        }
      }
    });

    if (error) {
      console.error(`❌ Failed to create ${u.email}:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } else {
      console.log(`✅ Created ${u.email}`);
    }
  }
  console.log("Done!");
}

seedAuth();
