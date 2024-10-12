import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/sign-in';
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className='bg-slate-200'>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <a href="/" onClick={(e) => handleNavigation(e, '/')}>
          <h1 className='font-bold'>Auth App</h1>
        </a>
        <ul className='flex gap-4 items-center'>
          <li>
            <a href="/" onClick={(e) => handleNavigation(e, '/')}>Home</a>
          </li>
          <li>
            <a href="/about" onClick={(e) => handleNavigation(e, '/about')}>About</a>
          </li>
          {isLoggedIn ? (
            <li>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <a href="/sign-in" onClick={(e) => handleNavigation(e, '/sign-in')}>Sign In</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}