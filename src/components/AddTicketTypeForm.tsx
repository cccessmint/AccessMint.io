'use client';

import { useState } from 'react';

export default function AddTicketTypeForm({ campaignId }: { campaignId: string }) {
  const [form, setForm] = useState({
    type_name: '',
    price: '',
    max_supply: '',
    image_url: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/ticket-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaignId,
        type_name: form.type_name,
        price: parseFloat(form.price),
        max_supply: parseInt(form.max_supply),
        image_url: form.image_url
      }),
    });

    if (res.ok) {
      setMessage('✅ Ticket type added');
      setForm({ type_name: '', price: '', max_supply: '', image_url: '' });
    } else {
      const data = await res.json();
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow mb-4">
      <h3 className="mb-3 text-lg">Add Ticket Type</h3>

      <input className="border p-2 mb-2 w-full" name="type_name" placeholder="Ticket Name" value={form.type_name} onChange={handleChange} required />
      <input className="border p-2 mb-2 w-full" name="price" placeholder="Price (MATIC)" type="number" value={form.price} onChange={handleChange} required />
      <input className="border p-2 mb-2 w-full" name="max_supply" placeholder="Max Supply" type="number" value={form.max_supply} onChange={handleChange} required />
      <input className="border p-2 mb-2 w-full" name="image_url" placeholder="Image URL for Metadata" value={form.image_url} onChange={handleChange} required />

      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Add Ticket Type</button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}

