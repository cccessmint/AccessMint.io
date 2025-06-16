'use client';

import { useState } from 'react';

export default function CreateCampaignForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    max_supply: '',
    mint_price: '',
    contract_address: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        max_supply: parseInt(form.max_supply, 10),
        mint_price: parseFloat(form.mint_price),
        contract_address: form.contract_address
      })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage('✅ Campaign created successfully!');
      setForm({ name: '', description: '', price: '', max_supply: '', mint_price: '', contract_address: '' });
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-6 bg-white shadow">
      <h2 className="text-xl mb-4">Create New Campaign</h2>

      <div className="mb-3">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-3">
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="mb-3">
        <input
          name="max_supply"
          type="number"
          placeholder="Max Supply"
          value={form.max_supply}
          onChange={handleChange}
          className="border p-2 w-full"
          required
          min="1"
        />
      </div>

      <div className="mb-3">
        <input
          name="mint_price"
          type="number"
          placeholder="Mint Price (MATIC)"
          value={form.mint_price}
          onChange={handleChange}
          className="border p-2 w-full"
          required
          min="0"
          step="0.0001"
        />
      </div>

      <div className="mb-3">
        <input
          name="contract_address"
          type="text"
          placeholder="Smart Contract Address"
          value={form.contract_address}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded w-full disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Campaign'}
      </button>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </form>
  );
}

