'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useAuth } from './charactors/Auth';

export default function MainPage() {
  const router = useRouter();
  const { user } = useAuth();
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#9c1b1b] text-gray-200 rounded-lg p-8 w-full max-w-md shadow-md space-y-8">
        {user ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Please Sign In</h1>
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
  );
}
