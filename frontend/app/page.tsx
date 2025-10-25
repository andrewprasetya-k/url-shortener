'use client';

import { useEffect, useState } from 'react';

interface ShortLink {
  _id: string;
  originalUrl: string;
  shortenedUrl: string;
  createdAt: string;
}

export default function Home() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
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

    const handleDelete = async (id:string) =>{
    try {
        const res = await fetch(`http://localhost:3000/${id}`,{
            method:'DELETE'})
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

    const deleteClicked = (id: string) => {
        setDeletedId(id);
        setTimeout(() => setDeletedId(null), 2000); // reset after 2 detik;
        handleDelete(id);
        fetchLinks();
    }
  
    const copyToClipboard = (id: string,text: string) => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000); // reset after 2 detik;
        navigator.clipboard.writeText(`http://localhost:3000/${text}`);
    };
    
    if (loading) return <p className="p-6 text-gray-500">Memuat data link...</p>;
    if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
    console.log(links);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Shortlink</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="url"
          placeholder="Masukkan URL asli..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 border rounded-full p-2 pl-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
        >
          Shorten
        </button>
      </form>
      {links.length === 0 ? (
        <p className="text-gray-500">Belum ada link yang dibuat.</p>
      ) : (
        <table className="w-full border-gray-300 rounded-full">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-2 bg-gray-300 rounded-l-full">Asli</th>
              <th className="p-2 bg-gray-300">Pendek</th>
              <th className="p-2 bg-gray-300">Tanggal</th>
              <th className="p-2 bg-gray-300 rounded-r-full" colSpan={2}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
            <tr key={link._id || link.shortenedUrl}>
                <td className="p-2 truncate max-w-[200px] text-blue-600 underline">               
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                    {link.originalUrl}
                </a></td>
                <td className="p-2 text-blue-600 underline">
                <a href={`http://localhost:3000/${link.shortenedUrl}`} target="_blank" rel="noopener noreferrer">
                    {`http://localhost:3000/${link.shortenedUrl}`}
                </a>
                </td>
                <td className="p-2 text-gray-500">
                {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-center">
                {copiedId === link._id ? (
                <span className="text-green-500">Copied!</span>
                ) : (
                <button
                    onClick={() => copyToClipboard(link._id, link.shortenedUrl)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                    Copy
                </button>
                )}
                </td>
                <td className="p-2 text-center">
                <button
                    onClick={() => deleteClicked(link.shortenedUrl)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                    Delete
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

