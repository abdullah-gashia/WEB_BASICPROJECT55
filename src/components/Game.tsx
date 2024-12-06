'use client';

import { useState } from 'react';
import { Gamepad2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChoiceButton from './Choice';
import { 
    type Choice, 
    choices,
    getComputerChoice,
    determineWinner,
    calculatePoints 
} from '@/app/utils/RpsGameLogic';

type GameState = {
    playerChoice: Choice | null;
    computerChoice: Choice | null;
    result: 'win' | null;  // เปลี่ยนเป็น 'win' หรือ null
    points: number;
    totalPoints: number;  // คะแนนรวม
    isPlaying: boolean;
};

async function updateGameStats(result: 'win' | null, points: number) {
    if (!result) return;  // ถ้า result เป็น null จะไม่บันทึกข้อมูล

    const response = await fetch('/api/games/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ result, points })
    });

    if (!response.ok) {
        throw new Error('Failed to save game result');
    }
}

export default function Game() {
    const [gameState, setGameState] = useState<GameState>({
        playerChoice: null,
        computerChoice: null,
        result: null,
        points: 0,
        totalPoints: 0, // เริ่มต้นที่ 0
        isPlaying: false
    });
    const { toast } = useToast();

    const handleChoice = async (choice: Choice) => {
        setGameState(prev => ({ ...prev, isPlaying: true }));

        try {
            const computerChoice = getComputerChoice();
            const result = determineWinner(choice, computerChoice);
            const points = calculatePoints(result);

            // Save game result
            await updateGameStats(result, points);

            // คำนวณคะแนนรวม
            const updatedTotalPoints = gameState.totalPoints + points;

            // Update game state
            setGameState({
                playerChoice: choice,
                computerChoice,
                result,
                points,
                totalPoints: updatedTotalPoints,  // อัปเดตคะแนนรวม
                isPlaying: false
            });

            // Show toast notification
            toast({
                title: result === 'win' ? '🎉 Victory!' : '😔 Defeat!',
                description: `You earned ${points} points`,
                duration: 3000,
            });

        } catch (error) {
            console.error('Game error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save game result",
            });
            setGameState(prev => ({ ...prev, isPlaying: false }));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl  p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-black flex items-center justify-center gap-2">
                    
                    Total Warodome Points: <span className="text-black font-bold">{gameState.totalPoints}</span>
                </h1>
            </div>

            <div className="space-y-8">
                <div className="space-y-8">
                    <div className="flex justify-center gap-6">
                        {choices.map((choice) => (
                            <ChoiceButton
                                key={choice}
                                choice={choice}
                                onClick={() => handleChoice(choice)}
                                disabled={gameState.isPlaying}
                            />
                        ))}
                    </div>
                </div>

                
                
            </div>
        </div>
    );
}

