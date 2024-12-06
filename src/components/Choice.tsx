import { useState } from 'react';
import type { Choice } from '@/app/utils/RpsGameLogic';
import Image from 'next/image';

type ChoiceButtonProps = {
    choice: Choice;
    onClick: (choice: Choice) => void;
    disabled?: boolean;
    isSelected?: boolean;
};

// กำหนด path ของรูปภาพ
const choiceConfig = {
    rock: {
        defaultIcon: "/images/w.png",       // ภาพปกติ
        clickedIcon: "/images/r-pop2.png", // ภาพเมื่อคลิก
    },
    paper: {
        icon: null,
    },
    scissors: {
        icon: null,
    }
};

export default function ChoiceButton({ 
    choice, 
    onClick, 
    disabled = false,
    isSelected = false 
}: ChoiceButtonProps) {
    // State สำหรับจัดการการสลับภาพ
    const [isClicked, setIsClicked] = useState(false);

    if (choice !== 'rock') return null;  // แสดงเฉพาะ rock

    const handleClick = () => {
        setIsClicked(true); // เปลี่ยนสถานะเป็นคลิก
        onClick(choice); // เรียกฟังก์ชัน onClick ที่ส่งเข้ามา

        // รีเซ็ตกลับเป็นภาพเริ่มต้นหลังจาก 200ms
        setTimeout(() => {
            setIsClicked(false);
        }, 200);
    };

    // ใช้ภาพที่เหมาะสมตามสถานะ
    const iconSrc = isClicked
        ? choiceConfig.rock.clickedIcon
        : choiceConfig.rock.defaultIcon;

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className="flex items-center justify-center"
        >
            <Image src={iconSrc} alt="Rock Icon" width={480} height={480} />
        </button>
    );
}

