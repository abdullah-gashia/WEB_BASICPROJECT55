'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/app/utils/vd';
import { useAuth } from '../charactors/Auth'
import React, { useEffect, useState } from 'react';
import '@/app/login/style.css';

function CursorAnimationPage() {
    const [cursorStyle, setCursorStyle] = useState<React.CSSProperties>({
        display: 'none',
        top: 0,
        left: 0,
    });

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.pageX;
            const y = e.pageY;

            setCursorStyle({
                top: `${y}px`,
                left: `${x}px`,
                display: 'block',
            });

            const mouseStopped = () => {
                setCursorStyle((prev) => ({ ...prev, display: 'none' }));
            };

            clearTimeout(timeout);
            timeout = setTimeout(mouseStopped, 1000);
        };

        const handleMouseOut = () => {
            setCursorStyle((prev) => ({ ...prev, display: 'none' }));
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <>
            <div className="cursor" style={cursorStyle}></div>
        </>
    );
}

type FormData = {
    username: string;
    email: string;
    password: string;
};

type ValidationError = {
    [K in keyof FormData]?: string[];
};

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<ValidationError>({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = (data: FormData) => {
        try {
            if (isSignUpMode) {
                registerSchema.parse(data);
            } else {
                loginSchema.parse(data);
            }
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: ValidationError = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        const field = err.path[0].toString() as keyof FormData;
                        if (!newErrors[field]) {
                            newErrors[field] = [];
                        }
                        newErrors[field]?.push(err.message);
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        if (!validateForm(formData)) return;

        setIsLoading(true);
        try {
            const endpoint = isSignUpMode ? '/api/auth/register' : '/api/auth/login';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setApiError(data.error || 'An error occurred');
                return;
            }

            if (isSignUpMode) {
                setSuccess('Account created successfully! You can now sign in.');
                setTimeout(() => setIsSignUpMode(false), 2000);
            } else {
                localStorage.setItem('session', JSON.stringify(data.session));
                setUser(data.session); 
                router.push('/');
            }
        } catch (error) {
            setApiError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUpMode(!isSignUpMode);
        setFormData({ username: '', email: '', password: '' });
        setErrors({});
        setApiError('');
        setSuccess('');
    };

    return (
        <div className="page">
            <CursorAnimationPage />
            <section className="main">
            <div>
                <div className="bg-white text-black rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative overflow-hidden w-[768px] max-w-full min-h-[480px] p-8 shadow-black">
                    <h2 className="text-2xl font-bold text-center mb-6 text-black">
                        {isSignUpMode ? 'Create an Account' : 'Login'}
                    </h2>

                    {apiError && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-6">
                            {apiError}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-md mb-6">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 px-8 py-4">
                        <div className="relative">
                            <div className="relative">
                                <i className="fas fa-user absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                    className={`w-full bg-transparent border-b ${errors.username ? 'border-red-500' : 'border-gray-500'} pl-8 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-500`}
                                />
                            </div>
                            {errors.username?.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                            ))}
                        </div>

                        {isSignUpMode && (
                            <div className="relative">
                                <div className="relative">
                                    <i className="fas fa-envelope absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full bg-transparent border-b ${errors.email ? 'border-red-500' : 'border-gray-500'} pl-8 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-500`}
                                    />
                                </div>
                                {errors.email?.map((error, index) => (
                                    <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <div className="relative">
                                <i className="fas fa-lock absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full bg-transparent border-b ${errors.password ? 'border-red-500' : 'border-gray-500'} pl-8 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-all"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password?.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#444444] text-white py-2 rounded-md hover:bg-blue-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {isSignUpMode ? 'Creating Account...' : 'Signing In...'}
                                </span>
                            ) : (
                                isSignUpMode ? 'Sign Up' : 'Sign In'
                            )}
                        </button>

                        <p className="text-center text-gray-400 text-sm">
                            {isSignUpMode ? (
                                <>
                                    Already have an account?{' '}
                                    <button type="button" onClick={toggleMode} className="text-blue-500 hover:underline">
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    สมัครเหอะ ไม่ได้ทำเงื่อนไขไรยากที{' '}
                                    <button type="button" onClick={toggleMode} className="text-blue-500 hover:underline">
                                        Sign up
                                    </button>
                                </>
                            )}
                        </p>
                    </form>
                </div>
            </div>
            </section>
        </div>
    );
}
