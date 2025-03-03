// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndnjhrwapmkdoxbwzcaf.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbmpocndhcG1rZG94Ynd6Y2FmIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDA4NjE1NzEsImV4cCI6MjA1NjQzNzU3MX0.pbSGTKGtRG8cymrhilIDGahVy3NIiN8wVLeSnmcsOoE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
