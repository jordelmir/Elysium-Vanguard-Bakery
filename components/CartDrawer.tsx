import React, { useState } from 'react';
import { X, ShoppingBag, Truck, Store, CreditCard, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, cartTotal, placeOrder } = useStore();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    await placeOrder(deliveryType, name);
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex animate-slideInRight">
        <div className="h-full w-full bg-panel border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-surface/50">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wider">
              <ShoppingBag className="text-neon-blue" size={18} />
              {step === 'cart' ? 'System_Cart' : 'Secure_Checkout'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                    <ShoppingBag className="text-gray-600" size={32} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-white font-mono">CART_EMPTY</h3>
                   <p className="text-gray-500 mt-2 text-sm font-mono">Initialize item selection...</p>
                 </div>
                 <button onClick={onClose} className="text-neon-blue font-bold font-mono hover:text-white transition-colors flex items-center gap-1">
                   <ChevronRight size={16} /> RETURN_TO_CATALOG
                 </button>
              </div>
            ) : step === 'cart' ? (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-surface border border-white/5 rounded hover:border-neon-blue/30 transition-colors group">
                    <div className="w-20 h-20 rounded bg-black shrink-0 border border-white/10 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-200 text-sm">{item.name}</h4>
                        <p className="text-xs text-neon-blue font-mono mt-1">x{item.quantity}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono font-bold text-white">₡{(item.price * item.quantity).toLocaleString()}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider border border-transparent hover:border-red-500/50 px-2 py-0.5 rounded transition-all"
                        >
                          Eject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form id="checkout-form" onSubmit={handleOrder} className="space-y-8">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 font-mono">Delivery_Protocol</label>
                   <div className="grid grid-cols-2 gap-4">
                     <button
                       type="button"
                       onClick={() => setDeliveryType('pickup')}
                       className={`flex flex-col items-center p-4 border rounded-none transition-all ${
                         deliveryType === 'pickup' 
                         ? 'border-neon-blue bg-neon-blue/10 text-neon-blue shadow-glow-blue' 
                         : 'border-white/10 bg-surface text-gray-500 hover:bg-white/5'
                       }`}
                     >
                       <Store className="mb-2" />
                       <span className="font-mono text-xs font-bold">PICKUP</span>
                     </button>
                     <button
                       type="button"
                       onClick={() => setDeliveryType('delivery')}
                       className={`flex flex-col items-center p-4 border rounded-none transition-all ${
                         deliveryType === 'delivery' 
                         ? 'border-neon-blue bg-neon-blue/10 text-neon-blue shadow-glow-blue' 
                         : 'border-white/10 bg-surface text-gray-500 hover:bg-white/5'
                       }`}
                     >
                       <Truck className="mb-2" />
                       <span className="font-mono text-xs font-bold">DELIVERY</span>
                     </button>
                   </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-mono">User_Identity</label>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-neon-blue focus:shadow-glow-blue focus:outline-none font-mono text-sm"
                      placeholder="ENTER_FULL_NAME"
                    />
                 </div>

                 <div className="bg-surface border border-white/10 p-5">
                    <div className="flex justify-between text-sm mb-2 font-mono text-gray-400">
                       <span>SUBTOTAL</span>
                       <span>₡{cartTotal.toLocaleString()}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                       <div className="flex justify-between text-sm mb-2 font-mono text-neon-purple">
                         <span>LOGISTICS_FEE</span>
                         <span>₡1,500</span>
                       </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-white border-t border-dashed border-white/20 pt-4 mt-4 font-mono">
                       <span>TOTAL</span>
                       <span>₡{(cartTotal + (deliveryType === 'delivery' ? 1500 : 0)).toLocaleString()}</span>
                    </div>
                 </div>
              </form>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-surface/50">
              {step === 'cart' ? (
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-lg font-bold text-white font-mono">
                     <span>ESTIMATE</span>
                     <span className="text-neon-blue">₡{cartTotal.toLocaleString()}</span>
                   </div>
                   <button 
                     onClick={() => setStep('checkout')}
                     className="w-full py-4 bg-neon-blue text-black font-bold font-mono text-lg uppercase tracking-wider hover:bg-white hover:shadow-glow-blue transition-all flex items-center justify-center gap-2 clip-path-polygon"
                   >
                     Initialize Checkout
                   </button>
                </div>
              ) : (
                <div className="space-y-4">
                   <button 
                     type="button"
                     onClick={() => setStep('cart')}
                     className="w-full py-3 text-gray-500 font-mono text-xs hover:text-white transition-colors uppercase tracking-widest"
                   >
                     &lt; Cancel_Transaction
                   </button>
                   <button 
                     form="checkout-form"
                     type="submit"
                     className="w-full py-4 bg-neon-green text-black font-bold font-mono text-lg uppercase tracking-wider hover:bg-white hover:shadow-glow-green transition-all flex items-center justify-center gap-2"
                   >
                     <Zap size={20} fill="black" />
                     CONFIRM_PAYMENT
                   </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}