'use client';
import { useState, useEffect } from 'react';

export default function MemberWithdrawPage() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Ambil saldo dan riwayat khusus member
        fetch('/api/member/stats').then(res => res.json()).then(data => {
            if (data.success) setBalance(data.data.balance);
        });
        fetch('/api/member/withdrawal').then(res => res.json()).then(data => {
            if (data.success) setHistory(data.data);
        });
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/member/withdrawal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseInt(amount) })
        });
        const result = await res.json();
        alert(result.message);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black mb-8 text-slate-800">WITHDRAW SALDO</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-2">Saldo Anda</p>
                    <h2 className="text-4xl font-black text-blue-600 mb-6">Rp {Number(balance).toLocaleString()}</h2>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                        <input 
                            type="number" 
                            placeholder="Nominal Tarik" 
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black">TARIK DANA SEKARANG</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
