import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fleet-watch.onrender.com/api/forgot-password', { email });
      
      Swal.fire({
        title: 'Email Sent!',
        text: 'Please check your inbox for the reset link.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ title: 'Error!', text: 'Email not found', icon: 'error' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md">
        <h2 className="text-white text-2xl mb-4">Forgot Password</h2>
        <input 
          type="email" 
          placeholder="Enter your registered email"
          className="p-2 w-full rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-cyan-500 text-white p-2 w-full rounded hover:bg-cyan-600">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;