'use client';

import { useState, useEffect } from "react";

export default function Topbar({title}:{title:string}) {
  const [usernameShow, setUsernameShow] = useState<string>('');

  const getMe = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUsernameShow('');
        return;
      }
      const response = await fetch('http://localhost:3000/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        setUsernameShow('');
        return;
      }

      const data = await response.json();
      setUsernameShow(data?.username ?? '');
    } catch (error) {
      console.error('Failed to fetch user data', error);
      setUsernameShow('');
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <header className="w-full p-6 fixed z-10 bg-white">
        <h1 className="text-xl font-bold text-gray-700">{title}</h1>
        <h2 className="text-gray-500 font-light">{usernameShow ? `${usernameShow}` : 'Not signed in'}</h2>
    </header>
  );
}
