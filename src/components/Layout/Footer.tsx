import { useAuth } from "@/app/charactors/Auth";
import { useRouter } from 'next/navigation';

export default function Footer() {
    const { user } = useAuth();
    const router = useRouter();

    const navigationItems = [
        { path: '/', label: 'Home' },
        ...(user ? [
            { path: '/rps', label: 'Play Game' },
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/leaderboard', label: 'Leaderboard' },
        ] : []),
    ];

    return (
        <footer >
            
        </footer>
    );
}