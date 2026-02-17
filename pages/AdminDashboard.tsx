
import React from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Package, AlertTriangle, ShieldCheck, Activity, Target } from 'lucide-react';

export default function AdminDashboard() {
  const { orders, products, wasteLogs, rawMaterials, isLoading } = useStore();

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-void text-neon-green">SYNCING_METRICS...</div>;

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalCost = orders.reduce((acc, o) => acc + o.items.reduce((sum, i) => sum + (i.cost * i.quantity), 0), 0);
  const totalWaste = wasteLogs.reduce((acc, w) => acc + w.costLoss, 0);
  const netProfit = totalRevenue - totalCost - totalWaste;

  const rawAlerts = rawMaterials.filter(m => m.stock < m.minStock);

  const stats = [
    { label: 'Revenue_Node', value: `₡${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-neon-blue' },
    { label: 'Net_Profit', value: `₡${netProfit.toLocaleString()}`, icon: Activity, color: 'text-neon-green' },
    { label: 'Waste_Loss', value: `₡${totalWaste.toLocaleString()}`, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Raw_Alerts', value: rawAlerts.length, icon: ShieldCheck, color: 'text-neon-violet' },
  ];

  return (
    <div className="max-w-[1700px] mx-auto px-8 py-32 space-y-12 animate-fadeIn">
      {/* HUD Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
           <h1 className="text-6xl font-serif italic text-white tracking-tighter">Finance_HUD</h1>
           <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-[0.5em] mt-2">Core_Financial_Telemetry.v4</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-neon-green/5 border border-neon-green/20 p-4 text-right">
              <p className="text-[8px] font-mono text-neon-green uppercase tracking-widest">System_Health</p>
              <p className="text-xs font-bold text-white uppercase">98.4% Nominal</p>
           </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-8 border border-white/5 hover:border-white/10 transition-all">
             <div className="flex justify-between items-start mb-6">
                <stat.icon className={stat.color} size={20} />
                <span className="text-[8px] font-mono text-atelier-500 uppercase tracking-[0.2em]">{stat.label}</span>
             </div>
             <h3 className="text-3xl font-mono font-black text-white italic tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Performance Graph */}
        <div className="xl:col-span-2 glass-card p-10 h-[500px] flex flex-col">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-[10px] font-mono text-white uppercase tracking-[0.5em]">Synthesis_Efficiency</h4>
              <div className="flex gap-6">
                 <span className="flex items-center gap-2 text-[9px] font-mono text-neon-blue uppercase"><div className="w-2 h-2 rounded-full bg-neon-blue"></div> Revenue</span>
                 <span className="flex items-center gap-2 text-[9px] font-mono text-red-500 uppercase"><div className="w-2 h-2 rounded-full bg-red-500"></div> Loss</span>
              </div>
           </div>
           <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={orders.map(o => ({ t: new Date(o.timestamp).toLocaleDateString(), v: o.total }))}>
                 <defs>
                   <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                 <XAxis dataKey="t" hide />
                 <YAxis hide />
                 <Tooltip contentStyle={{backgroundColor: '#050505', border: '1px solid #ffffff10', color: '#fff'}} />
                 <Area type="monotone" dataKey="v" stroke="#00e5ff" fillOpacity={1} fill="url(#colorVal)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Inventory Warning Node */}
        <div className="glass-card p-10 flex flex-col">
           <h4 className="text-[10px] font-mono text-white uppercase tracking-[0.5em] mb-10">Critical_Materials</h4>
           <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
             {rawAlerts.map(mat => (
               <div key={mat.id} className="p-6 bg-atelier-900 border-l-2 border-neon-violet flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white uppercase">{mat.name}</p>
                    <p className="text-[9px] text-atelier-500 font-mono mt-1">STOCK: {mat.stock}{mat.unit}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] text-red-500 font-bold font-mono">REORDER_REQ</p>
                  </div>
               </div>
             ))}
             {rawAlerts.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <Target size={40} />
                  <p className="text-[9px] font-mono mt-4 uppercase">All_Stocks_Nominal</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
