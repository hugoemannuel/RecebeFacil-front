'use client';

import { useState } from 'react';
import { DemoModal } from './DemoModal';
import { DemoBlockedModal } from './DemoBlockedModal';

export function DemoButton() {
  const [modal, setModal] = useState<'demo' | 'blocked' | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setModal('demo')}
        className="w-full sm:w-auto bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 px-8 py-4 rounded-xl md:rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
      >
        <IconPlayCircle className="w-5 h-5 text-zinc-700 group-hover:scale-110 transition-transform" /> Teste agora
      </button>

      <DemoModal
        open={modal === 'demo'}
        onClose={() => setModal(null)}
        onBlocked={() => setModal('blocked')}
      />

      <DemoBlockedModal
        open={modal === 'blocked'}
        onClose={() => setModal(null)}
      />
    </>
  );
}

function IconPlayCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}
