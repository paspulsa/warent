// File: app/(admin)/withdrawal/page.jsx
'use client';
import { useEffect, useState } from 'react';

export default function AdminWithdrawal() {
    const [list, setList] = useState([]);

    const fetchWD = async () => {
        const res = await fetch('/api/admin/withdrawal');
        const data = await res.json();
        setList(data.data);
    };

    useEffect(() => { fetchWD(); }, []);

    const handleAction = async (id, action) => {
        const res = await fetch('/api/admin/withdrawal/update', {
            method: 'PATCH',
            body: JSON.stringify({ withdrawalId: id, action })
        });
        if (res.ok) fetchWD();
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Manajemen Penarikan Dana</h1>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px]">
                        <tr>
                            <th className="p-4">Member</th>
                            <th className="p-4">Nominal</th>
                            <th className="p-4">Bank/E-Wallet</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {list.map(wd => (
                            <tr key={wd.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-bold">{wd.first_name}</p>
                                    <p className="text-xs text-gray-400">{wd.email}</p>
                                </td>
                                <td className="p-4 font-bold text-blue-600">Rp {Number(wd.amount).toLocaleString()}</td>
                                <td className="p-4">
                                    <p className="font-bold uppercase text-xs">{wd.bank_name}</p>
                                    <p className="font-mono">{wd.bank_account_number}</p>
                                    <p className="text-[10px] text-gray-400">a/n {wd.bank_account_name}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${wd.status === 'Pending' ? 'bg-amber-100 text-amber-600' : wd.status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {wd.status}
                                    </span>
                                </td>
                                <td className="p-4 space-x-2">
                                    {wd.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleAction(wd.id, 'Accepted')} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold">Accept</button>
                                            <button onClick={() => handleAction(wd.id, 'Rejected')} className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold">Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
