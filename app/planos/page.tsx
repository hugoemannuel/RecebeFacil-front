"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  IconCheck, 
  IconArrowLeft, 
  IconZap, 
  IconMessageCircle, 
  IconShieldCheck, 
  IconTrendingUp,
  IconSparkles
} from '@/components/ui/Icons';
import { createCheckoutAction, getSubscriptionStatusAction } from '@/app/actions/subscription';

// ─── Tipos ──────────────────────────────────────────────────────
interface PlanFeature {
  text: string;
  included: boolean;
  premium?: boolean;
}

interface Plan {
  id: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  highlight?: boolean;
  buttonText: string;
}

// ─── Configuração dos Planos ───────────────────────────────────
const PLANS: Plan[] = [
  {
    id: 'FREE',
    name: 'Free',
    description: 'Para quem está começando a organizar as cobranças.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: 'Até 10 cobranças/mês', included: true },
      { text: 'Envio manual via WhatsApp', included: true },
      { text: 'Dashboard básico', included: true },
      { text: 'Gestão de Clientes', included: false },
      { text: 'Relatórios detalhados', included: false },
      { text: 'Automação completa', included: false },
    ],
    buttonText: 'Plano Atual',
  },
  {
    id: 'STARTER',
    name: 'Starter',
    description: 'Ideal para profissionais autônomos em crescimento.',
    monthlyPrice: 29,
    yearlyPrice: 278,
    highlight: true,
    features: [
      { text: 'Até 50 cobranças/mês', included: true },
      { text: 'Gestão ilimitada de Clientes', included: true },
      { text: 'Importação via Excel', included: true },
      { text: 'Relatórios de performance', included: true },
      { text: 'Automação de WhatsApp', included: true, premium: true },
      { text: 'Suporte prioritário', included: false },
    ],
    buttonText: 'Escolher Starter',
  },
  {
    id: 'PRO',
    name: 'Pro',
    description: 'Poder total para clínicas e negócios escaláveis.',
    monthlyPrice: 69,
    yearlyPrice: 662,
    features: [
      { text: 'Cobranças ilimitadas', included: true },
      { text: 'Tudo do plano Starter', included: true },
      { text: 'Automação completa (Régua)', included: true, premium: true },
      { text: 'Cobrança em Massa', included: true },
      { text: 'Múltiplos usuários (em breve)', included: true },
      { text: 'Suporte VIP 24h', included: true },
    ],
    buttonText: 'Escolher Pro',
  },
];

// ─── Componente Principal ──────────────────────────────────────
export default function PlanosPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('FREE');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      const status = await getSubscriptionStatusAction();
      if (status) {
        setCurrentPlan(status.plan);
      }
    }
    loadStatus();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (planId === currentPlan) return;
    if (planId === 'FREE') return;

    setLoading(planId);
    setError(null);

    const result = await createCheckoutAction(planId, period);

    if (result.success && result.url) {
      window.location.href = result.url;
    } else {
      setError(result.error || 'Ocorreu um erro ao processar seu pedido.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 font-sans pb-20">
      
      {/* ── Header ────────────────────────────────────────── */}
      <header className="bg-white border-b border-zinc-200/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
              <IconArrowLeft className="w-4 h-4 text-zinc-600" />
            </div>
            <span className="font-bold text-sm text-zinc-600">Voltar ao Painel</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md shadow-green-500/20">
              <IconMessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="font-extrabold text-xl tracking-tight">
              Recebe<span className="text-green-500">Fácil</span>
            </div>
          </div>

          <div className="w-24 hidden md:block"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 md:pt-24">
        
        {/* ── Título e Toggle ───────────────────────────────── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <IconSparkles className="w-3.5 h-3.5" />
            Investimento no seu tempo
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-6">
            Escolha o plano ideal para <br className="hidden md:block" /> escalar seu negócio
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-12">
            Desbloqueie automações, relatórios e ferramentas de produtividade para parar de cobrar e começar a receber.
          </p>

          {/* Toggle Mensal/Anual */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors ${period === 'MONTHLY' ? 'text-zinc-900' : 'text-zinc-400'}`}>Mensal</span>
            <button 
              onClick={() => setPeriod(period === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
              className="w-14 h-7 bg-zinc-200 rounded-full relative p-1 transition-colors hover:bg-zinc-300"
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${period === 'YEARLY' ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold transition-colors ${period === 'YEARLY' ? 'text-zinc-900' : 'text-zinc-400'}`}>Anual</span>
              <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Economize 20%</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {/* ── Cards de Planos ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const price = period === 'MONTHLY' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12);
            
            return (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-[2.5rem] p-8 md:p-10 border transition-all duration-300 flex flex-col ${
                  plan.highlight 
                    ? 'border-green-500 ring-4 ring-green-500/10 shadow-2xl shadow-green-500/10 scale-[1.02] z-10' 
                    : 'border-zinc-100 hover:border-zinc-200 shadow-xl shadow-zinc-200/50'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Mais Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-2">{plan.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-zinc-400">R$</span>
                    <span className="text-5xl font-extrabold text-zinc-900 tracking-tighter">{price}</span>
                    <span className="text-zinc-400 font-bold text-sm">/mês</span>
                  </div>
                  {period === 'YEARLY' && plan.id !== 'FREE' && (
                    <p className="text-green-600 text-[11px] font-bold mt-1">Cobrado anualmente (R$ {plan.yearlyPrice})</p>
                  )}
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className={`flex items-start gap-3 text-sm ${feature.included ? 'text-zinc-700' : 'text-zinc-300'}`}>
                      <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included 
                          ? feature.premium ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600' 
                          : 'bg-zinc-50 text-zinc-200'
                      }`}>
                        <IconCheck className="w-3 h-3" />
                      </div>
                      <span className={feature.premium ? 'font-bold' : ''}>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || !!loading}
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-zinc-100 text-zinc-400 cursor-default'
                      : plan.highlight
                        ? 'bg-[#0b1521] text-white hover:bg-[#152336] hover:scale-[1.02] shadow-lg shadow-zinc-900/20'
                        : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 hover:scale-[1.02]'
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {plan.id !== 'FREE' && !isCurrent && <IconZap className={`w-4 h-4 ${plan.highlight ? 'text-green-400' : 'text-zinc-400'}`} />}
                      {isCurrent ? 'Plano Atual' : plan.buttonText}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Rodapé de Garantia ───────────────────────────── */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-t border-zinc-200 pt-16">
          <div className="flex items-center gap-4 text-left max-w-xs">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center shrink-0">
              <IconShieldCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 text-sm">Pagamento Seguro</p>
              <p className="text-zinc-500 text-xs leading-relaxed">Seus dados são protegidos por criptografia de ponta a ponta.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left max-w-xs">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center shrink-0">
              <IconTrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 text-sm">Garantia de Conversão</p>
              <p className="text-zinc-500 text-xs leading-relaxed">Nossas réguas de cobrança aumentam em até 40% seus recebimentos.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
