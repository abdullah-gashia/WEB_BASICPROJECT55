'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from "lucide-react";

export default function MainPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <div className="bg-[#9c1b1b] text-gray-200 rounded-lg p-8 w-full max-w-md shadow-md ">
                <div className="space-y-6">
                    {user ? (
                        <div className="text-center space-y-4">
                            
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-[#000] text-white py-3 rounded-md hover:bg-gray-700 transition-all font-semibold"
                            >
                                Welcome
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full bg-[#ff2525] text-white py-3 rounded-md hover:bg-gray-700 transition-all font-semibold flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </button>
                        </div>
                    )}

                    
                </div>
            </div>
        </div>
    );
}