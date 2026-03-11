'use client';
import { useState, useEffect } from 'react';

export default function WhatsAppPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/member/whatsapp') // Pastikan API ini mengembalikan daftar akun
      .then(res => res.json())
      .then(data => {
        if (data.success) setAccounts(data.data);
        setLoading(false);
      });
  }, []);

  const handleStartBlast = async (waAccountId, clientId) => {
    const limit = prompt("Masukkan limit pesan (Contoh: 100):", "50");
    if (!limit) return;

    const res = await fetch('/api/member/blast/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waAccountId, clientId, limit: parseInt(limit) })
    });
    const result = await res.json();
    alert(result.message);
  };

  if (loading) return <div className="p-8 animate-pulse text-gray-400">Memuat akun...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6 tracking-tight">WHATSAPP SAYA</h1>
      <div className="grid gap-4">
        {accounts.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed p-12 rounded-2xl text-center text-gray-400">
            Belum ada akun WhatsApp.
          </div>
        ) : (
          accounts.map(acc => (
            <div key={acc.id} className="bg-white p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${acc.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-bold text-lg">{acc.phone_number || 'Unnamed Account'}</p>
                  <p className="text-xs text-gray-400 font-mono">{acc.client_id}</p>
                </div>
              </div>
              {/* TOMBOL MULAI BLAST DI SATUAN AKUN */}
              <button 
                onClick={() => handleStartBlast(acc.id, acc.client_id)}
                disabled={acc.status !== 'Connected'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                MULAI BLAST 🚀
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
