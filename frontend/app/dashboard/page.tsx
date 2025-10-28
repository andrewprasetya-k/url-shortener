'use client';

import { useEffect, useState } from 'react';
import { Copy, Trash2, ExternalLink, Link2, TrendingUp, Calendar, MousePointerClick } from 'lucide-react';
import { url } from 'inspector';

interface ShortLink {
  _id: string;
  urlName?:string;
  originalUrl: string;
  shortenedUrl: string;
  timesClicked: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOriginalUrl, setNewOriginalUrl] = useState('');
  const [newUrlName, setNewUrlName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'clicks'>('date');

  const fetchLinks = async () => {
    try {
      setError('');
      const res = await fetch("http://localhost:3000/");
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      setLinks(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching links");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newOriginalUrl) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch("http://localhost:3000/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urlName: newUrlName,
          originalUrl: newOriginalUrl
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create short link");
      }
      
      setNewOriginalUrl("");
      await fetchLinks();
    } catch (error: any) {
      setError(error.message || "Failed to create short link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError('');
      const res = await fetch(`http://localhost:3000/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete link");
      }
      
      await fetchLinks();
    } catch (error: any) {
      setError(error.message || "Failed to delete link");
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    navigator.clipboard.writeText(`http://localhost:3000/${text}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const filteredLinks = links
    .filter(link => 
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortenedUrl.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'clicks') {
        return b.timesClicked - a.timesClicked;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalClicks = links.reduce((sum, link) => sum + link.timesClicked, 0);
  const totalLinks = links.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-40 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">URL Shortener</h1>
          <p className="text-gray-600">Create and manage your short links</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Links</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalLinks}</p>
              </div>
              <div className="bg-blue-100 p-3">
                <Link2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalClicks}</p>
              </div>
              <div className="bg-green-100 p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 mb-8 border border-gray-100 border-dashed">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">Create New Short Link</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <h3>Place your link title (Optional)</h3>
                <input
                  type="text"
                  placeholder="Place your title here..."
                  value={newUrlName}
                  onChange={(e) => setNewUrlName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 my-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
                <h3>Enter your url here</h3>
                <input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={newOriginalUrl}
                  onChange={(e) => setNewOriginalUrl(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 my-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                {error}
              </div>
            )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !newOriginalUrl}
                className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Link2 className="w-5 h-5" />
                    Shorten URL
                  </>
                )}
              </button>
          </div>
        </div>

        {links.length > 0 && (
          <div className="bg-white p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'clicks')}
                className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="clicks">Sort by Clicks</option>
              </select>
            </div>
          </div>
        )}
        {filteredLinks.map(link => (
          <div key={link._id} className="bg-white border border-gray-100 p-4 mb-4 flex flex-col sm:justify-between">
            <div className="flex-1 p-2 my-4 bg-gray-300 mb-4 sm:mb-0">
              <h3>Original Url</h3>
              <a 
                href={link.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 max-w-xs truncate"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.originalUrl}</span>
              </a>
            </div>
            <div className="flex-1 p-2 my-4 bg-gray-300 mb-4 sm:mb-0">
              <h3>Shortened Url</h3>
              <a 
                href={`http://localhost:3000/${link.shortenedUrl}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-mono text-sm"
              >
                {`http://localhost:3000/${link.shortenedUrl}`}
              </a>
            </div>
            <div className="flex-1 p-2 my-4 bg-gray-300 mb-4 sm:mb-0">
              <h3>Date Added</h3>
              {new Date(link.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="my-2 sm:mb-0">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                {link.timesClicked}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {copiedId === link._id ? (
                <span className="text-green-600 text-sm font-medium">Copied!</span>
              ) : (
                <button
                  onClick={() => copyToClipboard(link._id, link.shortenedUrl)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleDelete(link.shortenedUrl)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete link"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}