
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://ndnjhrwapmkdoxbwzcaf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbmpocndhcG1rZG94Ynd6Y2FmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDg2MTU3MSwiZXhwIjoyMDU2NDM3NTcxfQ.6Dpb7gjnJujx-5K98tgkZqL5UvpwQhumZ5xs0h1BfiY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
