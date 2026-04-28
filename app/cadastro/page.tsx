"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerAction } from '@/app/actions/auth';
import { toast, Toaster } from 'react-hot-toast';
import {
  IconMessageCircle,
  IconTrendingUp,
  IconZap,
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconArrowRight
} from '@/components/ui/Icons';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Cadastro() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const { onChange: onPhoneChange, ...phoneRest } = register('phone');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 2 && v.length <= 7) {
      v = v.replace(/^(\d{2})(\d+)/, "($1) $2");
    } else if (v.length > 7) {
      v = v.replace(/^(\d{2})(\d{5})(\d{1,4}).*/, "($1) $2-$3");
    } else if (v.length > 0) {
      v = v.replace(/^(\d{1,2})/, "($1");
    }
    e.target.value = v;
    onPhoneChange(e);
  };

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true);
    const toastId = toast.loading('Criando sua conta...');

    const result = await registerAction(data);

    if (result.success) {
      toast.success('Conta criada com sucesso!', { id: toastId });
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Falha ao criar conta', { id: toastId });
      setIsLoading(false);
    }
  }
  return (
    <AuthLayout
      rightPanel={
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-md z-10 relative w-full">
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

              <div className="bg-[#152336]/60 backdrop-blur-sm border border-[#1e3046] p-6 rounded-2xl flex gap-5 items-start hover:border-green-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#1e3046] flex items-center justify-center shrink-0">
                  <IconMessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Automação via WhatsApp</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Envio automático de cobranças e lembretes direto no app favorito do seu cliente.</p>
                </div>
              </div>


              <div className="bg-[#152336]/60 backdrop-blur-sm border border-[#1e3046] p-6 rounded-2xl flex gap-5 items-start hover:border-green-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#1e3046] flex items-center justify-center shrink-0">
                  <IconTrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Recuperação de Inadimplência</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Régua de cobrança inteligente que recupera até 40% das faturas atrasadas.</p>
                </div>
              </div>


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


            <div className="mt-16 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=11" alt="User 1" className="w-10 h-10 rounded-full border-2 border-[#0b1521] object-cover" />
                <img src="https://i.pravatar.cc/100?img=5" alt="User 2" className="w-10 h-10 rounded-full border-2 border-[#0b1521] object-cover" />
                <img src="https://i.pravatar.cc/100?img=8" alt="User 3" className="w-10 h-10 rounded-full border-2 border-[#0b1521] object-cover" />
              </div>
              <p className="text-xs text-slate-500 font-medium">+ de 2.000 empresas acelerando com a RecebeFácil</p>
            </div>
          </div>
        </>
      }
    >
      <Toaster position="top-right" />


      <div className="lg:hidden flex items-center justify-between p-6">
        <Link href="/" className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <IconArrowLeft className="w-6 h-6" />
        </Link>
        <div className="font-bold text-lg tracking-tight">RecebeFácil</div>
        <div className="w-6"></div>
      </div>


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

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Nome Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconUser className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="text"
                {...register('name')}
                placeholder="Como quer ser chamado?"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name.message}</p>}
          </div>


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
                {...register('email')}
                placeholder="seu@email.com"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email.message}</p>}
          </div>


          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">WhatsApp</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconPhone className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="tel"
                {...phoneRest}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone.message}</p>}
          </div>


          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconLock className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-11 pr-12 py-3.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-medium shadow-sm hover:border-zinc-300"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl mt-8 transition-all hover:scale-[1.02] shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? 'Criando...' : (
              <>
                <span className="hidden lg:inline">COMEÇAR AGORA</span>
                <span className="lg:hidden">Criar minha conta</span>
                <IconArrowRight className="w-5 h-5 lg:hidden" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center lg:hidden pb-4">
          <p className="text-zinc-500 text-sm">
            Já tem uma conta? <Link href="/login" className="font-bold text-green-600">Entre aqui</Link>
          </p>
        </div>


        <div className="mt-auto pt-8 hidden lg:block text-center lg:text-left">
          <p className="text-[10px] text-zinc-400 font-medium tracking-wide">© 2024 RecebeFácil. Aceleração Financeira.</p>
        </div>
      </div>
    </AuthLayout>
  );
}


