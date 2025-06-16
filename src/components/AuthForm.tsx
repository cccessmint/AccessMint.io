'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({ email });

    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Check your email for magic link.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        className="border p-2 w-full"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded w-full disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>

      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
}

