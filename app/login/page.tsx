"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginAction } from '@/app/actions/auth';
import { toast, Toaster } from 'react-hot-toast';
import {
  IconMessageCircle,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconTrendingUp,
  IconCheck
} from '@/components/ui/Icons';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setIsLoading(true);
    const toastId = toast.loading('Autenticando...');

    const result = await loginAction(data);

    if (result.success) {
      toast.success('Bem-vindo de volta!', { id: toastId });
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Falha ao fazer login', { id: toastId });
      setIsLoading(false);
    }
  }
  return (
    <AuthLayout
      rightPanel={
        <>
          {/* Deep subtle background gradient */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] -z-10"></div>

          {/* Top Centered Logo in Dark Side */}
          <div className="absolute top-12 flex items-center justify-center gap-3 w-full opacity-90">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <IconMessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">RecebeFácil</span>
          </div>

          <div className="w-full max-w-lg flex flex-col items-center z-10 mt-8 scale-95 origin-center">
            <h2 className="text-4xl xl:text-5xl font-semibold tracking-tight mb-8 text-center leading-[1.1]">
              Acelere seus <br />
              <span className="text-green-400 italic font-medium">recebíveis</span> hoje.
            </h2>

            {/* Stats Row */}
            <div className="flex gap-4 mb-4 w-full justify-center">
              <div className="bg-[#152336]/80 backdrop-blur-md border border-[#1e3046] rounded-2xl p-4 flex flex-col items-center justify-center w-36 hover:border-green-500/20 transition-colors">
                <span className="text-2xl font-bold text-green-400 mb-1">+10k</span>
                <span className="text-xs text-slate-400">Cobranças Ativas</span>
              </div>
              <div className="bg-[#152336]/80 backdrop-blur-md border border-[#1e3046] rounded-2xl p-4 flex flex-col items-center justify-center w-36 hover:border-green-500/20 transition-colors">
                <span className="text-2xl font-bold text-green-400 mb-1">98%</span>
                <span className="text-xs text-slate-400">Conversão de Pix</span>
              </div>
            </div>
            <div className="flex gap-4 mb-8 w-full justify-center">
              <div className="bg-[#152336]/80 backdrop-blur-md border border-[#1e3046] rounded-2xl p-4 flex flex-col items-center justify-center w-36 hover:border-green-500/20 transition-colors">
                <span className="text-2xl font-bold text-green-400 mb-1">0.1s</span>
                <span className="text-xs text-slate-400 text-center">Tempo de<br />Resposta</span>
              </div>
            </div>

            {/* Mockup Dashboard Card */}
            <div className="bg-gradient-to-b from-[#111e2f] to-[#0a121c] border border-[#1e3046] rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
              {/* Soft highlight */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Saldo Disponível</p>
                  <p className="text-3xl font-bold text-white tracking-tight">R$ 42.850,00</p>
                </div>
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                  <IconTrendingUp className="w-5 h-5 text-green-400" />
                </div>
              </div>

              <div className="space-y-3">
                {/* Activity Row 1 */}
                <div className="bg-[#152336] rounded-2xl p-3 flex items-center justify-between border border-[#1e3046]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <IconCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">Venda Realizada</p>
                      <p className="text-[10px] text-slate-500">João Silva • Pix</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-400">+R$ 297,00</span>
                </div>

                {/* Activity Row 2 */}
                <div className="bg-[#152336] rounded-2xl p-3 flex items-center justify-between border border-[#1e3046]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                      <IconCheck className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">Mensagem Enviada</p>
                      <p className="text-[10px] text-slate-500">Automação WhatsApp</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-green-500 uppercase">SUCESSO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof */}
          <div className="absolute bottom-8 flex items-center gap-4 text-slate-400 text-sm">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-8 h-8 rounded-full border-2 border-[#0b1521] object-cover opacity-80" />
              <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-8 h-8 rounded-full border-2 border-[#0b1521] object-cover opacity-80" />
              <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-8 h-8 rounded-full border-2 border-[#0b1521] object-cover opacity-80" />
            </div>
            <p>Junte-se a <span className="font-bold text-white">1.200+ empresas</span> que automatizam suas cobranças</p>
          </div>
        </>
      }
    >
      <Toaster position="top-right" />

      {/* Mobile Header (Centered) */}
      <div className="lg:hidden flex flex-col items-center justify-center pt-12 pb-6">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm mb-4">
          <IconMessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="font-bold text-xl tracking-tight">RecebeFácil</div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center p-8 xl:p-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-green-600 transition-colors">
            <IconMessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-xl tracking-tight">RecebeFácil</div>
        </Link>
      </header>

      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-24 py-4 lg:py-8 max-w-[600px] w-full mx-auto">

        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3 lg:mb-4 text-center lg:text-left">
          Acesse sua conta
        </h1>
        <p className="text-zinc-500 text-base mb-10 text-center lg:text-left leading-relaxed">
          <span className="hidden lg:inline">Gerencie suas cobranças com a fintech de performance que mais cresce.</span>
          <span className="lg:hidden">Gerencie suas cobranças automáticas no WhatsApp</span>
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* E-mail */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconMail className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="nome@empresa.com"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email.message}</p>}
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Senha</label>
              <a href="#" className="text-xs font-bold text-green-500 hover:text-green-600 hover:underline">
                Esqueceu sua senha?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconLock className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password.message}</p>}
          </div>

          {/* Checkbox (Visible mainly on desktop or both depending on need, keeping for both for UX) */}
          <div className="hidden lg:flex items-center gap-3 pt-2">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                className="w-5 h-5 border border-zinc-300 rounded bg-white checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-0 text-green-500 transition-colors cursor-pointer appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==')] checked:bg-[length:70%_70%] checked:bg-center checked:bg-no-repeat"
              />
            </div>
            <label htmlFor="remember" className="text-sm text-zinc-500 font-medium cursor-pointer">
              Manter conectado por 30 dias
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl mt-6 transition-all hover:scale-[1.02] shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? 'Entrando...' : (
              <>
                <span className="hidden lg:inline">Entrar na plataforma</span>
                <span className="lg:hidden">Entrar</span>
                <IconArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Social Login Divider (Mobile mostly) */}
        <div className="lg:hidden mt-8 relative flex items-center justify-center">
          <div className="border-t border-zinc-200 w-full absolute"></div>
          <span className="bg-white px-4 text-xs font-bold text-zinc-400 tracking-widest relative z-10">OU ENTRE COM</span>
        </div>

        {/* Google Login Button */}
        <button type="button" className="lg:hidden mt-8 w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.1v2.84A11.002 11.002 0 0012 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.1A10.99 10.99 0 001 12c0 1.77.42 3.45 1.1 4.93l3.74-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.1 7.07l3.74 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <div className="mt-10 lg:mt-8 text-center pb-4">
          <p className="text-zinc-500 text-sm">
            Não tem uma conta? <Link href="/cadastro" className="font-bold text-zinc-900 hover:underline">Comece grátis <span className="hidden lg:inline">agora</span></Link>
          </p>
        </div>

        {/* Desktop Footer text */}
        <div className="mt-auto pt-8 hidden lg:block text-center lg:text-left">
          <p className="text-[10px] text-zinc-400 font-medium tracking-wide">© 2024 RecebeFácil Pagamentos LTDA. CNPJ: 00.000.000/0001-00</p>
        </div>
      </div>
    </AuthLayout>
  );
}


