import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://keytmfcrznqwczbxrour.supabase.co as string;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleXRtZmNyem5xd2N6Ynhyb3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzU2MDUsImV4cCI6MjA2MzkxMTYwNX0.5Eev16vBcO5K861FCLlgp1iMtoRu7yFtf3GiYCV9V2U as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

