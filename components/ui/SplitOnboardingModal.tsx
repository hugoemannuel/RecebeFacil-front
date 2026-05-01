"use client";

import React, { useState, useEffect } from 'react';
import { 
  IconShieldCheck, 
  IconBuilding, 
  IconBank, 
  IconCheckCircle2, 
  IconArrowRight,
  IconX,
  IconClock,
  IconZap
} from './Icons';
import { getSplitTermsAction } from '@/app/actions/integrations';
import ReactMarkdown from 'react-markdown';

interface SplitOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  planName: string;
}

export function SplitOnboardingModal({ isOpen, onClose, onConfirm, planName }: SplitOnboardingModalProps) {
  const [step, setStep] = useState<'CONTRACT' | 'BANK_DATA' | 'CHECKOUT_DATA'>('CONTRACT');
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [termsData, setTermsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    document: '',
    bank: '',
    agency: '',
    account: '',
    accountType: 'CHECKING'
  });

  // Funções de Máscara
  const maskDocument = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (raw.length <= 11) {
      return raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
    }
    return raw.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  const maskAgency = (val: string) => val.replace(/\D/g, "").substring(0, 4);
  const maskAccount = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (raw.length > 1) {
      return raw.replace(/(\d+)(\d{1})$/, "$1-$2");
    }
    return raw;
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, document: maskDocument(e.target.value) });
  };

  useEffect(() => {
    if (isOpen) {
      async function loadTerms() {
        setLoadingTerms(true);
        setError(null);
        try {
          const data = await getSplitTermsAction();
          if (data) {
            setTermsData(data);
          } else {
            setError("Não foi possível carregar os termos. Tente novamente.");
          }
        } catch (err) {
          setError("Erro de conexão ao carregar termos.");
        } finally {
          setLoadingTerms(false);
        }
      }
      loadTerms();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Envia os dados limpos (sem máscara) para o back-end
    const cleanData = {
      ...formData,
      document: formData.document.replace(/\D/g, ""),
      agency: formData.agency.replace(/\D/g, ""),
      account: formData.account.replace(/\D/g, ""),
      version: termsData?.version || '1.0.0'
    };
    onConfirm(cleanData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-zinc-100 flex flex-col md:flex-row min-h-[600px]">
        
        {/* Header Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all z-20"
        >
          <IconX className="w-5 h-5" />
        </button>

        {/* Lado Esquerdo - Info & Taxas */}
        <div className="w-full md:w-[40%] bg-zinc-950 p-8 md:p-12 text-white flex flex-col relative overflow-hidden">
          {/* Decorative Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
          
          <div className="w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-green-500/40 relative group-hover:scale-110 transition-transform duration-500">
            <IconShieldCheck className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-8 leading-[1.1] relative tracking-tighter">
            Transparência <br/> <span className="text-green-500">total</span> com você.
          </h2>
          
          <div className="space-y-8 relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 shadow-2xl">
              <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-6">Taxas de Intermediação</p>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-zinc-400">Plataforma</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-white">
                      {termsData?.fees?.[planName.toUpperCase()] || (planName.toUpperCase() === 'PRO' ? '2' : '1')}%
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">por recebimento</span>
                  </div>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Taxas do Gateway (Asaas)</span>
                  <div className="flex justify-between items-center group/fee">
                    <span className="text-xs text-zinc-400 group-hover/fee:text-zinc-200 transition-colors">PIX Liquidado</span>
                    <span className="text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-full">{termsData?.asaasFees?.pix || 'R$ 0,99'}</span>
                  </div>
                  <div className="flex justify-between items-center group/fee">
                    <span className="text-xs text-zinc-400 group-hover/fee:text-zinc-200 transition-colors">Boleto Liquidado</span>
                    <span className="text-sm font-bold text-white bg-white/5 px-3 py-1 rounded-full">{termsData?.asaasFees?.boleto || 'R$ 1,99'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <IconZap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-bold text-sm">Conciliação em Tempo Real</p>
                <p className="text-xs text-zinc-500 leading-relaxed">O sistema identifica o pagamento e o dinheiro cai na sua conta Asaas já descontado das taxas.</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <IconBuilding className="w-3 h-3" /> Powered by Asaas Connect
            </div>
          </div>
        </div>

        {/* Lado Direito - Conteúdo Dinâmico */}
        <div className="w-full md:w-[60%] p-8 md:p-12 flex flex-col bg-white">
          
          {loadingTerms ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Carregando Termos...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <IconX className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black text-zinc-900">{error}</p>
                <p className="text-sm text-zinc-500">Ocorreu uma falha técnica ao buscar o contrato.</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold text-sm"
              >
                Tentar Novamente
              </button>
            </div>
          ) : step === 'CONTRACT' ? (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-500">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Contrato de Intermediação</h3>
                <p className="text-zinc-500 text-sm font-medium">Leia atentamente os termos para ativar o split no plano {planName}.</p>
              </div>
              
              <div className="flex-1 bg-zinc-50 rounded-4xl p-8 overflow-y-auto mb-8 border border-zinc-100 max-h-[350px] custom-scrollbar prose prose-sm prose-zinc">
                <ReactMarkdown>
                  {termsData?.contractText || 'Carregando termos...'}
                </ReactMarkdown>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setStep('BANK_DATA')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 group"
                >
                  Concordo e Desejo Ativar
                  <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest">
                  Versão do Contrato: {termsData?.version || '1.0.0'}
                </p>
              </div>
            </div>
          ) : step === 'BANK_DATA' ? (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-500">
              <div className="mb-10">
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Dados para Recebimento</h3>
                <p className="text-zinc-500 text-sm font-medium">Onde o Asaas deve depositar o seu dinheiro? (Opcional agora)</p>
              </div>

              <div className="flex-1 space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Banco</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Itaú"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold"
                      value={formData.bank}
                      onChange={(e) => setFormData({...formData, bank: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Agência</label>
                    <input 
                      type="text" 
                      placeholder="0001"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold"
                      value={formData.agency}
                      onChange={(e) => setFormData({...formData, agency: maskAgency(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Número da Conta</label>
                  <input 
                    type="text" 
                    placeholder="12345-6"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold"
                    value={formData.account}
                    onChange={(e) => setFormData({...formData, account: maskAccount(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setStep('CHECKOUT_DATA')}
                  className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-2"
                >
                  Próximo Passo
                </button>
                <button 
                  onClick={() => setStep('CHECKOUT_DATA')}
                  className="w-full py-2 rounded-2xl font-bold text-[10px] text-zinc-400 hover:text-zinc-900 transition-colors flex items-center justify-center uppercase tracking-widest"
                >
                  Preencher dados bancários depois
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-500">
              <div className="mb-10">
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Dados de Faturamento</h3>
                <p className="text-zinc-500 text-sm font-medium">Informe seu documento para gerar a cobrança do plano.</p>
              </div>

              <div className="flex-1 space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">CPF ou CNPJ</label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00"
                    autoFocus
                    className={`w-full bg-zinc-50 border-2 ${formData.document.replace(/\D/g, "").length >= 11 ? 'border-zinc-100' : 'border-red-100'} rounded-2xl px-6 py-5 focus:border-green-500 focus:bg-white transition-all outline-none text-lg font-black tracking-tighter`}
                    value={formData.document}
                    onChange={handleDocumentChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  disabled={formData.document.replace(/\D/g, "").length < 11}
                  onClick={handleConfirm}
                  className="w-full px-8 py-6 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:bg-zinc-200 disabled:shadow-none text-white rounded-[2rem] font-black transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  Finalizar e Pagar Plano
                  <IconCheckCircle2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setStep('BANK_DATA')}
                  className="w-full py-2 rounded-3xl font-black text-zinc-400 hover:text-zinc-600 transition-all uppercase tracking-widest text-[9px]"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {/* Progress Indicators */}
          {!loadingTerms && (
            <div className="mt-auto flex justify-center gap-3 pt-8">
              <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step === 'CONTRACT' ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-100'}`}></div>
              <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step === 'BANK_DATA' ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-100'}`}></div>
              <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step === 'CHECKOUT_DATA' ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-100'}`}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
