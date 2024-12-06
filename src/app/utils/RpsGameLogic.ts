export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win';  // ลบ 'lose' และ 'draw' ออก

export const choices: Choice[] = ['rock', 'paper', 'scissors'];

export const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
};

// ปรับปรุงฟังก์ชันให้รองรับแค่ 'win' เท่านั้น
export const determineWinner = (playerChoice: Choice, computerChoice: Choice): GameResult | null => {
    if (playerChoice === computerChoice) return null;  // เปลี่ยนจาก 'draw' เป็น null แทน

    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';  // ถ้าผู้เล่นชนะ
    }

    return null;  // ถ้าไม่ชนะก็ให้ return null (หมายถึงแพ้)
};

// ฟังก์ชันคำนวณคะแนน ถ้าชนะได้ 1 แต้ม, แพ้หรือเสมอไม่ได้คะแนน
export const calculatePoints = (result: GameResult | null): number => {
    if (result === 'win' || result === 'lose') {
        return 1;
    }
    return 0;  // ไม่ได้คะแนนถ้าไม่ได้ชนะ
};
