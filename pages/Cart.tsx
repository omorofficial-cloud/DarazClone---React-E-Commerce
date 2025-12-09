import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface Props {
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const Cart: React.FC<Props> = ({ cart, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 60; // Flat rate for demo
  const total = subtotal + (cart.length > 0 ? shipping : 0);

  if (cart.length === 0) {
    return (
      <div className="bg-white p-10 text-center rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-600 mb-4">Your Cart is Empty</h2>
        <Link to="/" className="inline-block bg-primary text-white px-6 py-2 rounded font-medium">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500 uppercase font-medium">
                <span>Product</span>
                <span>Quantity</span>
            </div>
            <div className="space-y-6">
                {cart.map(item => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2">{item.title}</h3>
                            <div className="text-sm text-gray-500 mt-1">{item.category}</div>
                            <div className="text-primary font-bold mt-1">৳ {item.price}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <div className="flex items-center gap-2">
                                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Minus size={16}/></button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Plus size={16}/></button>
                             </div>
                             <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="w-full md:w-80">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-24">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                      <span>Subtotal ({cart.length} items)</span>
                      <span>৳ {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span>৳ {shipping}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-base pt-4 border-t mt-4">
                      <span>Total</span>
                      <span>৳ {total}</span>
                  </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded mt-6 uppercase text-sm"
              >
                  Proceed to Checkout
              </button>
          </div>
      </div>
    </div>
  );
};

export default Cart;