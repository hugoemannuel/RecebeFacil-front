import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  rightPanel: React.ReactNode;
}

export function AuthLayout({ children, rightPanel }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex selection:bg-green-200">
      
      {/* LEFT SIDE - Content/Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative">
        {children}
      </div>

      {/* RIGHT SIDE - Data Showcase / Features (Desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-[#0b1521] text-white flex-col justify-center items-center relative overflow-hidden p-12 xl:p-24">
        {rightPanel}
      </div>
      
    </div>
  );
}
