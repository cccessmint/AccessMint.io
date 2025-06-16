import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://keytmfcrznqwczbxrour.supabase.co as string;
const supabaseServiceKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleXRtZmNyem5xd2N6Ynhyb3VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODMzNTYwNSwiZXhwIjoyMDYzOTExNjA1fQ.bVj4T2KPL2fUHi9UgWp5yiz6AJgFr5JWff_wBanXUFY as string;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

