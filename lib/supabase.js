import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fjqtjqlwpzmuylxjqpri.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcXRqcWx3cHptdXlseGpxcHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDg4MTUsImV4cCI6MjA4OTUyNDgxNX0.gf_8VdDAv76CiwEEc-v54MJtiGHUrIaBBbNhm5iWh1M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
