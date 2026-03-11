'use client';
import { useState, useEffect } from 'react';

export default function AdminKontakPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const res = await fetch('/api/admin/kontak');
        const data = await res.json();
        if (data.success) setContacts(data.data);
        setLoading(false);
    };

    const handleImport = async (e) => {
        e.preventDefault();
        // Logika import CSV/Excel bisa ditaruh di sini
        alert("Fitur import sedang disiapkan!");
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Database Kontak Target</h1>
                <div className="flex space-x-2">
                    <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition">
                        + TAMBAH MANUAL
                    </button>
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-black transition">
                        IMPORT CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-6">Nama Kontak</th>
                            <th className="p-6">Nomor WhatsApp</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {contacts.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-6">
                                    <p className="font-bold text-slate-700">{c.name || 'No Name'}</p>
                                </td>
                                <td className="p-6 font-mono text-sm text-blue-600">{c.phone_number}</td>
                                <td className="p-6">
                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-[10px] font-bold">READY</span>
                                </td>
                                <td className="p-6">
                                    <button className="text-red-400 hover:text-red-600 text-xs">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {contacts.length === 0 && !loading && (
                    <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                        Database kontak masih kosong
                    </div>
                )}
            </div>
        </div>
    );
}
