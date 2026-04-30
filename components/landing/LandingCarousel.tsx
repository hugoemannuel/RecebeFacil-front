'use client';

import { useState, useEffect } from 'react';

const SCREENSHOTS = [
  {
    title: 'Dashboard Inteligente',
    description: 'Acompanhe seu faturamento e métricas de conversão em tempo real.',
    image: '/screenshots/home.png'
  },
  {
    title: 'Gestão de Cobranças',
    description: 'Controle total sobre quem já pagou e quem está em atraso.',
    image: '/screenshots/charges.png'
  },
  {
    title: 'Relatórios Avançados',
    description: 'Projeções de fluxo de caixa e análise de performance de recuperação.',
    image: '/screenshots/reports.png'
  }
];

export function LandingCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 mb-6">
          Uma experiência <span className="text-green-500">Premium</span> de ponta a ponta
        </h2>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
          Conheça a interface que vai transformar a gestão financeira do seu negócio.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Texts */}
        <div className="w-full lg:w-1/3 space-y-4">
          {SCREENSHOTS.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                active === i 
                ? 'bg-white border-green-200 shadow-xl shadow-green-500/5 ring-1 ring-green-500/10' 
                : 'bg-transparent border-transparent hover:bg-zinc-50 opacity-60'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${active === i ? 'text-zinc-900' : 'text-zinc-500'}`}>
                {item.title}
              </h3>
              <p className={`text-sm leading-relaxed ${active === i ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {item.description}
              </p>
            </button>
          ))}
        </div>

        {/* Image Display */}
        <div className="w-full lg:w-2/3 relative group">
          <div className="absolute -inset-4 bg-linear-to-tr from-green-500/10 to-purple-500/10 rounded-[2.5rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl border border-zinc-200 bg-zinc-900 aspect-video">
            {SCREENSHOTS.map((item, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  active === i 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                }`}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Dots Mobile */}
          <div className="flex justify-center gap-2 mt-8 lg:hidden">
            {SCREENSHOTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${active === i ? 'w-8 bg-green-500' : 'bg-zinc-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
