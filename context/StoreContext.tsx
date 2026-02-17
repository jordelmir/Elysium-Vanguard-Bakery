
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, OrderStatus, ProductionStep, AICakeDesign, RawMaterial, Recipe, WasteLog } from '../types';
import { ApiService } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface StoreContextType {
  products: Product[];
  rawMaterials: RawMaterial[];
  recipes: Recipe[];
  orders: Order[];
  wasteLogs: WasteLog[];
  cart: CartItem[];
  isLoading: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  addToCart: (product: Product, design?: AICakeDesign) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (type: 'delivery' | 'pickup', name: string) => Promise<void>;
  
  // Operations
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateProductionStep: (orderId: string, step: ProductionStep) => Promise<void>;
  logWaste: (productId: string, qty: number, reason: string) => Promise<void>;
  
  // AI
  initCakeChat: () => Promise<string>;
  sendChatMessage: (msg: string) => Promise<{ text: string, designData?: any }>;
  generateRealImage: (prompt: string) => Promise<string>;
  
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prods, ords, raws, recs, wastes] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getOrders(),
        ApiService.getRawMaterials(),
        ApiService.getRecipes(),
        ApiService.getWaste()
      ]);
      setProducts(prods);
      setOrders(ords);
      setRawMaterials(raws);
      setRecipes(recs);
      setWasteLogs(wastes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product, design?: AICakeDesign) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id && !design);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1, customDesign: design }];
    });
    toast.success(`${product.name} agregado al sistema`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const placeOrder = async (type: 'delivery' | 'pickup', customerName: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const newOrder: Order = {
        id: `NEX-${Math.floor(Math.random() * 100000)}`,
        customerId: user.id,
        customerName,
        items: [...cart],
        total: cartTotal,
        status: OrderStatus.PENDING,
        productionStep: ProductionStep.QUEUE,
        timestamp: Date.now(),
        type,
        paymentMethod: 'nexus_wallet',
        pointsEarned: Math.floor(cartTotal * 0.05),
        pointsUsed: 0
      };
      await ApiService.createOrder(newOrder);
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      toast.success("Orden enlazada al nodo de producción");
    } catch (error) {
      toast.error("Error de comunicación de red");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await ApiService.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateProductionStep = async (orderId: string, step: ProductionStep) => {
    await ApiService.updateProductionStep(orderId, step);
    const [raws, updatedOrders] = await Promise.all([
      ApiService.getRawMaterials(),
      ApiService.getOrders()
    ]);
    setRawMaterials(raws);
    setOrders(updatedOrders);
  };

  const logWaste = async (productId: string, quantity: number, reason: string) => {
    await ApiService.logWaste({ productId, quantity, reason });
    fetchData();
    toast.warn("Merma registrada en el libro contable");
  };

  const initCakeChat = () => ApiService.initChat();
  const sendChatMessage = (msg: string) => ApiService.sendMessageToChat(msg);
  const generateRealImage = (prompt: string) => ApiService.generateRealImage(prompt);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider value={{
      products, rawMaterials, recipes, orders, wasteLogs, cart, isLoading,
      fetchData, addToCart, removeFromCart, clearCart,
      placeOrder, updateOrderStatus, updateProductionStep, logWaste,
      initCakeChat, sendChatMessage, generateRealImage,
      cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
