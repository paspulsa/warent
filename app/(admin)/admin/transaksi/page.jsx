'use client';
import { useState, useEffect } from 'react';

export default function AdminTransaksiPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats') // Mengambil data transaksi dari admin stats
            .then(res => res.json())
            .then(data => {
                if (data.success) setTransactions(data.recent_transactions || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black mb-8 tracking-tight text-slate-800 uppercase">Log Seluruh Transaksi</h1>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-6">ID</th>
                            <th className="p-6">User</th>
                            <th className="p-6">Tipe</th>
                            <th className="p-6">Jumlah</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Waktu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-6 text-xs font-mono text-gray-400">#{t.id}</td>
                                <td className="p-6">
                                    <p className="font-bold text-slate-700">User ID: {t.user_id}</p>
                                </td>
                                <td className="p-6">
                                    <span className={`text-[10px] font-black uppercase ${
                                        t.transaction_type === 'Withdrawal' ? 'text-red-500' : 
                                        t.transaction_type === 'Deposit' ? 'text-blue-500' : 'text-emerald-500'
                                    }`}>
                                        {t.transaction_type}
                                    </span>
                                </td>
                                <td className="p-6 font-bold text-slate-800">
                                    Rp {Number(t.amount).toLocaleString('id-ID')}
                                </td>
                                <td className="p-6">
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[10px] font-black">
                                        {t.status}
                                    </span>
                                </td>
                                <td className="p-6 text-xs text-gray-400">
                                    {new Date(t.created_at).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && !loading && (
                    <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                        Data transaksi kosong
                    </div>
                )}
            </div>
        </div>
    );
}
