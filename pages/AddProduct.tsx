import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { generateProductDescription } from '../services/geminiService';
import { CATEGORIES } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: CATEGORIES[0],
    description: '',
    image: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
      if(!formData.title) {
          alert("Please enter a product title first.");
          return;
      }
      setAiLoading(true);
      try {
          const desc = await generateProductDescription(formData.title, formData.category, "High quality, durable, best value");
          setFormData(prev => ({...prev, description: desc || ''}));
      } catch (e) {
          alert("Failed to generate description. Ensure API Key is set.");
      } finally {
          setAiLoading(false);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate upload delay
    setTimeout(() => {
        StorageService.saveProduct({
            id: `prod-${Date.now()}`,
            title: formData.title,
            price: Number(formData.price),
            description: formData.description,
            category: formData.category,
            image: formData.image,
            rating: 0,
            reviews: 0,
            sellerId: 'seller-1' // Hardcoded for demo
        });
        setLoading(false);
        navigate('/seller');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                <input 
                    name="title" 
                    required 
                    className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none" 
                    placeholder="e.g. Wireless Headphones"
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
                    <input 
                        name="price" 
                        type="number" 
                        required 
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                     <select 
                        name="category" 
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none bg-white"
                        value={formData.category}
                        onChange={handleChange}
                     >
                         {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button 
                        type="button" 
                        onClick={handleGenerateDescription}
                        disabled={aiLoading}
                        className="text-xs flex items-center gap-1 text-secondary font-bold hover:underline disabled:opacity-50"
                    >
                        {aiLoading ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                        {aiLoading ? 'Generating...' : 'Auto-Generate with AI'}
                    </button>
                </div>
                <textarea 
                    name="description" 
                    required 
                    rows={4} 
                    className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Mock)</label>
                <input 
                    name="image" 
                    className="w-full border rounded-lg p-2.5 bg-gray-50 text-gray-500" 
                    value={formData.image} 
                    readOnly 
                />
                <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover mt-2 rounded border" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => navigate('/seller')} className="px-6 py-2 rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded hover:bg-orange-600 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default AddProduct;