import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { Product, User } from '../types';
import { Plus, Edit, Trash2, Package, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: User;
}

const SellerDashboard: React.FC<Props> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // In a real app, filter by sellerId
    setProducts(StorageService.getProducts().filter(p => p.sellerId === user.id));
  }, [user.id]);

  const handleDelete = (id: string) => {
    if(window.confirm("Are you sure?")) {
        StorageService.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const chartData = [
      {name: 'Jan', sales: 4000},
      {name: 'Feb', sales: 3000},
      {name: 'Mar', sales: 5000},
      {name: 'Apr', sales: 7500},
      {name: 'May', sales: 6000},
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
            <Link to="/seller/add" className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-orange-600">
                <Plus size={18} /> Add Product
            </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Package size={24}/></div>
                <div>
                    <div className="text-gray-500 text-sm">Total Products</div>
                    <div className="text-2xl font-bold">{products.length}</div>
                </div>
            </div>
             <div className="bg-white p-6 rounded shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign size={24}/></div>
                <div>
                    <div className="text-gray-500 text-sm">Revenue (Est)</div>
                    <div className="text-2xl font-bold">৳ 45,200</div>
                </div>
            </div>
             <div className="bg-white p-6 rounded shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><TrendingUp size={24}/></div>
                <div>
                    <div className="text-gray-500 text-sm">Orders</div>
                    <div className="text-2xl font-bold">12</div>
                </div>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4">Monthly Sales Performance</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#8884d8" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#f85606" barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="p-4 border-b font-bold text-gray-700">Product List</div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4"><img src={p.image} className="w-12 h-12 object-cover rounded border" alt=""/></td>
                                <td className="p-4 font-medium text-gray-800">{p.title}</td>
                                <td className="p-4">৳ {p.price}</td>
                                <td className="p-4 text-sm text-gray-500">{p.category}</td>
                                <td className="p-4 flex gap-3">
                                    <button className="text-blue-500 hover:text-blue-700"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <div className="p-8 text-center text-gray-500">No products added yet.</div>}
            </div>
        </div>
    </div>
  );
};

export default SellerDashboard;