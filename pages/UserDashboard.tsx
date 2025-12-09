import React from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

interface Props {
  user: User;
}

const UserDashboard: React.FC<Props> = ({ user }) => {
  const orders = StorageService.getOrders(user.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-4 rounded-lg shadow-sm h-fit">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-gray-500">
                    {user.name.charAt(0)}
                </div>
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
                <li className="font-bold text-primary">My Orders</li>
                <li className="hover:text-primary cursor-pointer">My Returns</li>
                <li className="hover:text-primary cursor-pointer">My Cancellations</li>
                <li className="hover:text-primary cursor-pointer">My Reviews</li>
                <li className="hover:text-primary cursor-pointer">Address Book</li>
            </ul>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
            {orders.length === 0 ? (
                 <div className="bg-white p-10 text-center rounded text-gray-500">You have no orders yet.</div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 p-4">
                            <div className="flex justify-between border-b pb-2 mb-2 text-sm">
                                <div>
                                    <span className="text-gray-500">Order #</span> <span className="font-medium">{order.id}</span>
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className="uppercase font-bold text-primary text-xs tracking-wider">{order.status}</div>
                            </div>
                            <div className="space-y-3">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.image} className="w-16 h-16 object-cover rounded bg-gray-100" alt=""/>
                                        <div>
                                            <div className="font-medium text-gray-800">{item.title}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <div className="mt-4 pt-2 border-t flex justify-between items-center">
                                 <span className="text-gray-500 text-sm">Total Paid</span>
                                 <span className="font-bold text-lg text-gray-800">৳ {order.total}</span>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default UserDashboard;