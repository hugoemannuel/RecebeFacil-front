'use client';

import { IconQrCode } from '@/components/ui/Icons';

interface WhatsAppPreviewProps {
  senderName: string;
  message: string;
  showQrCode: boolean;
  showPixButton: boolean;
  pixKey?: string;
  amount?: string;
}

export function WhatsAppPreview({
  senderName,
  message,
  showQrCode,
  showPixButton,
  pixKey,
  amount,
}: WhatsAppPreviewProps) {
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Renderiza markdown simples do WhatsApp: *negrito*, _itálico_
  function renderWhatsAppText(text: string) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // *negrito*
      const parts = line.split(/(\*[^*]+\*)/g).map((part, j) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          return <strong key={j}>{part.slice(1, -1)}</strong>;
        }
        // _itálico_
        const italicParts = part.split(/(_[^_]+_)/g).map((ip, k) => {
          if (ip.startsWith('_') && ip.endsWith('_')) {
            return <em key={k}>{ip.slice(1, -1)}</em>;
          }
          return ip;
        });
        return <span key={j}>{italicParts}</span>;
      });
      return (
        <span key={i}>
          {parts}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* WhatsApp header */}
      <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3 rounded-t-2xl">
        <div className="w-9 h-9 rounded-full bg-green-300 flex items-center justify-center text-[#075e54] font-bold text-sm shrink-0">
          {senderName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{senderName}</p>
          <p className="text-green-200 text-[11px]">online</p>
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2 rounded-b-2xl"
        style={{ background: '#e5ddd5', backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8c8c8' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      >
        {/* Mensagem de texto */}
        {message && (
          <div className="flex justify-end">
            <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] shadow-sm">
              <p className="text-[13px] text-zinc-800 leading-relaxed whitespace-pre-wrap break-words">
                {renderWhatsAppText(message)}
              </p>
              <p className="text-[10px] text-zinc-400 text-right mt-1 flex items-center justify-end gap-1">
                {time}
                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 12.5L5.5 17 11 11.5M7 12.5L11.5 17 23 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </p>
            </div>
          </div>
        )}

        {/* QR Code */}
        {showQrCode && (
          <div className="flex justify-end">
            <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm overflow-hidden max-w-[85%] shadow-sm">
              <div className="bg-white m-3 rounded-xl p-4 flex flex-col items-center gap-2">
                <IconQrCode className="w-16 h-16 text-zinc-700" />
                <p className="text-[11px] text-zinc-500 font-medium">QR Code PIX</p>
              </div>
              <p className="text-[12px] text-zinc-600 px-4 pb-3 leading-relaxed">
                📱 Escaneie para pagar via PIX
              </p>
              <p className="text-[10px] text-zinc-400 text-right px-4 pb-2">{time}</p>
            </div>
          </div>
        )}

        {/* Botão PIX nativo */}
        {showPixButton && (
          <div className="flex justify-end">
            <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm overflow-hidden max-w-[85%] shadow-sm">
              <div className="px-4 pt-3 pb-2">
                <p className="text-[13px] text-zinc-700 font-medium">Chave PIX</p>
                <p className="text-[12px] text-zinc-500 truncate">{pixKey || '(sua chave PIX)'}</p>
                {amount && (
                  <p className="text-[13px] font-bold text-zinc-800 mt-1">{amount}</p>
                )}
              </div>
              <div className="border-t border-green-200 mx-2 mb-2">
                <button className="w-full text-[#128C7E] font-semibold text-[13px] py-2 flex items-center justify-center gap-2 hover:bg-green-50 rounded-b-xl transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copiar chave PIX
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 text-right px-4 pb-2">{time}</p>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!message && !showQrCode && !showPixButton && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-8">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
            </svg>
            <p className="text-xs text-center leading-relaxed opacity-60">
              Edite a mensagem ao lado<br />para ver o preview aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
