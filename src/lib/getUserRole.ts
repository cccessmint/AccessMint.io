import { supabaseAdmin } from './supabaseAdmin';

export async function getUserRole(userId: string): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data?.role) {
    return 'partner';
  }

  return data.role;
}

