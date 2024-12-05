import { useEffect, useState } from 'react';
import { useAuth } from '../charactors/Auth';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (user?.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    if (user?.role !== 'admin') {
        return <p>Access Denied</p>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} - Score: {user.JacopScore}
                        <button>Edit</button>
                        <button>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
