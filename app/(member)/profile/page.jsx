// File: app/(member)/profile/page.jsx (Bagian Password)
'use client';

import { useState } from 'react';

export default function ChangePasswordSection() {
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });

        if (passData.new !== passData.confirm) {
            return setMsg({ text: 'Konfirmasi password baru tidak cocok!', type: 'error' });
        }

        setLoading(true);
        try {
            const res = await fetch('/api/member/profile/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passData.current,
                    newPassword: passData.new
                })
            });
            const data = await res.json();

            if (data.success) {
                setMsg({ text: data.message, type: 'success' });
                setPassData({ current: '', new: '', confirm: '' });
            } else {
                setMsg({ text: data.message, type: 'error' });
            }
        } catch (err) {
            setMsg({ text: 'Terjadi kesalahan sistem', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm mt-8">
            <h2 className="text-xl font-black text-slate-800 mb-6">KEAMANAN AKUN</h2>
            
            {msg.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
                </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password Saat Ini</label>
                    <input 
                        type="password" 
                        value={passData.current}
                        onChange={e => setPassData({...passData, current: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                        required 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password Baru</label>
                        <input 
                            type="password" 
                            value={passData.new}
                            onChange={e => setPassData({...passData, new: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Konfirmasi</label>
                        <input 
                            type="password" 
                            value={passData.confirm}
                            onChange={e => setPassData({...passData, confirm: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                            required 
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition shadow-lg active:scale-95 disabled:bg-gray-300"
                >
                    {loading ? 'MEMPROSES...' : 'PERBARUI PASSWORD'}
                </button>
            </form>
        </div>
    );
}
