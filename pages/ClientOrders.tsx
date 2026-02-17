import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Clock, MapPin } from 'lucide-react';
import { OrderStatus } from '../types';

export default function ClientOrders() {
  const { orders } = useStore();
  
  // In a real app, this would filter by the logged-in user ID
  // For the demo, we show all orders to demonstrate functionality easily
  const myOrders = orders; 

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-black text-white mb-8 font-mono tracking-tighter">HISTORIAL_PEDIDOS</h1>

      <div className="space-y-6">
        {myOrders.map(order => (
          <div key={order.id} className="bg-surface border border-white/10 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-50"></div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                   <span className="text-xs font-mono text-neon-blue">ID: #{order.id}</span>
                   <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                     <span className={`w-2 h-2 rounded-full animate-pulse ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-500' : 
                        order.status === OrderStatus.READY ? 'bg-blue-500' : 'bg-yellow-500'
                     }`}></span>
                     {order.status}
                   </h3>
                </div>
                <div className="text-right">
                   <p className="text-xl font-bold text-white font-mono">₡{order.total.toLocaleString()}</p>
                   <p className="text-xs text-gray-500 font-mono">{new Date(order.timestamp).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Progress Bar (Mock) */}
              <div className="relative mb-8 pt-4">
                 <div className="h-1 bg-white/10 w-full">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.5)] transition-all duration-1000"
                      style={{ 
                        width: order.status === OrderStatus.PENDING ? '25%' : 
                               order.status === OrderStatus.PRODUCTION ? '50%' :
                               order.status === OrderStatus.READY ? '75%' : '100%'
                      }}
                    ></div>
                 </div>
                 <div className="flex justify-between mt-3 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    <span className={order.status === OrderStatus.PENDING ? 'text-neon-blue' : ''}>Recibido</span>
                    <span className={order.status === OrderStatus.PRODUCTION ? 'text-neon-purple' : ''}>Producción</span>
                    <span className={order.status === OrderStatus.READY ? 'text-neon-green' : ''}>Listo</span>
                    <span className={order.status === OrderStatus.DELIVERED ? 'text-white' : ''}>Entregado</span>
                 </div>
              </div>

              <div className="border-t border-white/5 pt-4 bg-black/20 -mx-6 px-6 -mb-6 pb-6">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 font-mono">Detalle de Items</h4>
                 <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm text-gray-300">
                         <span><span className="text-neon-blue font-bold">{item.quantity}x</span> {item.name}</span>
                         <span className="font-mono">₡{(item.price * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                 </ul>

                 {/* Action Buttons */}
                 <div className="mt-6 flex gap-3">
                    <button className="flex-1 py-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-none text-xs font-bold font-mono uppercase tracking-wider transition-colors">
                       Ver Recibo Digital
                    </button>
                    {order.type === 'delivery' && order.status !== OrderStatus.DELIVERED && (
                      <button className="flex-1 py-3 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue/20 rounded-none text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue transition-all">
                         <MapPin size={14} />
                         Rastrear Drone
                      </button>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
        
        {myOrders.length === 0 && (
           <div className="text-center py-20 bg-surface border border-dashed border-white/10">
              <Package className="mx-auto text-gray-700 mb-4" size={48} />
              <p className="text-gray-500 font-mono">NO DATA LOGS FOUND</p>
           </div>
        )}
      </div>
    </div>
  );
}