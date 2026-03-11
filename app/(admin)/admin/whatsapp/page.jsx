'use client';
import { useState, useEffect } from 'react';

export default function AdminWhatsAppManager() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch semua akun WA dari sisi admin
        fetch('/api/admin/stats') 
            .then(res => res.json())
            .then(data => {
                if (data.success) setSessions(data.wa_accounts || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black mb-8 tracking-tight text-slate-800">MONITORING SESI WHATSAPP</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">📱</div>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                                session.status === 'Connected' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                                {session.status}
                            </span>
                        </div>
                        <p className="font-black text-slate-700 text-lg">{session.phone_number || 'Belum Pairing'}</p>
                        <p className="text-xs text-gray-400 mb-4">Owner ID: #{session.user_id}</p>
                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-400">
                            <span>TOTAL BLAST: {session.total_sent}</span>
                            <button className="text-red-500 hover:text-red-700">PUTUSKAN</button>
                        </div>
                    </div>
                ))}
            </div>

            {sessions.length === 0 && !loading && (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed">
                    <p className="text-gray-400 font-bold">Tidak ada sesi WhatsApp yang aktif di server.</p>
                </div>
            )}
        </div>
    );
}
