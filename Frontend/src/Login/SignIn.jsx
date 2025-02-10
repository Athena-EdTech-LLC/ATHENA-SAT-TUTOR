import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { use } from 'react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    try{
      const response = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure your backend can handle JSON
        },
        credentials:"include", 
        body: JSON.stringify(formData), // Send the input data in the request body
      });
      if (response.ok){
        console.log("ok response");
        const data = await response.json(); // Parse JSON response
        console.log(data); // Log the response for debugging
        if (data.emailExist) {
          if (data.userFound) {
            console.log('Login successful!');
            navigate('/home');
          } else {
            setError('Incorrect password.');
          }
        } else {
          setError('Email not found.');
        }
      } 
      else {
        setError('Server error. Please try again later.');
      }
    } 
    catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Please sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm text-emerald-500 hover:text-emerald-700">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={()=>navigate('/register')} type="button" className=" text-emerald-500 hover:text-emerald-700">
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
// onClick={() => navigate('/signup')} 