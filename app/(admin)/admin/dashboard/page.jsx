export const dynamic = 'force-dynamic';
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(res => {
                if (res.success) setStats(res.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 font-bold text-gray-400 animate-pulse">Menghubungkan ke pusat data...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">OVERVIEW SISTEM</h1>

            {/* Alert Penarikan Pending */}
            {stats?.pending_withdrawals > 0 && (
                <Link href="/admin/withdrawal" className="mb-8 block bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm hover:bg-amber-100 transition">
                    <div className="flex items-center">
                        <span className="text-2xl mr-4">⚠️</span>
                        <div>
                            <p className="text-amber-800 font-bold">Persetujuan Dibutuhkan!</p>
                            <p className="text-amber-700 text-sm">Ada <b>{stats.pending_withdrawals}</b> permintaan penarikan dana yang belum Anda proses.</p>
                        </div>
                    </div>
                </Link>
            )}

            {/* Grid Statistik Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Member</p>
                    <h2 className="text-3xl font-black text-slate-800">{stats.total_users}</h2>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saldo Beredar</p>
                    <h2 className="text-3xl font-black text-blue-600">Rp {Number(stats.circulating_balance).toLocaleString('id-ID')}</h2>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blast Sukses</p>
                    <h2 className="text-3xl font-black text-emerald-500">{stats.total_sent}</h2>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blast Gagal</p>
                    <h2 className="text-3xl font-black text-red-500">{stats.total_failed}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tabel User Terbaru */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Member Terbaru</h3>
                        <Link href="/admin/users" className="text-xs text-blue-600 font-bold hover:underline">Lihat Semua</Link>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Tanggal Daftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recent_users.map((user, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-slate-700">{user.first_name}</td>
                                    <td className="p-4 text-gray-500">{user.email}</td>
                                    <td className="p-4 text-gray-400">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Info Cepat / Tips */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white">
                    <h3 className="text-lg font-bold mb-4">Tips Performa 💡</h3>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex gap-3">
                            <span className="text-blue-400">✔</span>
                            <span>Pastikan materi iklan dirotasi secara berkala agar akun member tidak cepat terblokir.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400">✔</span>
                            <span>Cek daftar nomor target secara rutin untuk membersihkan nomor yang sudah tidak aktif.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400">✔</span>
                            <span>Proses penarikan dana secepat mungkin untuk menjaga kepercayaan member.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
