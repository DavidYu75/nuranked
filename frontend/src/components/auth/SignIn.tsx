import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../services/auth';

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(formData.email, formData.password);
      router.push('/'); // Redirect to home page after successful login
    } catch (err: unknown) {
      console.error('Login error:', err);
      const apiError = err as ApiError;
      setError(apiError.response?.data?.detail || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400 text-black"
          placeholder="you@northeastern.edu"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400 text-black"
          placeholder="enter a password"
        />
      </div>

      {error && (
        <div className="p-2 text-sm text-red-600 border border-red-600 bg-red-50">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
} 