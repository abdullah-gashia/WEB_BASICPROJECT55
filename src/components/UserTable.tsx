import { useMemo } from 'react';

type User = {
    id?: string;
    username: string;
    score: number;
};

type UserTableProps = {
    users: User[];
};

export default function UserTable({ users }: UserTableProps) {
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => b.score - a.score);
    }, [users]);

    const getRankColor = (index: number) => {
        switch(index) {
            case 0: return 'bg-yellow-500/20 text-yellow-400'; 
            case 1: return 'bg-gray-400/20 text-gray-300';    
            case 2: return 'bg-orange-500/20 text-orange-400'; 
            default: return 'bg-blue-500/20 text-blue-400';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl border border-black">
            <div className="p-4 border-b border-black">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    รายชื่อคนที่รักอาจารย์
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-black text-sm uppercase">
                            <th className="py-3 px-4 text-left">อันดับคนที่รักที่สุด</th>
                            <th className="py-3 px-4 text-left">ชื่อ</th>
                            <th className="py-3 px-4 text-right">คะแนนความรัก</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user, index) => (
                            <tr 
                                key={user.id || `user-${index}`}
                                className="border-t border-black  transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(index)}`}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-black">
                                    {user.username}
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-black">
                                    {user.score.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {sortedUsers.length === 0 && (
                            <tr>
                                <td 
                                    colSpan={3} 
                                    className="py-8 text-center text-gray-400"
                                >
                                    
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}