'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';

export default function MemberDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/member/stats')
            .then(res => res.json())
            .then(res => {
                if (res.success) setStats(res.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 font-bold animate-pulse text-gray-400">Menghitung statistik...</div>;

    const referralLink = `${window.location.origin}/register?ref=${stats?.referral_code}`;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">RINGKASAN AKUN</h1>

            {/* Baris Atas: Saldo & Bonus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Saldo Dompet</p>
                    <h2 className="text-4xl font-black">Rp {Number(stats?.balance).toLocaleString('id-ID')}</h2>
                    <div className="mt-6 flex gap-4">
                        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-xs font-bold transition">Tarik Dana</button>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Bonus Referral Diterima</p>
                    <h2 className="text-4xl font-black text-emerald-500">Rp {Number(stats?.ref_bonus).toLocaleString('id-ID')}</h2>
                </div>
            </div>

            {/* Baris Tengah: Statistik Pengiriman */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">WA Terhubung</p>
                    <p className="text-2xl font-black text-blue-600">{stats?.active_wa} / {stats?.total_wa}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Pesan Terkirim</p>
                    <p className="text-2xl font-black text-slate-800">{stats?.sent}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Pesan Gagal</p>
                    <p className="text-2xl font-black text-red-500">{stats?.failed}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Potensi Earning</p>
                    <p className="text-2xl font-black text-slate-400">LIVE</p>
                </div>
            </div>

            {/* Bagian Bawah: Link Referral */}
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Ajak Teman, Dapat Cuan! 🔗</h3>
                        <p className="text-slate-400 text-sm">Dapatkan komisi setiap kali bawahan Anda menekan tombol "Mulai Blast".</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2 bg-slate-800 p-2 rounded-xl">
                        <input 
                            readOnly 
                            value={referralLink} 
                            className="bg-transparent border-none outline-none px-4 text-xs font-mono text-blue-400 w-full"
                        />
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(referralLink);
                                alert('Link Referral disalin!');
                            }}
                            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap"
                        >
                            SALIN LINK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
