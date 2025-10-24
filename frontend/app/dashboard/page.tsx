'use client';

import { useEffect, useState } from 'react';

interface ShortLink {
  id: string;
  originalUrl: string;
  shortenedUrl: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUrl, setNewUrl] = useState('');


  const fetchLinks = async () => {
    try {
      const res = await fetch("http://localhost:3000/"); // sesuaikan endpoint
      if (!res.ok) throw new Error("Gagal mengambil data link");
      const data = await res.json();
      setLinks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () =>{
    try {
        const res = await fetch("http://localhost:3000/",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                originalUrl:newUrl
            })
        })
        if (!res.ok){
            console.log(res.text());
            throw new Error("Gagal menambahkan link");
        }
        setNewUrl(""); // reset input
        fetchLinks(); // refresh data
    } catch (error:any) {
        setError(error.message);
    }finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  
  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(`http://localhost:3000/${text}`);
      alert('Link disalin ke clipboard!');
    };
    
    if (loading) return <p className="p-6 text-gray-500">Memuat data link...</p>;
    if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
    console.log(links);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard Shortlink</h1>

      {links.length === 0 ? (
        <p className="text-gray-500">Belum ada link yang dibuat.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-red-500">
            <tr>
              <th className="text-left p-2">Asli</th>
              <th className="text-left p-2">Pendek</th>
              <th className="text-left p-2">Tanggal</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
            <tr key={link.id || link.shortenedUrl} className="border-t">
                <td className="p-2 truncate max-w-[200px]">               
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                    {link.originalUrl}
                </a></td>
                <td className="p-2 text-blue-600 underline">
                <a href={`http://localhost:3000/${link.shortenedUrl}`} target="_blank" rel="noopener noreferrer">
                    {link.shortenedUrl}
                </a>
                </td>
                <td className="p-2 text-gray-500">
                {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-center">
                <button
                    onClick={() => copyToClipboard(link.shortenedUrl)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Copy
                </button>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
