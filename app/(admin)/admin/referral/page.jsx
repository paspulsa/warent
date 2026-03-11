'use client';
import { useState, useEffect } from 'react';

export default function AdminReferralPage() {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats') // Data referral biasanya masuk dalam statistik global admin
            .then(res => res.json())
            .then(data => {
                // Asumsi data referral dikirim melalui property 'referrals'
                if (data.success) setReferrals(data.referrals || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black mb-8 text-slate-800 uppercase tracking-tight">Monitoring Jaringan Referral</h1>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-6">Member (Upliner)</th>
                            <th className="p-6">Member (Downliner)</th>
                            <th className="p-6">Tgl Join Downline</th>
                            <th className="p-6">Total Kontribusi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {referrals.map((ref, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition">
                                <td className="p-6">
                                    <p className="font-bold text-slate-700">{ref.upline_name}</p>
                                    <p className="text-[10px] text-blue-500 font-mono">CODE: {ref.referral_code}</p>
                                </td>
                                <td className="p-6 text-sm text-slate-600">
                                    {ref.downline_name}
                                </td>
                                <td className="p-6 text-xs text-gray-400">
                                    {new Date(ref.created_at).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-6 font-bold text-emerald-500 text-sm">
                                    Rp {Number(ref.total_bonus).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {referrals.length === 0 && !loading && (
                    <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                        Belum ada data referral terdeteksi
                    </div>
                )}
            </div>
        </div>
    );
}
