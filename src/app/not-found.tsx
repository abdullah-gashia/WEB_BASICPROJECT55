"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

type Props = {};

export default function PageNotFound({}: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className='flex justify-center items-center flex-col h-screen'>
      <img
        src='https://wallpapers-clan.com/wp-content/uploads/2022/09/madara-pfp-20.jpg'
        alt='Error Bro'
        width={200}
        className='border border-black m-4'
      />
      <h1 className='text-red-600 text-xl m-4'>
        ว้าว เก่งมากเลยนะ ที่จะทำแบบนี้55555
      </h1>
      <h1 className='text-red-600 text-xl m-4'>
        Please doesn't skibidi toilet with me
      </h1>

      <button
        onClick={handleClick}
        className='mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-700 transition-all'
      >
        Home Page
      </button>
    </div>
  );
}
