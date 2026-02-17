
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { X, Save, Image as ImageIcon } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Partial<Product>) => Promise<void>;
  initialData?: Product; // If provided, we are in Edit mode
}

// Fix: Categories must match the Category type from types.ts
const categories: Category[] = ['Curadurías', 'Molecular', 'Artesanal', 'Post-Postre', 'Híbridos'];

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    // Fix: Default category must be a valid Category value
    category: 'Artesanal',
    image: '',
    stock: 0,
    cost: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        // Reset for new product
        setFormData({
            name: '',
            description: '',
            price: 0,
            // Fix: Default category must be a valid Category value
            category: 'Artesanal',
            image: '',
            stock: 0,
            cost: 0
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await onSubmit(formData);
        onClose();
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="relative bg-panel border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-surface/50">
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              {initialData ? 'EDIT_PRODUCT_DATA' : 'NEW_PRODUCT_ENTRY'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Image Preview */}
            <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-black border border-white/10 rounded-lg overflow-hidden relative group">
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <ImageIcon size={32} />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-mono font-bold text-gray-500 mb-1 uppercase">Nombre Producto</label>
                    <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-white focus:border-neon-blue outline-none text-sm font-mono"
                        placeholder="Ej: Concha Vainilla"
                    />
                </div>
                
                <div className="col-span-2">
                    <label className="block text-xs font-mono font-bold text-gray-500 mb-1 uppercase">URL Imagen</label>
                    <input 
                        required
                        type="url" 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-neon-blue focus:border-neon-blue outline-none text-xs font-mono"
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label className="block text-xs font-mono font-bold text-gray-500 mb-1 uppercase">Precio (₡)</label>
                    <input 
                        required
                        type="number" 
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-white focus:border-neon-green outline-none text-sm font-mono"
                    />
                </div>

                <div>
                    <label className="block text-xs font-mono font-bold text-gray-500 mb-1 uppercase">Costo Prod. (₡)</label>
                    <input 
                        required
                        type="number" 
                        min="0"
                        value={formData.cost}
                        onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-gray-400 focus:border-neon-purple outline-none text-sm font-mono"
                    />
                </div>

                <div>
                    <label className="block text-xs font-mono font-bold text-gray-500 mb-1 uppercase">Categoría</label>
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as Category})}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-white focus:border-neon-blue outline-none text-sm font-mono"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-mono font-bold text-gray-500 mb-1 uppercase">Stock Inicial</label>
                    <input 
                        required
                        type="number" 
                        min="0"
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-white focus:border-neon-blue outline-none text-sm font-mono"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-mono font-bold text-gray-500 mb-1 uppercase">Descripción</label>
                    <textarea 
                        required
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-gray-300 focus:border-neon-blue outline-none text-sm font-mono"
                        placeholder="Detalles del producto..."
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-mono font-bold text-gray-400 hover:text-white uppercase tracking-wider"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-neon-blue text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2"
                >
                    {isSubmitting ? <span className="animate-spin">⌛</span> : <Save size={14} />}
                    {initialData ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}