import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Star, MessageCircle, ShoppingBag } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Product, CATEGORIES } from '../types';
import { chatWithAssistant } from '../services/geminiService';

const Storefront: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Chat Assistant State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const allProducts = StorageService.getProducts();
    let filtered = allProducts;

    if (searchTerm) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setProducts(filtered);
  }, [searchTerm, selectedCategory]);

  const handleSendMessage = async () => {
      if(!chatInput.trim()) return;
      const userMsg = chatInput;
      setChatHistory(prev => [...prev, {role: 'user', text: userMsg}]);
      setChatInput('');
      setIsChatLoading(true);

      const response = await chatWithAssistant(chatHistory, userMsg);
      setChatHistory(prev => [...prev, {role: 'model', text: response}]);
      setIsChatLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 relative">
      {/* Sidebar Categories - Desktop */}
      <aside className="hidden md:block w-64 bg-white shadow-sm rounded-lg p-4 h-fit sticky top-24">
        <h3 className="font-bold text-gray-700 mb-2 text-sm uppercase">Categories</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li 
             className={`cursor-pointer hover:text-primary ${selectedCategory === null ? 'text-primary font-bold' : ''}`}
             onClick={() => setSelectedCategory(null)}
          >
              All Categories
          </li>
          {CATEGORIES.map(cat => (
            <li 
                key={cat} 
                className={`cursor-pointer hover:text-primary flex justify-between items-center ${selectedCategory === cat ? 'text-primary font-bold' : ''}`}
                onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              <ChevronRight size={14} />
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Banner - Only show on home */}
        {!searchTerm && !selectedCategory && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative h-48 md:h-80 bg-gray-200">
                    <img 
                        src="https://picsum.photos/1000/400?grayscale" 
                        alt="Banner" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center px-8">
                        <div className="text-white max-w-md">
                            <h2 className="text-3xl font-bold mb-2">Flash Sale!</h2>
                            <p className="mb-4">Get up to 80% off on Electronics & Fashion. Limited time only.</p>
                            <button className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded font-medium transition-colors">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Product Grid */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            {searchTerm ? `Results for "${searchTerm}"` : selectedCategory ? selectedCategory : "Just For You"}
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="group block border border-transparent hover:border-gray-200 hover:shadow-lg transition-all rounded p-2 bg-white">
                    <div className="aspect-square bg-gray-100 mb-2 overflow-hidden rounded-sm relative">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {product.originalPrice && product.originalPrice > product.price && (
                             <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1 rounded">
                                 -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                             </span>
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] leading-tight group-hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                        <div className="flex items-center gap-1">
                            <span className="text-primary text-lg font-bold">৳{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
                            )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 gap-1">
                            <div className="flex text-yellow-400">
                                {Array.from({length: 5}).map((_, i) => (
                                    <Star key={i} size={10} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span>({product.reviews})</span>
                        </div>
                    </div>
                </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
          {!chatOpen && (
              <button 
                onClick={() => setChatOpen(true)}
                className="bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
              >
                  <MessageCircle size={24} />
                  <span className="font-bold">Ask AI</span>
              </button>
          )}
          
          {chatOpen && (
              <div className="bg-white w-80 h-96 rounded-lg shadow-2xl flex flex-col border border-gray-200">
                  <div className="bg-secondary text-white p-3 rounded-t-lg flex justify-between items-center">
                      <h4 className="font-bold flex items-center gap-2"><ShoppingBag size={18}/> AI Assistant</h4>
                      <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 rounded p-1">✕</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 text-sm">
                      {chatHistory.length === 0 && <p className="text-gray-500 text-center italic mt-10">Hi! I can help you find the best products. What are you looking for?</p>}
                      {chatHistory.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                  {msg.text}
                              </div>
                          </div>
                      ))}
                      {isChatLoading && <div className="text-xs text-gray-400">Thinking...</div>}
                  </div>
                  <div className="p-2 border-t flex gap-2">
                      <input 
                        className="flex-1 border rounded px-2 py-1 text-sm outline-none focus:border-secondary"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button onClick={handleSendMessage} disabled={!chatInput.trim()} className="text-secondary font-bold text-sm">Send</button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default Storefront;