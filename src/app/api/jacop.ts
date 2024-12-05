// import { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from '../utils/db';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         const { userId } = req.body;
        
//         try {
//             const user = await prisma.user.update({
//                 where: { id: userId },
//                 data: { JacopScore: { increment: 1 } }
//             });
//             res.status(200).json({ likeScore: user.JacopScore });
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to update score' });
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../utils/db'; // สมมติว่าคุณตั้งค่า Prisma ไว้ตรงนี้

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;

      // หา user ตาม userId และอัปเดต JacopScore
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { JacopScore: { increment: 1 } },
      });

      res.status(200).json({ JacopScore: updatedUser.JacopScore });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดต JacopScore:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`ไม่อนุญาตให้ใช้วิธีการ ${req.method}`);
  }
}

