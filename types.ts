
export enum Role {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  BAKER = 'BAKER',
  DRIVER = 'DRIVER'
}

export type Category = 'Curadurías' | 'Molecular' | 'Artesanal' | 'Post-Postre' | 'Híbridos';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  nexusPoints: number;
  tier: 'Neophyte' | 'Syndicate' | 'Architect';
  subscriptions: Subscription[];
}

export interface Subscription {
  id: string;
  productId: string;
  frequency: 'daily' | 'weekly';
  nextDelivery: number;
  status: 'active' | 'paused';
}

export interface RawMaterial {
  id: string;
  name: string;
  unit: 'kg' | 'g' | 'l' | 'units';
  stock: number;
  minStock: number;
  costPerUnit: number;
}

export interface Recipe {
  id: string;
  productId: string;
  ingredients: {
    materialId: string;
    amount: number;
  }[];
  procedure: string[];
}

export interface MolecularProfile {
  sweetness: number;
  texture: string;
  complexity: number;
  scentNotes: string[];
  allergens: string[];
  ingredients: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  cost: number;
  profile?: MolecularProfile;
}

export interface AICakeDesign {
  id: string;
  imageUrl: string;
  prompt: string;
  details: {
      flavor: string;
      servings: number;
      theme: string;
      notes: string;
      style: string;
  };
  priceEstimate: number;
  aiConfidence: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface CartItem extends Product {
  quantity: number;
  customDesign?: AICakeDesign;
}

export enum OrderStatus {
  PENDING = 'Ingresado',
  CONFIRMED = 'Validado',
  PRODUCTION = 'En Síntesis',
  READY = 'Finalizado',
  DELIVERING = 'En Tránsito',
  DELIVERED = 'Entregado'
}

export enum ProductionStep {
  QUEUE = 'Espera',
  MIXING = 'Formulación',
  BAKING = 'Térmico',
  DECORATING = 'Estética',
  PACKAGING = 'Sellado',
  COMPLETED = 'Listo'
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  productionStep: ProductionStep;
  timestamp: number;
  type: 'delivery' | 'pickup';
  paymentMethod: string;
  deliveryAddress?: string;
  driverId?: string;
  pointsEarned: number;
  pointsUsed: number;
}

export interface WasteLog {
  id: string;
  productId: string;
  quantity: number;
  reason: string;
  timestamp: number;
  costLoss: number;
}
