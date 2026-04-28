import Link from "next/link";
import { DemoButton } from "@/components/landing/DemoButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-green-200">
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full border-b border-zinc-100/50 md:border-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
            <IconMessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-xl tracking-tight text-zinc-900">RecebeFácil</div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#" className="text-green-500 font-semibold border-b-2 border-green-500 pb-1">INÍCIO</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">COMO FUNCIONA</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">BENEFÍCIOS</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">DEPOIMENTOS</a>
        </nav>


        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-zinc-600 hover:text-green-500 transition-colors hidden md:block tracking-wide">ENTRAR</Link>
          <Link href="/cadastro" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-md shadow-green-500/20">
            Começar grátis
          </Link>
        </div>
      </header>

      <main>
      <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-50 to-green-50 rounded-[100%] blur-3xl -z-10 opacity-50"></div>

        <div className="bg-blue-50 text-blue-600 text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 flex items-center gap-2 border border-blue-100">
          <span className="text-blue-500 text-sm">🏆</span> #1 PLATAFORMA DE COBRANÇAS
        </div>

        <h1 className="text-[2rem] leading-[1.15] md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 max-w-3xl">
          Receba de seus clientes <span className="text-green-500">automaticamente</span> no WhatsApp
        </h1>

        <p className="text-base md:text-lg text-zinc-600 max-w-2xl leading-relaxed mb-8 px-2 md:px-0">
          Automatize suas cobranças e recupere dívidas vencidas sem precisar abordar manualmente. Recupere até 40% da inadimplência no primeiro mês.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/cadastro" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl md:rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-green-500/20 text-center flex items-center justify-center">
            Começar grátis
          </Link>
          <DemoButton />
        </div>

        <div className="mt-12 w-full max-w-4xl rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-zinc-200/60 bg-slate-900 p-2 md:p-4">
          <div className="bg-[#0f172a] rounded-lg md:rounded-xl overflow-hidden relative">
            <div className="flex border-b border-slate-800 p-3 items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="h-4 w-32 bg-slate-800 rounded-md"></div>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 col-span-2 md:col-span-1">
                <div className="h-3 w-20 bg-slate-700 rounded mb-3"></div>
                <div className="h-6 w-24 bg-green-500/20 rounded"></div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="h-3 w-20 bg-slate-700 rounded mb-3"></div>
                <div className="h-6 w-16 bg-slate-600 rounded"></div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="h-3 w-20 bg-slate-700 rounded mb-3"></div>
                <div className="h-6 w-16 bg-slate-600 rounded"></div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hidden md:block">
                <div className="h-3 w-20 bg-slate-700 rounded mb-3"></div>
                <div className="h-6 w-16 bg-slate-600 rounded"></div>
              </div>
            </div>
            <div className="px-4 md:px-6 pb-6">
              <div className="w-full h-32 md:h-48 bg-slate-800/30 rounded-xl border border-slate-700/50 relative overflow-hidden flex items-end justify-between px-4 pb-4">
                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} className="w-[8%] md:w-8 bg-green-500/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-left md:text-center mb-10 md:mb-16">
          <h2 className="text-[2rem] md:text-4xl font-extrabold text-zinc-900 mb-3 md:mb-4">Como funciona</h2>
          <p className="text-zinc-600 text-lg md:max-w-2xl md:mx-auto">
            Sua máquina de recebimentos configurada em 3 minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">

          <div className="border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white hover:border-green-200 transition-colors">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <IconBuilding className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">1. Cadastre sua conta</h3>
            <p className="text-base text-zinc-600 leading-relaxed">
              Vincule sua conta bancária de forma segura e configure seu Pix para recebimentos automáticos.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white hover:border-yellow-200 transition-colors">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
              <IconBell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">2. Configure os lembretes</h3>
            <p className="text-base text-zinc-600 leading-relaxed">
              Defina quando o cliente deve ser avisado: 3 dias antes, no dia do vencimento e após o atraso.
            </p>
          </div>
          <div className="border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white hover:border-green-200 transition-colors">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <IconMessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">3. Receba via WhatsApp</h3>
            <p className="text-base text-zinc-600 leading-relaxed">
              Nosso bot enviará mensagens personalizadas. O cliente paga e você recebe o dinheiro na hora.
            </p>
          </div>
        </div>
      </section>


      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center overflow-hidden">


        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-100 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[400px] bg-green-50 rounded-full -z-10"></div>

          <div className="w-[300px] md:w-[320px] bg-white rounded-[2.5rem] border-[8px] md:border-[10px] border-slate-900 shadow-2xl overflow-hidden relative">
            <div className="bg-[#008069] text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <IconMessageCircle className="text-white w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-base">RecebeFácil</div>
                <div className="text-xs text-green-100">conta comercial</div>
              </div>
            </div>
            <div className="bg-[#efeae2] p-4 h-[420px] flex flex-col justify-end pb-16 gap-3 relative z-0">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-800 max-w-[85%] relative border border-black/5">
                Olá João, seu boleto de R$ 350,00 vence hoje! Segue o Pix Copia e Cola para pagamento.
              </div>
              <div className="bg-[#dcf8c6] p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-zinc-800 max-w-[85%] self-end relative border border-black/5">
                Obrigado, acabei de pagar via Pix!
              </div>
            </div>


            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-xl p-3 flex items-center gap-3 shadow-xl border border-zinc-100 animate-bounce">
              <div className="bg-green-100 p-2 rounded-lg">
                <IconCheckCircle2 className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide mb-0.5">Pagamento Recebido</p>
                <p className="text-sm font-bold text-zinc-900">R$ 350,00 - João Silva</p>
              </div>
            </div>
          </div>
        </div>


        <div className="w-full lg:w-1/2 space-y-10">
          <div className="flex gap-5 items-start">
            <div className="mt-1 w-12 h-12 shrink-0 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <IconTrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Mais dinheiro na mão</h3>
              <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
                Reduza a inadimplência em até 40% enviando lembretes amigáveis via WhatsApp que facilitam o pagamento do cliente.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start">
            <div className="mt-1 w-12 h-12 shrink-0 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <IconZap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Automação total</h3>
              <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
                Livre-se de planilhas e da tarefa chata de cobrar. Deixe que nosso sistema trabalhe por você 24 horas por dia.
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start">
            <div className="mt-1 w-12 h-12 shrink-0 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <IconShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Sem climão chato</h3>
              <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
                Mantenha o bom relacionamento com o seu cliente. Nossas mensagens são cordiais e profissionais, focadas em ajudar.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-[#0b1521] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left md:text-center mb-12">
            <h2 className="text-[2rem] md:text-4xl font-extrabold text-white mb-4">Quem usa, recebe.</h2>
            <p className="text-slate-400 text-lg md:max-w-2xl md:mx-auto">
              Centenas de empreendedores já usam para faturar muito mais.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#152336] p-8 rounded-2xl border border-[#1e3046]">
              <div className="flex gap-1 text-yellow-400 mb-6">
                <IconStar /><IconStar /><IconStar /><IconStar /><IconStar />
              </div>
              <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-8 italic">
                "Nossa inadimplência baixou de 15% para 2% no primeiro mês! O sistema trabalha sozinho e os clientes adoram a facilidade do Pix pelo WhatsApp."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=11" alt="Ricardo Silva" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Ricardo Silva</p>
                  <p className="text-sm text-slate-400">Agência de Marketing</p>
                </div>
              </div>
            </div>

            <div className="bg-[#152336] p-8 rounded-2xl border border-[#1e3046]">
              <div className="flex gap-1 text-yellow-400 mb-6">
                <IconStar /><IconStar /><IconStar /><IconStar /><IconStar />
              </div>
              <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-8 italic">
                "A cobrança era a pior parte do meu negócio. Agora, não preciso mais me preocupar com isso. O dinheiro simplesmente entra na conta."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=5" alt="Mariana Costa" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Mariana Costa</p>
                  <p className="text-sm text-slate-400">Clínica Odontológica</p>
                </div>
              </div>
            </div>

            <div className="bg-[#152336] p-8 rounded-2xl border border-[#1e3046]">
              <div className="flex gap-1 text-yellow-400 mb-6">
                <IconStar /><IconStar /><IconStar /><IconStar /><IconStar />
              </div>
              <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-8 italic">
                "Facilidade incrível. O suporte é rápido e a interface é muito intuitiva. Recomendo para todos os meus parceiros."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=8" alt="João Pereira" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">João Pereira</p>
                  <p className="text-sm text-slate-400">Escola de Idiomas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 md:py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-[#eafbf3] rounded-[2.5rem] p-8 md:p-16 text-center shadow-sm">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 mb-6 tracking-tight">
            Pronto para acelerar seus recebimentos?
          </h2>
          <p className="text-zinc-600 text-lg mb-10 max-w-xl mx-auto">
            Junte-se a milhares de empreendedores que já automatizaram suas cobranças. Teste grátis por 7 dias.
          </p>
          <Link href="/cadastro" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl md:rounded-full font-bold text-lg transition-transform hover:scale-105 mb-5 shadow-xl shadow-green-500/20 text-center inline-flex items-center justify-center">
            Começar grátis
          </Link>
          <p className="text-sm text-zinc-500">
            Não precisa de cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>
      </main>

      <footer className="border-t border-zinc-100 py-12 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="font-bold text-2xl tracking-tight text-zinc-900 mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
              <IconMessageCircle className="w-5 h-5 text-white" />
            </div>
            RecebeFácil
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-zinc-500 mb-10 font-medium">
            <a href="#" className="hover:text-zinc-900 transition-colors">Como funciona</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Preços</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Segurança</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Suporte</a>
          </div>
          <p className="text-sm text-zinc-400 text-center">
            © 2026 RecebeFácil. Plataforma de Cobranças Automáticas.
          </p>
        </div>
      </footer>
    </div>
  );
}


function IconBuilding({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>;
}
function IconBell({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;
}
function IconMessageCircle({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>;
}
function IconTrendingUp({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
}
function IconZap({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function IconStar({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function IconShieldCheck({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>;
}
function IconCheckCircle2({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>;
}
