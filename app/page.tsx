import Link from "next/link";
import { DemoButton } from "@/components/landing/DemoButton";
import { LandingCarousel } from "@/components/landing/LandingCarousel";
import { 
  IconMessageCircle, 
  IconBuilding, 
  IconBell, 
  IconCheckCircle2, 
  IconTrendingUp, 
  IconZap, 
  IconShieldCheck, 
  IconStar 
} from "@/components/ui/Icons";

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
          <a href="#como-funciona" className="hover:text-green-500 transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-widest text-[11px] font-black">Como funciona</a>
          <a href="#beneficios" className="hover:text-green-500 transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-widest text-[11px] font-black">Benefícios</a>
          <a href="#depoimentos" className="hover:text-green-500 transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-widest text-[11px] font-black">Depoimentos</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[11px] font-black text-zinc-600 hover:text-green-500 transition-all hover:translate-x-1 cursor-pointer hidden md:block tracking-widest uppercase">ENTRAR</Link>
          <Link href="/cadastro" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-green-500/20 uppercase tracking-wider cursor-pointer">
            Começar grátis
          </Link>
        </div>
      </header>

      <main>
        <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center relative overflow-hidden" id="inicio">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-linear-to-b from-blue-50 to-green-50 rounded-[100%] blur-3xl -z-10 opacity-50"></div>

          <div className="bg-green-50 text-green-700 text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-8 flex items-center gap-2 border border-green-100">
            <IconZap className="w-3.5 h-3.5 fill-green-500" /> A plataforma #1 de cobrança inteligente
          </div>

          <h1 className="text-[2.5rem] leading-[1.05] md:text-7xl font-black tracking-tighter text-zinc-900 mb-8 max-w-4xl">
            A plataforma que realmente <br className="hidden md:block" />
            <span className="text-green-500">põe dinheiro no seu bolso</span>
          </h1>

          <p className="text-base md:text-xl text-zinc-600 max-w-2xl leading-relaxed mb-10 px-2 md:px-0 font-medium">
            Automatize lembretes, recupere inadimplentes e receba via PIX no WhatsApp. 
            <span className="text-zinc-900 font-bold"> Sem burocracia, sem climão, apenas performance.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/cadastro" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl md:rounded-full font-black text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 active:scale-95 shadow-xl shadow-green-500/20 text-center flex items-center justify-center cursor-pointer">
              Começar agora
            </Link>
            <DemoButton />
          </div>

          {/* Stats Strip embutido no layout padrão */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 w-full max-w-4xl border-y border-zinc-100 py-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-zinc-900">R$ 12M+</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Recuperados</span>
            </div>
            <div className="flex flex-col items-center border-l border-zinc-100 md:border-l-0">
              <span className="text-2xl md:text-3xl font-black text-zinc-900">2.000+</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Empresas</span>
            </div>
            <div className="flex flex-col items-center border-t border-zinc-100 pt-8 md:pt-0 md:border-t-0">
              <span className="text-2xl md:text-3xl font-black text-zinc-900">40%</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Menos Inadimplência</span>
            </div>
            <div className="flex flex-col items-center border-l border-zinc-100 pt-8 md:pt-0 md:border-l-0">
              <span className="text-2xl md:text-3xl font-black text-zinc-900">PIX</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Instantâneo</span>
            </div>
          </div>

          <div className="mt-16 w-full">
            <LandingCarousel />
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto" id="como-funciona">
          <div className="text-left md:text-center mb-16">
            <div className="text-green-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4">Fluxo Inteligente</div>
            <h2 className="text-[2.2rem] md:text-5xl font-black text-zinc-900 mb-6 tracking-tight">Sua máquina de recebimentos</h2>
            <p className="text-zinc-600 text-lg md:max-w-2xl md:mx-auto font-medium">
              Configuração rápida, cobrança amigável e dinheiro na conta em tempo recorde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-zinc-200 rounded-3xl p-8 md:p-10 shadow-sm bg-white hover:border-green-300 transition-all hover:-translate-y-2 hover:shadow-xl group cursor-default">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 border border-green-100 group-hover:scale-110 transition-transform">
                <IconBuilding className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">1. Setup Rápido</h3>
              <p className="text-base text-zinc-600 leading-relaxed font-medium">
                Conecte seu PIX ou vincule sua conta Asaas em segundos. Sem burocracia, sem espera.
              </p>
            </div>

            <div className="border border-zinc-200 rounded-3xl p-8 md:p-10 shadow-sm bg-white hover:border-yellow-300 transition-all hover:-translate-y-2 hover:shadow-xl group cursor-default">
              <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-8 border border-yellow-100 group-hover:scale-110 transition-transform">
                <IconBell className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">2. Réguas Ativas</h3>
              <p className="text-base text-zinc-600 leading-relaxed font-medium">
                Defina lembretes antes, no dia e após o vencimento. Nossa inteligência escolhe o melhor horário.
              </p>
            </div>

            <div className="border border-zinc-200 rounded-3xl p-8 md:p-10 shadow-sm bg-white hover:border-green-300 transition-all hover:-translate-y-2 hover:shadow-xl group cursor-default">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 border border-green-100 group-hover:scale-110 transition-transform">
                <IconMessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">3. WhatsApp Oficial</h3>
              <p className="text-base text-zinc-600 leading-relaxed font-medium">
                O bot aborda o cliente de forma profissional e cordial. Ele paga, o sistema baixa automaticamente.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center overflow-hidden" id="beneficios">
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-100 rounded-full blur-[100px] -z-10"></div>
            
            <div className="w-[300px] md:w-[340px] bg-white rounded-[3rem] border-12 border-zinc-900 shadow-2xl overflow-hidden relative">
              <div className="bg-[#008069] text-white p-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <IconMessageCircle className="text-white w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-base leading-none mb-1">RecebeFácil</div>
                  <div className="text-[10px] text-green-100 uppercase tracking-widest font-black">Official Business</div>
                </div>
              </div>
              <div className="bg-[#efeae2] p-5 h-[460px] flex flex-col justify-end pb-20 gap-4 relative z-0">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-800 max-w-[85%] relative border border-black/5 leading-relaxed font-medium">
                  Olá João, seu boleto de R$ 350,00 vence hoje! Segue o Pix Copia e Cola para pagamento. 🚀
                </div>
                <div className="bg-[#dcf8c6] p-4 rounded-2xl rounded-tr-none shadow-sm text-sm text-zinc-800 max-w-[85%] self-end relative border border-black/5 leading-relaxed font-medium">
                  Obrigado, acabei de pagar via Pix! ✅
                </div>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl p-4 flex items-center gap-4 shadow-2xl border border-zinc-100 animate-bounce">
                <div className="bg-green-100 p-2.5 rounded-xl">
                  <IconCheckCircle2 className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">Pagamento Recebido</p>
                  <p className="text-base font-black text-zinc-900">R$ 350,00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-12">
            <div className="flex gap-6 items-start">
              <div className="mt-1 w-14 h-14 shrink-0 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-xl shadow-green-500/30">
                <IconTrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Recuperação de até 40%</h3>
                <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                  Nossa régua de cobrança automática recupera faturas atrasadas sem que você precise perder tempo ligando para clientes.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="mt-1 w-14 h-14 shrink-0 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-xl shadow-green-500/30">
                <IconZap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Fim do trabalho manual</h3>
                <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                  O sistema envia o PIX, verifica o pagamento e dá baixa no financeiro sozinho. <span className="font-bold text-zinc-900 underline decoration-green-500 decoration-2">Liberdade total para você.</span>
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="mt-1 w-14 h-14 shrink-0 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-xl shadow-green-500/30">
                <IconShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Preservação do Cliente</h3>
                <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                  Cobre sem criar climão. Nossas mensagens são cordiais e focadas na facilidade de pagamento, mantendo seu cliente fiel.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0b1521] py-24 px-6 relative overflow-hidden" id="depoimentos">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-green-500/50 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-left md:text-center mb-16">
              <div className="text-green-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4">Depoimentos Reais</div>
              <h2 className="text-[2.2rem] md:text-5xl font-black text-white mb-6 tracking-tight">Quem usa, recebe.</h2>
              <p className="text-slate-400 text-lg md:max-w-2xl md:mx-auto font-medium">
                Junte-se a centenas de empreendedores que recuperaram o controle do caixa.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Ricardo Silva', role: 'Dono de Agência', img: 'https://i.pravatar.cc/100?img=11', text: 'Minha inadimplência caiu de 18% para menos de 3% em apenas dois meses. O sistema se paga sozinho no primeiro dia.' },
                { name: 'Mariana Costa', role: 'Clínica Odontológica', img: 'https://i.pravatar.cc/100?img=5', text: 'Acabou o estresse de cobrar os pacientes. O bot faz tudo de forma muito educada e o pagamento cai na hora.' },
                { name: 'João Pereira', role: 'Escola de Cursos', img: 'https://i.pravatar.cc/100?img=8', text: 'A facilidade do PIX no WhatsApp mudou tudo. Meus clientes adoram a praticidade e eu adoro ver o saldo subindo.' }
              ].map((item, i) => (
                <div key={i} className="bg-zinc-900/50 p-10 rounded-3xl border border-white/10 hover:border-green-500/30 transition-all hover:scale-105 cursor-default group">
                  <div className="flex gap-1 text-green-500 mb-8 group-hover:scale-110 transition-transform origin-left">
                    <IconStar className="w-5 h-5" /><IconStar className="w-5 h-5" /><IconStar className="w-5 h-5" /><IconStar className="w-5 h-5" /><IconStar className="w-5 h-5" />
                  </div>
                  <p className="text-slate-200 text-lg leading-relaxed mb-10 italic font-medium">
                    &quot;{item.text}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <img src={item.img} alt={item.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 shadow-lg group-hover:border-green-500/50 transition-colors" />
                    <div>
                      <p className="text-lg font-black text-white">{item.name}</p>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest text-[10px]">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto">
          <div className="bg-green-50 rounded-[3.5rem] p-10 md:p-20 text-center shadow-sm border border-green-100 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-3xl md:text-6xl font-black text-zinc-900 mb-8 tracking-tighter leading-none relative">
              Pronto para colocar o financeiro em <span className="text-green-500">piloto automático?</span>
            </h2>
            <p className="text-zinc-600 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium relative">
              Junte-se a 2.000+ empresas que já recuperaram R$ 12M+ com o RecebeFácil.
            </p>
            <div className="flex flex-col items-center gap-6 relative">
              <Link href="/cadastro" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-12 py-6 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-green-500/30 text-center inline-block uppercase tracking-wider">
                Começar agora grátis
              </Link>
              <p className="text-sm text-zinc-500 font-black uppercase tracking-[0.2em]">
                Sem cartão de crédito • 7 dias grátis
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="font-black text-3xl tracking-tighter text-zinc-900 mb-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <IconMessageCircle className="w-6 h-6 text-white" />
            </div>
            RecebeFácil
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[11px] text-zinc-500 mb-12 font-black uppercase tracking-[0.3em]">
            <a href="#como-funciona" className="hover:text-green-500 transition-colors">Como funciona</a>
            <a href="/login" className="hover:text-green-500 transition-colors">Login</a>
            <a href="/cadastro" className="hover:text-green-500 transition-colors">Cadastro</a>
            <a href="#" className="hover:text-green-500 transition-colors">Privacidade</a>
          </div>
          <div className="h-px w-24 bg-zinc-100 mb-12"></div>
          <p className="text-xs text-zinc-400 text-center font-bold uppercase tracking-widest">
            © 2026 RecebeFácil. Tecnologia em favor do seu caixa.
          </p>
        </div>
      </footer>
    </div>
  );
}
