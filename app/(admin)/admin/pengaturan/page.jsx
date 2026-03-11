'use client';
import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        blast_commission: '',
        referral_blast_commission: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const mapped = {};
                    data.data.forEach(s => mapped[s.setting_key] = s.setting_value);
                    setSettings(mapped);
                }
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
        if (res.ok) alert("Pengaturan Berhasil Disimpan!");
        setSaving(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black mb-8 text-slate-800 uppercase tracking-tight">Konfigurasi Sistem</h1>

            <div className="max-w-2xl bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <label className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-4">
                            Komisi Per Klik "Mulai Blast" (Member)
                        </label>
                        <div className="flex items-center space-x-4">
                            <span className="text-xl font-bold text-blue-300">Rp</span>
                            <input 
                                type="number"
                                value={settings.blast_commission}
                                onChange={(e) => setSettings({...settings, blast_commission: e.target.value})}
                                className="w-full bg-white p-4 rounded-xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="500"
                            />
                        </div>
                        <p className="text-[10px] text-blue-400 mt-2 italic">*Jumlah uang yang didapat member saat sukses menjalankan satu antrian blast.</p>
                    </div>

                    <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                        <label className="text-xs font-black text-emerald-600 uppercase tracking-widest block mb-4">
                            Komisi Referral (Upliner)
                        </label>
                        <div className="flex items-center space-x-4">
                            <span className="text-xl font-bold text-emerald-300">Rp</span>
                            <input 
                                type="number"
                                value={settings.referral_blast_commission}
                                onChange={(e) => setSettings({...settings, referral_blast_commission: e.target.value})}
                                className="w-full bg-white p-4 rounded-xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="100"
                            />
                        </div>
                        <p className="text-[10px] text-emerald-400 mt-2 italic">*Bonus untuk upline setiap kali downline-nya menekan tombol blast.</p>
                    </div>

                    <button 
                        disabled={saving}
                        className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xs hover:bg-black transition shadow-xl disabled:bg-gray-400"
                    >
                        {saving ? 'MENYIMPAN...' : 'UPDATE PENGATURAN'}
                    </button>
                </form>
            </div>
        </div>
    );
}
