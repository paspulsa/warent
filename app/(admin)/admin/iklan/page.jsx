'use client';
import { useState, useEffect } from 'react';

export default function AdminIklanPage() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', message_content: '' });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        const res = await fetch('/api/admin/iklan'); // Pastikan API ini sudah dibuat
        const data = await res.json();
        if (data.success) setAds(data.data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/admin/iklan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            setForm({ title: '', message_content: '' });
            fetchAds();
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        await fetch(`/api/admin/iklan/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active: !currentStatus })
        });
        fetchAds();
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black mb-8 text-slate-800 uppercase tracking-tight">Manajemen Materi Iklan</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Input Iklan Baru */}
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-sm font-bold text-blue-600 mb-6 uppercase tracking-widest">Tambah Materi Baru</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Judul Iklan</label>
                            <input 
                                value={form.title}
                                onChange={(e) => setForm({...form, title: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Contoh: Promo Ramadhan"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Isi Pesan Blast</label>
                            <textarea 
                                value={form.message_content}
                                onChange={(e) => setForm({...form, message_content: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm h-40 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Tulis pesan lengkap di sini..."
                                required
                            />
                        </div>
                        <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition">
                            SIMPAN MATERI
                        </button>
                    </form>
                </div>

                {/* Daftar Iklan */}
                <div className="lg:col-span-2 space-y-4">
                    {ads.map((ad) => (
                        <div key={ad.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded">#{ad.id}</span>
                                    <h3 className="font-bold text-slate-800">{ad.title}</h3>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 italic">"{ad.message_content}"</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => toggleStatus(ad.id, ad.is_active)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${
                                        ad.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {ad.is_active ? 'AKTIF' : 'NON-AKTIF'}
                                </button>
                                <button className="text-red-400 hover:text-red-600 text-xs">Hapus</button>
                            </div>
                        </div>
                    ))}
                    {ads.length === 0 && !loading && (
                        <div className="bg-gray-50 border-2 border-dashed p-20 rounded-[3rem] text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                            Materi iklan belum tersedia
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
