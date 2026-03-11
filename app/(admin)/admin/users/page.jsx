'use client';
import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats') // Menggunakan API stats yang sudah ada atau buat API khusus user
            .then(res => res.json())
            .then(data => {
                // Asumsi data user dikirim melalui API stats atau API baru
                if (data.success) setUsers(data.users || []);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 animate-pulse text-gray-400">Memuat data pengguna...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black tracking-tight text-slate-800">PENGELOLAAN PENGGUNA</h1>
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-bold">
                    Total: {users.length} User
                </span>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-6">User</th>
                            <th className="p-6">Email</th>
                            <th className="p-6">Saldo</th>
                            <th className="p-6">Status Akun</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-6">
                                    <p className="font-bold text-slate-700">{user.username}</p>
                                    <p className="text-[10px] text-gray-400">ID: #{user.id}</p>
                                </td>
                                <td className="p-6 text-sm text-slate-600">{user.email}</td>
                                <td className="p-6 font-mono font-bold text-blue-600">
                                    Rp {Number(user.wallet_balance).toLocaleString('id-ID')}
                                </td>
                                <td className="p-6">
                                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                                        Aktif
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
