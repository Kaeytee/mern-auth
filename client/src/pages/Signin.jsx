import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle different HTTP error codes for more specific messages
        if (res.status === 400) {
          dispatch(signInFailure('Please fill in both email and password.'));
        } else if (res.status === 401) {
          dispatch(signInFailure('Invalid email or password.'));
        } else {
          dispatch(signInFailure('Something went wrong. Please try again.'));
        }
        return;
      }

      // Successful sign-in
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error('Network error:', error);
      dispatch(signInFailure('Network error, please check your connection.'));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <OAuth/>
      </form>

      <div className="flex gap-2 mt-5">
        <span>Don&apos;t have an account?</span>
        <Link to="/sign-up" className="text-blue-500 underline">
          Sign Up
        </Link>
      </div>

      {error && <div className="mt-4 text-red-500 ">{error}</div>}
    </div>
  );
}