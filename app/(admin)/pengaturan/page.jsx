// File: app/(admin)/pengaturan/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        blast_commission: 0,
        referral_blast_commission: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    const data = {};
                    res.data.forEach(item => {
                        data[item.setting_key] = item.setting_value;
                    });
                    setSettings(data);
                }
                setLoading(false);
            });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/admin/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        const result = await res.json();
        alert(result.message);
        setSaving(false);
    };

    if (loading) return <div className="p-8 font-bold text-gray-400">Loading settings...</div>;

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-3xl font-black text-slate-800 mb-2">PENGATURAN SISTEM</h1>
            <p className="text-gray-500 mb-8">Kelola parameter ekonomi dan komisi platform Anda.</p>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-700 mb-6 border-b pb-4">💸 Skema Komisi</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Komisi Blast (Per Pesan Sukses)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                                <input 
                                    type="number" 
                                    value={settings.blast_commission}
                                    onChange={e => setSettings({...settings, blast_commission: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xl text-blue-600"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 ml-1">* Nilai yang didapat member setiap kali berhasil mengirim 1 pesan blast.</p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Komisi Referral (Per Pesan Sukses Bawahan)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                                <input 
                                    type="number" 
                                    value={settings.referral_blast_commission}
                                    onChange={e => setSettings({...settings, referral_blast_commission: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xl text-emerald-600"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 ml-1">* Nilai bonus yang didapat Atasan setiap kali bawanannya berhasil mengirim 1 pesan blast.</p>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black tracking-widest hover:bg-black transition shadow-xl active:scale-95 disabled:bg-gray-300"
                >
                    {saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                </button>
            </form>
        </div>
    );
}
