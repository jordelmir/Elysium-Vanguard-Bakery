import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus, Role } from '../types';
import { Clock, CheckCircle, Truck, Package, Play, ChevronRight } from 'lucide-react';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const { user } = useAuth();

  const columns = [
    { title: 'Pendientes', status: OrderStatus.PENDING, icon: Clock, color: 'text-neon-yellow border-neon-yellow', bg: 'bg-neon-yellow/10' },
    { title: 'Producción', status: OrderStatus.PRODUCTION, icon: Package, color: 'text-neon-blue border-neon-blue', bg: 'bg-neon-blue/10' },
    { title: 'Listos', status: OrderStatus.READY, icon: CheckCircle, color: 'text-neon-green border-neon-green', bg: 'bg-neon-green/10' },
    { title: 'Entregados', status: OrderStatus.DELIVERED, icon: Truck, color: 'text-gray-400 border-gray-600', bg: 'bg-white/5' }
  ];

  // Only show relevant columns for Baker role
  const visibleColumns = user?.role === Role.BAKER 
    ? columns.slice(0, 2) // Baker sees Pending and Preparing
    : columns;

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === OrderStatus.PENDING) return OrderStatus.PRODUCTION;
    if (current === OrderStatus.PRODUCTION) return OrderStatus.READY;
    if (current === OrderStatus.READY) return OrderStatus.DELIVERED;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white font-mono tracking-tighter">
           {user?.role === Role.BAKER ? 'PRODUCCIÓN_COCINA' : 'RASTREO_PEDIDOS'}
        </h1>
        <div className="text-sm text-neon-blue font-mono border border-neon-blue/30 px-3 py-1 bg-neon-blue/10 rounded">
          ACTIVE_ORDERS: {orders.length}
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <div className="flex h-full gap-6 min-w-[1200px]">
          {visibleColumns.map((col) => (
            <div key={col.status} className="flex-1 flex flex-col bg-surface/50 rounded-xl border border-white/5 backdrop-blur-sm">
              {/* Column Header */}
              <div className={`p-4 border-b border-white/5 flex items-center justify-between ${col.bg}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 border rounded ${col.color}`}>
                    <col.icon size={16} />
                  </div>
                  <h3 className="font-bold text-white font-mono uppercase tracking-wider text-sm">{col.title}</h3>
                </div>
                <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-mono border border-white/10">
                  {orders.filter(o => o.status === col.status).length}
                </span>
              </div>
              
              {/* Column Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {orders
                  .filter(order => order.status === col.status)
                  .sort((a, b) => b.timestamp - a.timestamp) // Newest first
                  .map(order => (
                    <div key={order.id} className="bg-void border border-white/10 p-4 hover:border-neon-blue/50 hover:shadow-glow-blue transition-all group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-neon-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex justify-between items-start mb-2 pl-2">
                        <span className="font-mono font-bold text-neon-blue text-xs">#{order.id}</span>
                        <span className="text-[10px] text-gray-500 font-mono">
                            {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="font-bold text-white text-sm mb-3 pl-2">{order.customerName}</p>
                      
                      <div className="space-y-1 mb-4 pl-2 border-l border-white/10">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-400">
                            <span><span className="text-white font-bold">{item.quantity}x</span> {item.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between pl-2">
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${order.type === 'delivery' ? 'text-neon-pink bg-neon-pink/10' : 'text-neon-green bg-neon-green/10'}`}>
                           {order.type === 'delivery' ? 'Domicilio' : 'Retiro'}
                         </span>
                         
                         {getNextStatus(order.status) && (
                           <button 
                             onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                             className="flex items-center gap-1 bg-white/5 hover:bg-neon-blue hover:text-black text-white px-3 py-1.5 text-[10px] font-mono font-bold transition-all uppercase tracking-wider border border-white/10"
                           >
                             AVANZAR <ChevronRight size={10} />
                           </button>
                         )}
                      </div>
                    </div>
                  ))}
                  
                  {orders.filter(o => o.status === col.status).length === 0 && (
                    <div className="text-center py-10 text-gray-700 font-mono text-xs border border-dashed border-white/5 m-4">
                      [EMPTY_QUEUE]
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}