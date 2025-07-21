import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wifsqonbnfmwtqvupqbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZnNxb25ibmZtd3RxdnVwcWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNjMsImV4cCI6MjA2NzE1NjI2M30.A7o3vhEaNZb9lmViHA_KQrwzKJTBWpsD6KbHqkkput0';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// Real-time subscription helper
export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
};

// Unsubscribe helper
export const unsubscribe = (subscription: any) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};

// Health check
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};