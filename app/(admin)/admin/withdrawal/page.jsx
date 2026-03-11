'use client';
import { useState, useEffect } from 'react';

export default function AdminWithdrawalPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/member/withdrawal').then(res => res.json()).then(data => {
      if (data.success) setRequests(data.data);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await fetch('/api/admin/withdrawal/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6">PENGELOLAAN PENARIKAN DANA</h1>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Jumlah</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map(req => (
              <tr key={req.id}>
                <td className="p-4 font-bold">#{req.user_id}</td>
                <td className="p-4">Rp {Number(req.amount).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4">
                  {req.status === 'Pending' && (
                    <button onClick={() => updateStatus(req.id, 'Success')} className="text-blue-600 text-xs font-bold">Setujui</button>
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
