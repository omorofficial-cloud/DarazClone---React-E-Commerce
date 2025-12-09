import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isSignup = params.get('mode') === 'signup';
  
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'seller'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Simulate Auth
    const user = StorageService.login(role, name);
    onLogin(user);
    
    if (user.role === 'seller') {
        navigate('/seller');
    } else {
        navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {isSignup ? `Welcome to DarazClone!` : `Welcome Back!`}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full border rounded p-2 focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Enter your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="role" 
                                checked={role === 'user'} 
                                onChange={() => setRole('user')}
                                className="accent-primary"
                            />
                            <span>Customer</span>
                        </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="role" 
                                checked={role === 'seller'} 
                                onChange={() => setRole('seller')}
                                className="accent-primary"
                            />
                            <span>Seller / Vendor</span>
                        </label>
                    </div>
                </div>

                <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-2 rounded mt-4 transition-colors">
                    {isSignup ? 'Create Account' : 'Login'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                {isSignup ? "Already have an account? " : "New to DarazClone? "}
                <button 
                    onClick={() => navigate(isSignup ? '/login' : '/login?mode=signup')}
                    className="text-primary hover:underline font-medium"
                >
                    {isSignup ? 'Login' : 'Sign Up'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AuthPage;