import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, User, Order } from '../types';
import { StorageService } from '../services/storage';

interface Props {
  cart: CartItem[];
  user: User;
  onClearCart: () => void;
}

const Checkout: React.FC<Props> = ({ cart, user, onClearCart }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + 60; // Shipping

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        const order: Order = {
            id: `ORD-${Date.now()}`,
            userId: user.id,
            items: cart,
            total: total,
            status: 'pending',
            date: new Date().toISOString(),
            paymentMethod
        };
        StorageService.createOrder(order);
        onClearCart();
        setLoading(false);
        navigate('/user'); // Go to order history
    }, 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
             {/* Address Placeholder */}
             <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h3 className="font-bold text-gray-700 mb-4">Shipping Address</h3>
                 <div className="p-4 bg-blue-50 border border-blue-100 rounded text-sm text-gray-700">
                     <p className="font-bold">{user.name}</p>
                     <p>House 12, Road 5, Dhanmondi</p>
                     <p>Dhaka, Bangladesh</p>
                     <p className="mt-2 text-gray-500 text-xs uppercase font-bold tracking-wide badge bg-white px-2 py-1 inline-block rounded border">Home</p>
                 </div>
             </div>

             {/* Payment Method */}
             <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h3 className="font-bold text-gray-700 mb-4">Select Payment Method</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div 
                        className={`border rounded p-4 cursor-pointer flex items-center gap-2 ${paymentMethod === 'cod' ? 'border-primary bg-orange-50' : 'hover:border-gray-300'}`}
                        onClick={() => setPaymentMethod('cod')}
                     >
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-gray-400'}`}>
                             {paymentMethod === 'cod' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                         </div>
                         <span className="font-medium">Cash on Delivery</span>
                     </div>
                     <div 
                        className={`border rounded p-4 cursor-pointer flex items-center gap-2 ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50' : 'hover:border-gray-300'}`}
                        onClick={() => setPaymentMethod('bkash')}
                     >
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'bkash' ? 'border-pink-500' : 'border-gray-400'}`}>
                             {paymentMethod === 'bkash' && <div className="w-2 h-2 bg-pink-500 rounded-full"></div>}
                         </div>
                         <span className="font-medium text-pink-600">Bkash</span>
                     </div>
                      <div 
                        className={`border rounded p-4 cursor-pointer flex items-center gap-2 ${paymentMethod === 'nagad' ? 'border-orange-600 bg-orange-50' : 'hover:border-gray-300'}`}
                        onClick={() => setPaymentMethod('nagad')}
                     >
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'nagad' ? 'border-orange-600' : 'border-gray-400'}`}>
                             {paymentMethod === 'nagad' && <div className="w-2 h-2 bg-orange-600 rounded-full"></div>}
                         </div>
                         <span className="font-medium text-orange-700">Nagad</span>
                     </div>
                 </div>
             </div>
        </div>

        <div className="w-full md:w-80">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between"><span>Items Total</span><span>৳ {subtotal}</span></div>
                    <div className="flex justify-between"><span>Delivery Fee</span><span>৳ 60</span></div>
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total Payment</span><span className="text-primary">৳ {total}</span></div>
                </div>
                <button 
                    onClick={handlePlaceOrder} 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded uppercase text-sm disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default Checkout;