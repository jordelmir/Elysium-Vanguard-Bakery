
import React from 'react';
import { Product } from '../types';
import { X, Beaker, Leaf, Thermometer, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-void/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative glass-card max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden animate-fadeIn">
        
        {/* Visuals */}
        <div className="h-[400px] lg:h-full relative">
           <img src={product.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
           <div className="absolute top-0 left-0 p-8">
              <div className="bg-void/80 px-4 py-2 border border-white/10 backdrop-blur-md">
                 <p className="text-[9px] font-mono text-neon-green uppercase tracking-widest">Molecule_ID: {product.id}</p>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="p-12 space-y-10 overflow-y-auto max-h-[90vh]">
           <div className="flex justify-between items-start">
              <div>
                 <h2 className="text-5xl font-serif italic text-white mb-2 leading-none">{product.name}</h2>
                 <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-widest">{product.tagline}</p>
              </div>
              <button onClick={onClose} className="p-2 text-atelier-500 hover:text-white transition-colors">
                 <X size={24} />
              </button>
           </div>

           <p className="text-atelier-500 text-sm leading-relaxed">{product.description}</p>

           {/* Molecular Profile Grid */}
           <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
              <div>
                 <h4 className="text-[9px] font-mono text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Beaker size={12} className="text-neon-blue" /> Material_Composition
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {product.profile?.ingredients.map(ing => (
                       <span key={ing} className="px-3 py-1 bg-atelier-900 border border-white/5 text-[9px] font-mono text-atelier-500 uppercase">{ing}</span>
                    ))}
                 </div>
              </div>

              <div>
                 <h4 className="text-[9px] font-mono text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldAlert size={12} className="text-red-500" /> Bio_Alerts
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {product.profile?.allergens.map(alg => (
                       <span key={alg} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-[9px] font-mono text-red-500 uppercase">{alg}</span>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-[9px] font-mono text-white uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={12} className="text-neon-violet" /> Scent_Notes
              </h4>
              <div className="flex gap-10">
                 {product.profile?.scentNotes.map(note => (
                    <div key={note} className="text-center">
                       <p className="text-xs font-serif italic text-white">{note}</p>
                       <div className="h-[1px] w-full bg-neon-violet/30 mt-2"></div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="pt-10 flex items-center justify-between border-t border-white/5">
              <div className="text-3xl font-mono font-bold text-white">₡{product.price.toLocaleString()}</div>
              <button className="px-12 py-5 bg-white text-black font-mono font-black text-[11px] uppercase tracking-[0.3em] hover:bg-neon-green transition-all">
                 Integrate_To_Nexus
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
