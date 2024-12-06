'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/app/charactors/Auth';
import Game from '@/components/Game';
import AdminTable from '@/components/AdminTable';
import UserTable from '@/components/UserTable';
import EditUserForm from '@/components/EditUsers';
import { toast } from "@/components/ui/use-toast";

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsLoading(false);
    }, [user, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const usersResponse = await fetch('/api/users/get');
                if (!usersResponse.ok) throw new Error('Failed to fetch users');
                const usersData = await usersResponse.json();
                setUsers(usersData);

            } catch (err) {
                console.error('Fetch error:', err);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch user data",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (user: User) => {
        setEditingUser(user);
    };

    const handleUpdate = async (updatedUser: User) => {
        try {
            const response = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update user');
            }

            setUsers(prev =>
                prev.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
            setEditingUser(null);

            toast({
                title: "Success",
                description: "User updated successfully",
            });
        } catch (error) {
            console.error('Update error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to update user',
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete user",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-[#9c1b1b] text-gray-200 rounded-lg p-8 w-full max-w-md shadow-md space-y-8">
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
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="w-full max-w-4xl mx-auto mt-8">
                <Game />
            </div>
            {editingUser ? (
                <EditUserForm
                    user={editingUser}
                    onSave={handleUpdate}
                    onCancel={() => setEditingUser(null)}
                />
            ) : (
                user.role === 'admin' ? (
                    <AdminTable
                        users={users}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        setUsers={setUsers}
                    />
                ) : (
                    <UserTable users={users} />
                )
            )}
        </div>
    );
}
