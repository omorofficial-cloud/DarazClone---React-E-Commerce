import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { Product } from '../types';
import { Star, MapPin, Truck, ShieldCheck, Share2, Heart } from 'lucide-react';

interface Props {
  onAddToCart: (product: Product) => void;
}

const ProductDetails: React.FC<Props> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
        const found = StorageService.getProducts().find(p => p.id === id);
        if (found) setProduct(found);
    }
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
            </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
            <h1 className="text-2xl font-medium text-gray-800">{product.title}</h1>
            
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-sm">
                        {Array.from({length: 5}).map((_, i) => (
                             <Star key={i} size={14} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-sm text-secondary hover:underline cursor-pointer">{product.reviews} Ratings</span>
                </div>
                <div className="flex gap-3 text-gray-400">
                    <Share2 size={20} className="hover:text-primary cursor-pointer" />
                    <Heart size={20} className="hover:text-primary cursor-pointer" />
                </div>
            </div>

            <div className="border-t border-b py-4">
                <div className="text-3xl font-bold text-primary">৳ {product.price}</div>
                {product.originalPrice && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="line-through">৳ {product.originalPrice}</span>
                        <span>-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-4">
                <button 
                    className="flex-1 bg-secondary hover:bg-cyan-600 text-white py-3 rounded font-bold transition-colors"
                    onClick={() => {
                        onAddToCart(product);
                        // Optional: Navigate to cart or show toast
                    }}
                >
                    Buy Now
                </button>
                <button 
                    className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded font-bold transition-colors"
                    onClick={() => onAddToCart(product)}
                >
                    Add to Cart
                </button>
            </div>
            
            {/* Delivery Info Mockup */}
            <div className="mt-8 bg-gray-50 p-4 rounded space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <span>Dhaka, Bangladesh</span>
                    <span className="text-secondary ml-auto cursor-pointer">CHANGE</span>
                </div>
                <div className="flex items-center gap-3">
                    <Truck size={18} />
                    <div>
                        <div className="font-medium text-gray-800">Standard Delivery</div>
                        <div className="text-xs">3 - 5 Days</div>
                    </div>
                    <span className="font-bold text-gray-800 ml-auto">৳ 60</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} />
                    <div>
                        <div className="font-medium text-gray-800">7 Days Returns</div>
                        <div className="text-xs">Change of mind is not applicable</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Product Details</h3>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
              {product.description}
          </p>
      </div>
    </div>
  );
};

export default ProductDetails;