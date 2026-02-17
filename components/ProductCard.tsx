
import React, { useState } from 'react';
import { Product, Role } from '../types';
import { Plus, Command, Loader2, Sparkles, MoveRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const { user } = useAuth();
  const [sensoryDesc, setSensoryDesc] = useState<string | null>(null);
  const [loadingSensory, setLoadingSensory] = useState(false);

  const handleMouseEnter = async () => {
    if (!sensoryDesc && !loadingSensory) {
      setLoadingSensory(true);
      try {
        const desc = await ApiService.getSensoryDescription(product.name);
        setSensoryDesc(desc);
      } catch (e) {
        setSensoryDesc("Sinfonía molecular de texturas.");
      } finally {
        setLoadingSensory(false);
      }
    }
  };

  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={handleMouseEnter}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-atelier-900 border border-white/5 mb-6 group-hover:border-neon-green/30 transition-all duration-700">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
        />
        
        {/* Sensory Overlay */}
        <div className={`absolute inset-0 bg-void/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center transition-opacity duration-700 ${sensoryDesc ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <Sparkles size={20} className="text-neon-green mb-4 opacity-50" />
           <p className="text-[11px] font-mono font-bold text-white uppercase tracking-widest leading-relaxed">
             {sensoryDesc}
           </p>
        </div>

        {loadingSensory && (
          <div className="absolute inset-4 flex items-end justify-start">
             <div className="bg-void/80 px-3 py-1 border border-white/10 flex items-center gap-2">
                <Loader2 size={10} className="animate-spin text-neon-green" />
                <span className="text-[8px] font-mono uppercase tracking-widest text-atelier-500">Scanning_Profile...</span>
             </div>
          </div>
        )}

        <div className="absolute top-4 left-4 z-20">
           <span className="bg-void/90 px-2 py-1 border border-white/10 text-[8px] font-mono font-bold text-atelier-500 uppercase tracking-widest">
             #{product.id}
           </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
           <div className="flex-1">
              <h3 className="text-xl font-serif italic text-white leading-none mb-1 group-hover:text-neon-green transition-colors">{product.name}</h3>
              <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-widest">{product.tagline}</p>
           </div>
           <span className="text-lg font-bold text-white font-mono">₡{product.price.toLocaleString()}</span>
        </div>

        <p className="text-xs text-atelier-500 mt-4 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Technical Specs on Hover */}
        <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
           {user?.role === Role.CLIENT ? (
             <button 
               onClick={() => addToCart(product)}
               className="flex items-center gap-4 text-[10px] font-mono font-black text-white hover:text-neon-green uppercase tracking-[0.3em]"
             >
               Add_To_Order <MoveRight size={14} />
             </button>
           ) : (
             <span className="text-[9px] font-mono text-atelier-500 uppercase">Viewing_Only</span>
           )}
           <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i <= (product.profile?.complexity || 1) / 3 ? 'bg-neon-green' : 'bg-white/10'}`}></div>)}
           </div>
        </div>
      </div>
    </div>
  );
}
