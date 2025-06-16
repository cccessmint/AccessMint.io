'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminCreateCampaignForm() {
  const supabase = createClientComponentClient();
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    symbol: '',
    price: '',
    max_supply: '',
    base_uri: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    getUser();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setMessage('❌ User not authenticated');
      return;
    }

    setLoading(true);
    setMessage('');

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        symbol: form.symbol,
        mint_price: form.price,
        max_supply: form.max_supply,
        base_uri: form.base_uri,
        created_by: userId
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage(`✅ Contract deployed: ${data.contractAddress}`);
      setForm({ name: '', symbol: '', price: '', max_supply: '', base_uri: '' });
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl mb-4">Deploy New Campaign</h2>

      <div className="mb-3">
        <input
          name="name"
          placeholder="Campaign Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="symbol"
          placeholder="Token Symbol"
          value={form.symbol}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="price"
          placeholder="Mint Price (MATIC)"
          type="number"
          min="0"
          step="0.0001"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="max_supply"
          placeholder="Max Supply"
          type="number"
          min="1"
          value={form.max_supply}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="base_uri"
          placeholder="Base URI (API URL)"
          value={form.base_uri}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded w-full disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Deploying...' : 'Deploy Contract'}
      </button>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </form>
  );
}

