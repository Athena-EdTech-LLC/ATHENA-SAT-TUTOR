import React, { useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(false);
  const [createStatus, setCreateStatus] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(false); 
  setCreateStatus(false); 

  if (formData.password !== formData.confirmPassword) {
    setPasswordMatch(false);
    return;
  }
  
  setPasswordMatch(true); 
  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    if (response.ok) {
      setCreateStatus(true); 
      console.log('User registration successful');
    } else {
      // Handle server-side validation errors
      const errorData = await response.json();
      setError(errorData.message || 'Error registering user');
    }
  } catch (err) {
    console.error('Error:', err);
    setError('An unexpected error occurred. Please try again.');
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {'Please fill in your details'}
          </p>
        </div>

{!passwordMatch ? (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
  >
    <p>Passwords do not match.</p>
  </div>
) : (
  <div></div>
)}
{
  createStatus && (
    <div
      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
    >
      <p>{"Account created successfully."}</p>
    </div>
  )
}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Create a Username"
              />
            </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              <span>Email address</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your password"
            />
          </div>

          
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                <span>Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Confirm your password"
              />
            </div>
          

    
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            {"Already have an account?"}{' '}
            <button
              type="button"
              onClick={()=>navigate('/')}
              className="text-emerald-500 hover:text-emerald-600"
            >
              {'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;