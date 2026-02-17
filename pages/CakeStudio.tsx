
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Command, Sparkles, Loader2, Maximize2, Trash2, Cpu } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AICakeDesign, ChatMessage } from '../types';

export default function CakeStudio() {
  const { initCakeChat, sendChatMessage, generateRealImage, addToCart, products } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [design, setDesign] = useState<AICakeDesign | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initCakeChat().then(msg => setMessages([{ id: '1', sender: 'ai', text: msg, timestamp: Date.now() }]));
  }, []);

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg, timestamp: Date.now() }]);
    setIsTyping(true);

    try {
      const res = await sendChatMessage(userMsg);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: res.text, timestamp: Date.now() }]);
      
      if (res.designData?.isComplete) {
        setIsGenerating(true);
        const img = await generateRealImage(res.designData.finalPrompt);
        setDesign({
          id: Date.now().toString(),
          imageUrl: img,
          prompt: res.designData.finalPrompt,
          details: { ...res.designData, notes: res.designData.theme, style: 'Avant-garde' },
          priceEstimate: (res.designData.servings || 10) * 4500,
          aiConfidence: 0.98
        });
        setIsGenerating(false);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-void overflow-hidden relative">
      
      {/* Visual Workspace */}
      <div className="flex-1 relative flex items-center justify-center p-20 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.03),transparent_70%)]">
        
        {/* Decorative Grid Numbers */}
        <div className="absolute top-10 left-10 text-[8px] font-mono text-atelier-500 uppercase tracking-[0.5em] flex flex-col gap-1">
          <span>X-COORDINATE: 44.22</span>
          <span>Y-COORDINATE: 11.90</span>
          <span>RENDER_STATUS: ACTIVE</span>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center gap-8 animate-pulse">
            <div className="w-80 h-80 border border-white/5 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-neon-green/5 animate-scan"></div>
               <Loader2 size={40} className="text-neon-green animate-spin" />
            </div>
            <p className="font-mono text-[9px] text-neon-green uppercase tracking-[0.8em]">Sintetizando_Materia...</p>
          </div>
        ) : design ? (
          <div className="flex flex-col lg:flex-row gap-20 items-center max-w-6xl animate-fadeIn">
            <div className="relative group">
              <div className="absolute -inset-4 border border-white/5 scale-95 group-hover:scale-100 opacity-50 transition-all duration-1000"></div>
              <div className="w-[450px] aspect-square bg-atelier-900 border border-white/10 shadow-2xl overflow-hidden relative">
                 <img src={design.imageUrl} className="w-full h-full object-cover" alt="Hologram" />
                 <div className="absolute top-4 right-4 bg-void/80 p-2 border border-white/10 text-white cursor-pointer hover:bg-neon-green hover:text-black transition-colors">
                    <Maximize2 size={16} />
                 </div>
              </div>
            </div>

            <div className="w-96 space-y-10">
               <div>
                  <h2 className="text-[10px] font-mono text-neon-green uppercase tracking-[0.5em] mb-4">Materia_Log:</h2>
                  <h1 className="text-5xl font-serif italic text-white leading-tight">{design.details.theme}</h1>
               </div>

               <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <div>
                    <p className="text-[8px] font-mono text-atelier-500 uppercase tracking-widest mb-1">Estructura</p>
                    <p className="text-sm font-bold text-white uppercase">{design.details.flavor}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-mono text-atelier-500 uppercase tracking-widest mb-1">Escala</p>
                    <p className="text-sm font-bold text-white uppercase">{design.details.servings} PAX</p>
                  </div>
               </div>

               <div className="pt-10 border-t border-white/10 flex items-center justify-between">
                  <div className="text-2xl font-mono font-bold text-neon-green">₡{design.priceEstimate.toLocaleString()}</div>
                  <button 
                    onClick={() => addToCart(products.find(p => p.id === 'c-base')!, design)}
                    className="px-10 py-4 bg-white text-black font-mono font-black text-[10px] uppercase tracking-widest hover:bg-neon-green transition-all"
                  >
                    Confirm_Synthesis
                  </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 opacity-20">
             <Cpu size={60} className="text-white animate-float" />
             <p className="text-[10px] font-mono text-white uppercase tracking-[1em]">Awaiting_Input_Parameters</p>
          </div>
        )}
      </div>

      {/* Terminal Interface (Sidebar) */}
      <div className="w-[450px] bg-void border-l border-white/5 flex flex-col z-30 shadow-2xl">
         <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
               <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Neural_Link_v3.2</span>
            </div>
            <button onClick={() => setMessages([])} className="text-atelier-500 hover:text-white transition-colors">
               <Trash2 size={14} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] text-[11px] font-mono leading-relaxed ${m.sender === 'user' ? 'text-neon-green text-right' : 'text-atelier-500 border-l border-white/20 pl-4'}`}>
                   {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] font-mono text-atelier-500 animate-pulse italic">Thinking_Through_Logic...</div>}
            <div ref={scrollRef} />
         </div>

         <form onSubmit={handleSend} className="p-8 bg-atelier-900/40">
            <div className="relative group">
               <Command size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-atelier-500 group-focus-within:text-neon-green" />
               <input 
                 type="text" 
                 placeholder="DESCRIBE_SENSORY_VISION"
                 className="w-full bg-transparent border-b border-white/10 pl-8 pr-10 py-4 text-[11px] font-mono text-white outline-none focus:border-neon-green transition-all"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
               />
               <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-atelier-500 hover:text-neon-green">
                 <Send size={18} />
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}
