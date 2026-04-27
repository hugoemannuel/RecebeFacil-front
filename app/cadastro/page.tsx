"use client";

import Link from 'next/link';

export default function Cadastro() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex selection:bg-green-200">
      
      {/* LEFT SIDE - Form (Visible on all screens, full width on mobile) */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6">
          <Link href="/" className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <IconArrowLeft className="w-6 h-6" />
          </Link>
          <div className="font-bold text-lg tracking-tight">RecebeFácil</div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-8 xl:p-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-green-600 transition-colors">
              <IconMessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-xl tracking-tight">RecebeFácil</div>
          </Link>
          <Link href="/login" className="text-sm font-bold text-zinc-600 hover:text-green-600 transition-colors">
            Entrar
          </Link>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-24 py-8 max-w-[600px] w-full mx-auto">
          
          <div className="lg:hidden flex justify-center mb-6">
             <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                <IconZap className="w-8 h-8 text-green-500 fill-green-500/20" />
             </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3 lg:mb-4 text-center lg:text-left">
            Crie sua conta <span className="lg:hidden">grátis</span>
          </h1>
          <p className="text-zinc-500 text-base mb-10 text-center lg:text-left leading-relaxed">
            <span className="hidden lg:inline">Configure seu checkout e comece a receber pagamentos hoje mesmo.</span>
            <span className="lg:hidden">Comece a receber pagamentos em segundos com a tecnologia RecebeFácil.</span>
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconUser className="w-5 h-5 text-zinc-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Como quer ser chamado?"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
                />
              </div>
            </div>

            {/* E-mail Corporativo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                <span className="hidden lg:inline">E-mail Corporativo</span>
                <span className="lg:hidden">E-mail</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconMail className="w-5 h-5 text-zinc-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconPhone className="w-5 h-5 text-zinc-400" />
                </div>
                <input 
                  type="tel" 
                  placeholder="+55 (00) 00000-0000"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconLock className="w-5 h-5 text-zinc-400" />
                </div>
                <input 
                  type="password" 
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors">
                   <IconEye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 pt-3">
              <div className="flex items-center h-5 mt-0.5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  className="w-5 h-5 border border-zinc-300 rounded bg-white checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-0 text-green-500 transition-colors cursor-pointer appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==')] checked:bg-[length:70%_70%] checked:bg-center checked:bg-no-repeat"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-zinc-500 leading-relaxed cursor-pointer">
                Ao criar uma conta, você concorda com nossos <Link href="#" className="font-bold text-green-600 hover:text-green-700 hover:underline">Termos de Uso</Link> e <Link href="#" className="font-bold text-green-600 hover:text-green-700 hover:underline">Política de Privacidade</Link>.
              </label>
            </div>

            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl mt-8 transition-all hover:scale-[1.02] shadow-xl shadow-green-500/20 flex items-center justify-center gap-2">
              <span className="hidden lg:inline">COMEÇAR AGORA</span>
              <span className="lg:hidden">Criar minha conta</span>
              <IconArrowRight className="w-5 h-5 lg:hidden" />
            </button>
          </form>

          <div className="mt-8 text-center lg:hidden pb-4">
            <p className="text-zinc-500 text-sm">
              Já tem uma conta? <Link href="/login" className="font-bold text-green-600">Entre aqui</Link>
            </p>
          </div>

          {/* Desktop Footer text */}
          <div className="mt-auto pt-8 hidden lg:block text-center lg:text-left">
            <p className="text-[10px] text-zinc-400 font-medium tracking-wide">© 2024 RecebeFácil. Aceleração Financeira.</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Features (Desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-[#0b1521] text-white p-12 xl:p-24 flex-col justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-md z-10 relative">
          <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
            Fintech de Performance
          </div>
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Comece a receber agora.
          </h2>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed">
            Sua operação financeira em piloto automático, do checkout à conciliação.
          </p>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="bg-[#152336]/60 backdrop-blur-sm border border-[#1e3046] p-6 rounded-2xl flex gap-5 items-start hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1e3046] flex items-center justify-center shrink-0">
                <IconMessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Automação via WhatsApp</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Envio automático de cobranças e lembretes direto no app favorito do seu cliente.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#152336]/60 backdrop-blur-sm border border-[#1e3046] p-6 rounded-2xl flex gap-5 items-start hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1e3046] flex items-center justify-center shrink-0">
                <IconTrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Recuperação de Inadimplência</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Régua de cobrança inteligente que recupera até 40% das faturas atrasadas.</p>
              </div>
            </div>

            {/* Feature 3 (Active style) */}
            <div className="bg-[#152336] border border-green-500/40 p-6 rounded-2xl flex gap-5 items-start shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                <IconZap className="w-6 h-6 text-white fill-white/20" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Configuração em 5 minutos</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Sem burocracia bancária. Integre, configure e venda no mesmo dia.</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=11" alt="User 1" className="w-10 h-10 rounded-full border-2 border-[#0b1521] object-cover" />
              <img src="https://i.pravatar.cc/100?img=5" alt="User 2" className="w-10 h-10 rounded-full border-2 border-[#0b1521] object-cover" />
              <img src="https://i.pravatar.cc/100?img=8" alt="User 3" className="w-10 h-10 rounded-full border-2 border-[#0b1521] object-cover" />
            </div>
            <p className="text-xs text-slate-500 font-medium">+ de 2.000 empresas acelerando com a RecebeFácil</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function IconMessageCircle({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>;
}
function IconTrendingUp({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
}
function IconZap({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function IconUser({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function IconMail({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}
function IconPhone({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function IconLock({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
function IconEye({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IconArrowLeft({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
}
function IconArrowRight({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
}
function IconLogIn({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>;
}
function IconUserPlus({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>;
}
