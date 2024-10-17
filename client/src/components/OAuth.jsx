import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export default function OAuth() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/googlelogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoUrl: result.user.photoURL
        })
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Server response:', errorData);
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData}`);
      }

      const data = await res.json();
      dispatch(signInSuccess(data));
    } catch (error) {
      console.error('Could not login with Google', error);
      setError(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="submit"
        onClick={handleGoogleClick}
        className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 max-w-full"
      >
        Continue with Google
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}