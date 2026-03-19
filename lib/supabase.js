import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://abc123xyz.supabase.co";   // ✅ YOUR REAL URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // ✅ REAL KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
