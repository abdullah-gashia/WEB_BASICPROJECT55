"use client"

import { AuthProvider } from "@/app/charactors/Auth";
import "./globals.css";
import RootLayout from "@/components/Layout/Root";
import React, { useEffect, useState } from 'react';

function CursorAnimationPage() {
  const [cursorStyle, setCursorStyle] = useState<React.CSSProperties>({
      display: 'none',
      top: 0,
      left: 0,
  });

  useEffect(() => {
      let timeout: NodeJS.Timeout;

      const handleMouseMove = (e: MouseEvent) => {
          const x = e.pageX;
          const y = e.pageY;

          setCursorStyle({
              top: `${y}px`,
              left: `${x}px`,
              display: 'block',
          });

          const mouseStopped = () => {
              setCursorStyle((prev) => ({ ...prev, display: 'none' }));
          };

          clearTimeout(timeout);
          timeout = setTimeout(mouseStopped, 1000);
      };

      const handleMouseOut = () => {
          setCursorStyle((prev) => ({ ...prev, display: 'none' }));
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseout', handleMouseOut);

      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseout', handleMouseOut);
      };
  }, []);

  return (
      <>
          <div className="cursor" style={cursorStyle}></div>
      </>
  );
}

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
            <CursorAnimationPage />
                <AuthProvider>
                    <RootLayout>{children}</RootLayout>
                </AuthProvider>
            </body>
        </html>
    );
}