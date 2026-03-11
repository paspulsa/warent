'use client';
import { useState, useEffect } from 'react';

export default function MemberWithdrawal() {
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await fetch('/api/member/stats');
        const data = await res.json();
        if (data.success) {
            setBalance(data.data.balance);
        }

        const resHist = await fetch('/api/member/withdrawal');
        const dataHist = await resHist.json();
        if (dataHist.success) {
            setHistory(dataHist.data);
        }
        setLoading(false);
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (amount < 50000) return alert("Minimal penarikan Rp 50.000");
        
        const res = await fetch('/api/member/withdrawal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseInt(amount) })
        });
        const result = await res.json();
        if (result.success) {
            alert("Permintaan penarikan berhasil dikirim!");
            setAmount('');
            fetchData();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">PENARIKAN DANA</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form WD */}
                <div className="md:col-span-1 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Saldo Tersedia</p>
                    <h2 className="text-3xl font-black text-blue-600 mb-6">Rp {Number(balance).toLocaleString('id-ID')}</h2>
                    
                    <form onSubmit={handleWithdraw} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nominal (Min. 50.000)</label>
                            <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="0"
                                required
                            />
                        </div>
                        <button className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-2xl font-black text-xs transition shadow-lg">
                            AJUKAN PENARIKAN
                        </button>
                    </form>
                </div>

                {/* Riwayat WD */}
                <div className="md:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="font-bold text-slate-700">Riwayat Penarikan</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50">
                                <tr>
                                    <th className="p-6">Tanggal</th>
                                    <th className="p-6">Nominal</th>
                                    <th className="p-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {history.map((h) => (
                                    <tr key={h.id} className="hover:bg-gray-50/50 transition">
                                        <td className="p-6 text-sm text-slate-600">{new Date(h.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="p-6 font-bold text-slate-700">Rp {Number(h.amount).toLocaleString('id-ID')}</td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                                                h.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 
                                                h.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {h.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {history.length === 0 && !loading && <p className="p-10 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">Belum ada riwayat</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
