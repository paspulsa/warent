'use client';
import { useState, useEffect } from 'react';

export default function AdminWithdrawalPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch('/api/admin/withdrawal').then(res => res.json()).then(data => {
            if (data.success) setRequests(data.data);
        });
    }, []);

    const updateStatus = async (id, status) => {
        await fetch('/api/admin/withdrawal/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
        location.reload();
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black mb-8 text-slate-800">PENGELOLAAN WITHDRAWAL</h1>
            <div className="bg-white rounded-3xl border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase">
                        <tr>
                            <th className="p-6">User</th>
                            <th className="p-6">Jumlah</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td className="p-6 font-bold">{req.first_name}</td>
                                <td className="p-6 font-mono text-blue-600">Rp {Number(req.amount).toLocaleString()}</td>
                                <td className="p-6">{req.status}</td>
                                <td className="p-6">
                                    <button onClick={() => updateStatus(req.id, 'Accepted')} className="text-emerald-500 font-bold mr-4">Approve</button>
                                    <button onClick={() => updateStatus(req.id, 'Rejected')} className="text-red-500 font-bold">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
