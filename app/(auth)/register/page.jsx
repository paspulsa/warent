// File: app/(auth)/register/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', password: '', ref_code: ''
    });
    const [loading, setLoading] = useState(false);

    // Otomatis isi kode referral dari URL jika ada
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) setForm(prev => ({ ...prev, ref_code: ref }));
    }, [searchParams]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        
        if (data.success) {
            alert(data.message);
            router.push('/login');
        } else {
            alert(data.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-center mb-6">DAFTAR AKUN BARU</h1>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Nama Depan" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={e => setForm({...form, first_name: e.target.value})} required />
                        <input type="text" placeholder="Nama Belakang" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={e => setForm({...form, last_name: e.target.value})} />
                    </div>
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setForm({...form, email: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setForm({...form, password: e.target.value})} required />
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <label className="text-[10px] font-bold text-blue-600 uppercase">Kode Referral (Opsional)</label>
                        <input type="text" value={form.ref_code} className="w-full bg-transparent font-bold outline-none" 
                            onChange={e => setForm({...form, ref_code: e.target.value})} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        {loading ? 'Memproses...' : 'DAFTAR SEKARANG'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold">Login di sini</Link>
                </p>
            </div>
        </div>
    );
}
