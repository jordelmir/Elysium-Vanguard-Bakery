
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Package, ArrowUpRight, ArrowDownRight, Trash2, Edit3, Plus, Scale } from 'lucide-react';

export default function AdminInventory() {
  const { products, updateProduct } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-32 space-y-12 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-serif italic text-white mb-2 tracking-tighter">Matriz_Material</h1>
          <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-[0.5em]">Inventory_Control_System</p>
        </div>
        <button className="px-8 py-3 bg-white text-black font-mono font-black text-[10px] uppercase tracking-widest hover:bg-neon-green transition-all flex items-center gap-2">
          <Plus size={14} /> Register_Material
        </button>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {products.map(product => (
          <div key={product.id} className="glass-card p-6 flex items-center justify-between group hover:border-neon-blue/30 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-atelier-900 border border-white/5 overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <h3 className="text-white font-bold font-mono text-sm uppercase tracking-wider">{product.name}</h3>
                <p className="text-[9px] text-atelier-500 font-mono">ID: {product.id} | COST: ₡{product.cost}</p>
              </div>
            </div>

            <div className="flex items-center gap-20">
              <div className="text-center">
                <p className="text-[8px] font-mono text-atelier-500 uppercase mb-1">Stock_Current</p>
                <div className={`text-lg font-mono font-bold ${product.stock < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {product.stock} <span className="text-[10px] text-atelier-500">units</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[8px] font-mono text-atelier-500 uppercase mb-1">Margin_Net</p>
                <div className="text-lg font-mono font-bold text-neon-green">
                  {Math.round(((product.price - product.cost) / product.price) * 100)}%
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 border border-white/5 text-atelier-500 hover:text-white hover:border-white/20 transition-all">
                  <ArrowUpRight size={16} />
                </button>
                <button className="p-3 border border-white/5 text-atelier-500 hover:text-red-500 hover:border-red-500/20 transition-all">
                  <Trash2 size={16} />
                </button>
                <button className="p-3 border border-white/5 text-atelier-500 hover:text-neon-blue hover:border-neon-blue/20 transition-all">
                  <Edit3 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Demand Prediction */}
      <div className="mt-20 p-10 bg-atelier-900/50 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <Scale className="text-neon-green opacity-20" size={100} strokeWidth={0.5} />
        </div>
        <div className="relative z-10">
           <h4 className="text-[10px] font-mono text-neon-green uppercase tracking-[0.5em] mb-4">Neural_Insights:</h4>
           <p className="text-xl text-white font-light max-w-2xl leading-relaxed italic">
             "La tendencia de consumo indica una alta demanda de <span className="text-neon-green">CLOUD Sourdough</span> para el fin de semana. Se recomienda aumentar el stock un 25% para evitar pérdida de oportunidad."
           </p>
        </div>
      </div>
    </div>
  );
}
