'use client';

import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ChoiceButton from './RdJacop';
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
    result: 'win' | null;  
    points: number;
    totalPoints: number;  
    isPlaying: boolean;
};

async function updateGameStats(result: 'win' | null, points: number) {
    if (!result) return;  

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
        totalPoints: 0, 
        isPlaying: false
    });
    const { toast } = useToast();

    const handleChoice = async (choice: Choice) => {
        setGameState(prev => ({ ...prev, isPlaying: true }));

        try {
            const computerChoice = getComputerChoice();
            const result = determineWinner(choice, computerChoice);
            const points = calculatePoints(result);

            
            await updateGameStats(result, points);

            
            const updatedTotalPoints = gameState.totalPoints + points;

            setGameState({
                playerChoice: choice,
                computerChoice,
                result,
                points,
                totalPoints: updatedTotalPoints,  
                isPlaying: false
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

