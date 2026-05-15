import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tmwxavbfdgfseltaohgi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtd3hhdmJmZGdmc2VsdGFvaGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDI0MDgsImV4cCI6MjA4OTYxODQwOH0.AtgwAG11xAIkiHmlXLdSyEAsMK3tGuu0uedceaQix-M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
