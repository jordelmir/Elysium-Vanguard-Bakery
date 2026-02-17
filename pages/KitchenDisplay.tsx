
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductionStep, Recipe } from '../types';
import { Clock, Beaker, Zap, ChefHat, CheckSquare, MoveRight } from 'lucide-react';

export default function KitchenDisplay() {
  const { orders, recipes, rawMaterials, updateProductionStep } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const pendingSynthesis = orders.filter(o => o.productionStep !== ProductionStep.COMPLETED);

  const getRecipe = (productId: string) => recipes.find(r => r.productId === productId);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-void overflow-hidden">
      {/* Order Queue */}
      <div className="w-[450px] border-r border-white/5 flex flex-col bg-atelier-900/20">
         <div className="p-8 border-b border-white/5">
            <h2 className="text-[10px] font-mono text-neon-green uppercase tracking-[0.5em]">Synthesis_Queue</h2>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {pendingSynthesis.map(order => (
              <button 
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full p-6 text-left border transition-all ${selectedOrder === order.id ? 'bg-neon-green/5 border-neon-green/30' : 'bg-void border-white/5 hover:border-white/10'}`}
              >
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[9px] font-mono text-atelier-500">TX_{order.id.slice(-6)}</span>
                   <span className="px-2 py-0.5 bg-white/5 text-[8px] font-mono text-white uppercase tracking-widest">{order.productionStep}</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase">{order.customerName}</h4>
                <p className="text-[10px] text-atelier-500 mt-1 font-mono">{order.items.length} MOLECULAR_UNITS</p>
              </button>
            ))}
         </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 p-12 bg-[radial-gradient(circle_at_top_right,rgba(191,255,0,0.02),transparent)]">
        {selectedOrder ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
             <div className="flex justify-between items-end">
                <div>
                   <h1 className="text-4xl font-serif italic text-white uppercase tracking-tighter">Production_Matrix</h1>
                   <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-widest mt-2">Active_Batch: #{selectedOrder}</p>
                </div>
                <div className="flex gap-4">
                   {Object.values(ProductionStep).slice(0, 5).map(step => (
                      <div key={step} className={`w-3 h-3 rounded-full ${orders.find(o => o.id === selectedOrder)?.productionStep === step ? 'bg-neon-green shadow-glow-green' : 'bg-white/5'}`}></div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Formulas */}
                <div className="space-y-8">
                   <h3 className="text-[10px] font-mono text-white uppercase tracking-[0.3em] flex items-center gap-3">
                      <Beaker size={14} className="text-neon-blue" /> Scaled_Formulas
                   </h3>
                   <div className="space-y-4">
                      {orders.find(o => o.id === selectedOrder)?.items.map(item => {
                        const recipe = getRecipe(item.id);
                        return (
                          <div key={item.id} className="p-6 bg-atelier-900 border border-white/5">
                             <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
                                <span className="text-xs font-bold text-white uppercase">{item.name}</span>
                                <span className="text-xs font-mono text-neon-green">x{item.quantity}</span>
                             </div>
                             {recipe?.ingredients.map(ing => {
                               const mat = rawMaterials.find(m => m.id === ing.materialId);
                               return (
                                 <div key={ing.materialId} className="flex justify-between text-[10px] font-mono py-1">
                                    <span className="text-atelier-500 uppercase">{mat?.name}</span>
                                    <span className="text-white font-bold">{(ing.amount * item.quantity).toFixed(2)} {mat?.unit}</span>
                                 </div>
                               );
                             })}
                          </div>
                        );
                      })}
                   </div>
                </div>

                {/* Procedures */}
                <div className="space-y-8">
                   <h3 className="text-[10px] font-mono text-white uppercase tracking-[0.3em] flex items-center gap-3">
                      <Zap size={14} className="text-neon-violet" /> Protocol_Flow
                   </h3>
                   <div className="space-y-4 border-l border-white/5 pl-8">
                      {orders.find(o => o.id === selectedOrder)?.items[0] && getRecipe(orders.find(o => o.id === selectedOrder)!.items[0].id)?.procedure.map((step, i) => (
                        <div key={i} className="flex gap-6 items-center group">
                           <span className="text-[10px] font-mono text-atelier-900 group-hover:text-neon-green transition-colors">{i+1}.</span>
                           <p className="text-xs text-atelier-500 group-hover:text-white transition-colors uppercase tracking-widest">{step}</p>
                        </div>
                      ))}
                   </div>
                   
                   <button 
                     onClick={() => {
                        const order = orders.find(o => o.id === selectedOrder)!;
                        const steps = Object.values(ProductionStep);
                        const nextStep = steps[steps.indexOf(order.productionStep) + 1] || ProductionStep.COMPLETED;
                        updateProductionStep(order.id, nextStep);
                     }}
                     className="w-full py-6 bg-white text-black font-mono font-black text-xs uppercase tracking-[0.5em] hover:bg-neon-green transition-all mt-10 flex items-center justify-center gap-3"
                   >
                      Advance_Protocol <MoveRight size={16} />
                   </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
             <ChefHat size={80} />
             <p className="text-[10px] font-mono mt-4 uppercase tracking-[1em]">Awaiting_Task_Selection</p>
          </div>
        )}
      </div>
    </div>
  );
}
