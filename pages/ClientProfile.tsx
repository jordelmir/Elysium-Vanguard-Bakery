
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Fingerprint, Wallet, History, Sparkles, Award } from 'lucide-react';

export default function ClientProfile() {
  const { user } = useAuth();
  const { orders } = useStore();

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-40 space-y-20 animate-fadeIn">
      {/* Profile HUD */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 glass-card p-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Fingerprint size={120} strokeWidth={1} />
           </div>
           
           <div className="relative z-10 flex items-center gap-10">
              <div className="w-32 h-32 bg-atelier-900 border border-white/5 relative">
                 <img src={user.avatar} className="w-full h-full object-cover grayscale" />
                 <div className="absolute -bottom-2 -right-2 bg-neon-green text-black px-2 py-0.5 text-[8px] font-black font-mono uppercase">Lvl_12</div>
              </div>
              <div>
                 <p className="text-[10px] font-mono text-neon-green uppercase tracking-[0.5em] mb-2">{user.tier}_Protocol</p>
                 <h2 className="text-4xl font-serif italic text-white uppercase">{user.name}</h2>
                 <p className="text-[10px] font-mono text-atelier-500 mt-2">{user.email}</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8 mt-16 pt-12 border-t border-white/5">
              <div className="bg-void/40 p-6 border border-white/5">
                 <p className="text-[9px] font-mono text-atelier-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Wallet size={12} /> Nexus_Balance
                 </p>
                 <p className="text-2xl font-mono font-bold text-white tracking-tighter italic">{user.nexusPoints} <span className="text-[10px] text-neon-green">NP</span></p>
              </div>
              <div className="bg-void/40 p-6 border border-white/5">
                 <p className="text-[9px] font-mono text-atelier-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <History size={12} /> Total_Synthesized
                 </p>
                 <p className="text-2xl font-mono font-bold text-white tracking-tighter italic">{orders.length} <span className="text-[10px] text-neon-blue">Orders</span></p>
              </div>
           </div>
        </div>

        {/* Loyalty Tier Box */}
        <div className="glass-card p-10 bg-neon-violet/5 border-neon-violet/20 flex flex-col justify-between">
           <div>
              <Award className="text-neon-violet mb-6" size={32} />
              <h3 className="text-xl font-serif italic text-white mb-4">Architect_Status</h3>
              <p className="text-xs text-atelier-500 leading-relaxed uppercase tracking-widest">Alcanza 5000 NP para desbloquear Curadurías de Nivel 3 y Acceso Beta a Laboratorios de Masa Madre.</p>
           </div>
           <div className="w-full h-1 bg-white/5 mt-10 relative">
              <div className="absolute top-0 left-0 h-full bg-neon-violet" style={{ width: '45%' }}></div>
           </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="space-y-10">
         <h3 className="text-[10px] font-mono text-white uppercase tracking-[0.5em] flex items-center gap-3">
            <Sparkles size={14} className="text-neon-blue" /> Recurring_Synthesis
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-all cursor-pointer group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:border-neon-blue transition-all">
                  <History size={20} />
               </div>
               <p className="text-[10px] font-mono uppercase tracking-[0.2em]">New_Subscription_Slot</p>
            </div>
         </div>
      </section>
    </div>
  );
}
