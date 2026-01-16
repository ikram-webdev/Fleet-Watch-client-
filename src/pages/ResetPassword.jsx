import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://fleet-watch.onrender.com/api/reset-password/${token}`, { password });
      Swal.fire('Success', 'Password Reset Successfully!', 'success');
      navigate('/'); 
    } catch (err) {
      Swal.fire('Error', 'Link expired. Please request a new one.', 'error');
    }
  };

  return (
    <div className="main-bg h-screen flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-lg">
        <h2 className="text-2xl mb-4">Please create a new password</h2>
        <input 
          type="password" 
          placeholder="Enter New Password"
          className="w-full p-2 mb-4 text-black rounded"
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button className="bg-cyan-400 w-full py-2 rounded text-black font-bold">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;