
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Category } from '../types';
import { Search, ChevronDown, Command } from 'lucide-react';

export default function StoreFront() {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p => 
    (activeCategory === 'ALL' || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-32 pb-60">
      {/* Hero: Minimalist Branding */}
      <section className="px-8 lg:px-24 mb-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-12 h-[1px] bg-neon-green"></span>
              <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-[0.5em]">Atelier_Open</span>
            </div>
            <h1 className="text-[10vw] lg:text-[140px] font-serif italic leading-[0.8] text-white -ml-2 mb-10">
              Nexus<br/><span className="not-italic font-sans font-bold tracking-tighter opacity-80">Culinary</span>
            </h1>
            <p className="max-w-md text-atelier-500 text-lg font-light leading-relaxed">
              Explorando los límites de la materia orgánica a través de síntesis algorítmica. Jireth Nexus no es una panadería, es un <span className="text-white">estudio de ingeniería sensorial</span>.
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-6 pb-4">
             <div className="flex gap-10">
                <div className="text-right">
                  <p className="text-[9px] font-mono text-atelier-500 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-xs font-bold text-white uppercase">SJO_Hub_01</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono text-atelier-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-bold text-neon-green uppercase">Syncing_Realtime</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Navigation Filter */}
      <div className="sticky top-0 z-40 bg-void/80 backdrop-blur-xl border-y border-white/5 px-8 lg:px-24 py-4 mb-20">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8 overflow-x-auto no-scrollbar w-full md:w-auto py-2">
            {['ALL', 'Molecular', 'Artesanal', 'Curadurías'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`text-[11px] font-mono font-bold uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeCategory === cat ? 'text-neon-green' : 'text-atelier-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80 group">
             <Command className="absolute left-0 top-1/2 -translate-y-1/2 text-atelier-500 group-focus-within:text-neon-green transition-colors" size={12} />
             <input 
               type="text"
               placeholder="Buscar_Materia..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-transparent border-b border-white/10 pl-6 pr-4 py-2 text-[10px] font-mono focus:border-neon-green outline-none transition-all uppercase tracking-widest"
             />
          </div>
        </div>
      </div>

      {/* Grid: Brutalist Layout */}
      <div className="max-w-[1600px] mx-auto px-8 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-32">
        {filtered.map((product, i) => (
          <div key={product.id} className="reveal-item" style={{ animationDelay: `${i * 0.15}s` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-60 border-t border-white/5 py-20 px-8 text-center">
         <p className="text-[9px] font-mono text-atelier-500 uppercase tracking-[0.8em]">End_Of_Transmission_JIRETH_NEXUS</p>
      </div>
    </div>
  );
}
