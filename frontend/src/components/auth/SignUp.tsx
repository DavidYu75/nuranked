import React, { useState } from 'react';
import { registerUser, ProfileCreate } from '../../services/auth';

// Basic initial form state to meet backend requirements
const initialFormState: ProfileCreate = {
  name: '',
  email: '',
  password: '',
  photo_url: 'https://randomuser.me/api/portraits/lego/1.jpg', // Default placeholder
  experiences: [],
  education: {
    degree: 'Bachelor',
    major: 'Computer Science',
    graduation_year: new Date().getFullYear() + 1
  },
  linkedin_url: '',
  github_url: ''
};

interface SignUpProps {
  toggleForm: () => void;
}

export default function SignUp({ toggleForm }: SignUpProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate basic info
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }
    
    // Check if email is northeastern email
    if (!formData.email.endsWith('@northeastern.edu')) {
      setError('Please use your Northeastern email address.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await registerUser(formData);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to register. Please try again.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 text-green-600 font-medium">Registration successful!</div>
        <p className="mb-4 text-black">
          We&apos;ve sent a verification email to <strong>{formData.email}</strong>.
          Please check your inbox and verify your email address.
        </p>
        <button
          onClick={toggleForm}
          className="w-full py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400 text-black"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
          Northeastern Email
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

      <div className="text-sm text-black mt-4 mb-2 border border-gray-200 p-2 bg-gray-50">
        <p>You can update your profile information (photo, education, experiences, etc.) after signing up.</p>
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
        {loading ? 'Processing...' : 'Sign Up'}
      </button>
    </form>
  );
} 