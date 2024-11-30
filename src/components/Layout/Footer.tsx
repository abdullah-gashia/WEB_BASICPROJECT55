import { useAuth } from "@/app/charactors/Auth";
import { useRouter } from 'next/navigation';

export default function Footer() {
    const { user } = useAuth();
    const router = useRouter();


    return (
        <footer >
            
        </footer>
    );
}