
import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, Package, Phone, CheckCircle, Clock } from 'lucide-react';
import { OrderStatus } from '../types';

export default function Logistics() {
  const { orders, updateOrderStatus } = useStore();
  const { user } = useAuth();

  const activeDeliveries = orders.filter(o => o.type === 'delivery' && o.status !== OrderStatus.DELIVERED);

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-32 space-y-12 animate-fadeIn">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-5xl font-serif italic text-white mb-2 tracking-tighter">Despliegue_Ruta</h1>
          <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-[0.5em]">Real-time Logistics Hub</p>
        </div>
        <div className="bg-neon-green/10 px-4 py-2 border border-neon-green/30">
          <span className="text-[10px] font-mono text-neon-green font-bold uppercase tracking-widest">Active_Courier: {user?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           {activeDeliveries.length === 0 ? (
             <div className="h-96 glass-card flex flex-col items-center justify-center opacity-30">
               <Package size={48} className="mb-4" />
               <p className="font-mono text-[10px] uppercase tracking-widest">Awaiting_Assignments</p>
             </div>
           ) : (
             activeDeliveries.map(order => (
               <div key={order.id} className="glass-card p-8 flex flex-col md:flex-row justify-between gap-10">
                 <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                       <span className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue border border-neon-blue/30">
                          <MapPin size={18} />
                       </span>
                       <div>
                          <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-widest">Destination</p>
                          <h4 className="text-white font-bold font-mono text-sm uppercase">{order.deliveryAddress || 'Central_Hub_01'}</h4>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                       <div>
                          <p className="text-[8px] font-mono text-atelier-500 uppercase mb-1">Customer</p>
                          <p className="text-xs text-white font-bold font-mono">{order.customerName}</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-mono text-atelier-500 uppercase mb-1">Package_Volume</p>
                          <p className="text-xs text-white font-bold font-mono">{order.items.length} units</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col justify-between items-end gap-6">
                    <div className="text-right">
                       <p className="text-[8px] font-mono text-atelier-500 uppercase mb-1">Status</p>
                       <span className="px-3 py-1 bg-white text-black font-mono font-black text-[9px] uppercase tracking-widest">
                          {order.status}
                       </span>
                    </div>
                    
                    <div className="flex gap-4">
                       <button className="p-4 bg-atelier-900 border border-white/10 text-white hover:text-neon-blue transition-all">
                          <Phone size={20} />
                       </button>
                       <button 
                         onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                         className="px-8 py-4 bg-white text-black font-mono font-black text-[10px] uppercase tracking-widest hover:bg-neon-green transition-all flex items-center gap-2"
                       >
                          Complete_Dropoff <CheckCircle size={16} />
                       </button>
                    </div>
                 </div>
               </div>
             ))
           )}
        </div>

        {/* Mini Map Proxy */}
        <div className="glass-card bg-atelier-900/50 p-6 flex flex-col h-full">
           <h3 className="text-[10px] font-mono text-atelier-500 uppercase tracking-widest mb-6">Radar_View</h3>
           <div className="flex-1 bg-void border border-white/5 relative flex items-center justify-center">
              <div className="absolute inset-0 grid-lines opacity-10"></div>
              <Navigation className="text-neon-blue animate-pulse" size={32} />
              <div className="absolute top-10 left-20 w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#bfff00]"></div>
              <div className="absolute bottom-40 right-10 w-2 h-2 rounded-full bg-neon-violet animate-pulse"></div>
           </div>
           <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Clock size={12} className="text-atelier-500" />
                 <span className="text-[9px] font-mono text-atelier-500">EST: 14:02 Arrival</span>
              </div>
              <span className="text-[9px] font-mono text-neon-blue">Active_Track</span>
           </div>
        </div>
      </div>
    </div>
  );
}
