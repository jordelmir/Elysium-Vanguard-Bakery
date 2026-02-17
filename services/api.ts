
import { Product, Order, User, Role, OrderStatus, ProductionStep, AICakeDesign, RawMaterial, Recipe, WasteLog } from '../types';
import { GoogleGenAI } from "@google/genai";

const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'm1', 
    name: 'SYNTH-DARK 01', 
    tagline: 'Materia Oscura & Cacao',
    description: 'Biscocho infusionado con café de altura y núcleo de ganache criogénico.', 
    price: 24000, 
    category: 'Molecular', 
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', 
    stock: 12, 
    cost: 12000,
    profile: { 
      sweetness: 4, texture: 'Velvet', complexity: 9, 
      scentNotes: ['Humo', 'Roble', 'Cacao'],
      allergens: ['Gluten', 'Lácteos'],
      ingredients: ['Harina de Fuerza', 'Cacao 70%', 'Café Arábica', 'Mantequilla de Pasto']
    }
  },
  { 
    id: 'a1', 
    name: 'CLOUD Sourdough', 
    tagline: 'Fermentación Atmosférica',
    description: '72 horas de reposo controlado. Estructura alveolar perfecta.', 
    price: 4500, 
    category: 'Artesanal', 
    image: 'https://images.unsplash.com/photo-1585478259715-876a2371ee58?w=800&q=80', 
    stock: 50, 
    cost: 1500,
    profile: { 
      sweetness: 1, texture: 'Crisp', complexity: 7, 
      scentNotes: ['Cereal', 'Levadura', 'Nuez'],
      allergens: ['Gluten'],
      ingredients: ['Harina Ecológica', 'Agua Filtrada', 'Sal Marina', 'Masa Madre Centenaria']
    }
  }
];

let MOCK_RAW_MATERIALS: RawMaterial[] = [
  { id: 'raw1', name: 'Harina Orgánica T65', unit: 'kg', stock: 250, minStock: 50, costPerUnit: 1200 },
  { id: 'raw2', name: 'Mantequilla AOP', unit: 'kg', stock: 45, minStock: 10, costPerUnit: 8500 },
  { id: 'raw3', name: 'Levadura Salvaje', unit: 'g', stock: 5000, minStock: 1000, costPerUnit: 5 }
];

let MOCK_RECIPES: Recipe[] = [
  { id: 'rec1', productId: 'a1', ingredients: [{ materialId: 'raw1', amount: 0.5 }, { materialId: 'raw3', amount: 100 }], procedure: ['Autólisis', 'Amasado', 'Fermentación en Frío'] }
];

let MOCK_ORDERS: Order[] = [];
let MOCK_WASTE: WasteLog[] = [];

export const ApiService = {
  getProducts: async () => [...MOCK_PRODUCTS],
  getOrders: async () => [...MOCK_ORDERS],
  getRawMaterials: async () => [...MOCK_RAW_MATERIALS],
  getRecipes: async () => [...MOCK_RECIPES],
  getWaste: async () => [...MOCK_WASTE],
  
  createOrder: async (order: Order) => {
    MOCK_ORDERS.push(order);
    return order;
  },

  logWaste: async (waste: Omit<WasteLog, 'id' | 'timestamp' | 'costLoss'>) => {
    const product = MOCK_PRODUCTS.find(p => p.id === waste.productId);
    const newWaste: WasteLog = {
      ...waste,
      id: `WST-${Math.random()}`,
      timestamp: Date.now(),
      costLoss: (product?.cost || 0) * waste.quantity
    };
    MOCK_WASTE.push(newWaste);
    if (product) product.stock -= waste.quantity;
    return newWaste;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    MOCK_ORDERS = MOCK_ORDERS.map(o => o.id === id ? { ...o, status } : o);
  },

  updateProductionStep: async (id: string, step: ProductionStep) => {
    MOCK_ORDERS = MOCK_ORDERS.map(o => o.id === id ? { ...o, productionStep: step } : o);
    if (step === ProductionStep.MIXING) {
      const order = MOCK_ORDERS.find(o => o.id === id);
      order?.items.forEach(item => {
        const recipe = MOCK_RECIPES.find(r => r.productId === item.id);
        recipe?.ingredients.forEach(ing => {
          const mat = MOCK_RAW_MATERIALS.find(m => m.id === ing.materialId);
          if (mat) mat.stock -= (ing.amount * item.quantity);
        });
      });
    }
  },

  login: async (role: Role): Promise<User> => {
    // Pro-fix: Simulate network handshake latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: Math.random().toString(36).substring(7),
      email: `${role.toLowerCase()}@nexus.atelier`,
      name: role === Role.ADMIN ? 'Director_N' : role === Role.BAKER ? 'Artisan_X' : role === Role.DRIVER ? 'Logistic_Unit' : 'Client_Node',
      role: role,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${role}`,
      nexusPoints: 1500,
      tier: 'Syndicate',
      subscriptions: []
    };
  },

  getSensoryDescription: async (productName: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza sensorialmente el pan "${productName}". Describe textura, aroma y regusto en 10 palabras técnicas y poéticas de alta gastronomía.`,
    });
    return response.text;
  },

  initChat: async () => {
    return "NEURAL_LINK_ESTABLISHED. Describe tu concepto de materia culinaria.";
  },

  sendMessageToChat: async (message: string, imageBase64?: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
    });
    return { 
      text: response.text, 
      designData: { 
        isComplete: message.toLowerCase().includes('confirmar'), 
        finalPrompt: message, 
        theme: 'Sinfonía Molecular', 
        flavor: 'Vainilla/Miso', 
        servings: 12 
      } 
    };
  },

  generateRealImage: async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-fashion gourmet cake photography, ${prompt}, solid black background, studio lighting.` }] }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587';
  }
};
