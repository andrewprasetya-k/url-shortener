'use client';

import { useEffect, useState } from 'react';
import { Copy, Trash2, ExternalLink, Link2, TrendingUp, Calendar, MousePointerClick } from 'lucide-react';

interface ShortLink {
  _id: string;
  originalUrl: string;
  shortenedUrl: string;
  timesClicked: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUrl, setNewUrl] = useState('');
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
    if (!newUrl) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch("http://localhost:3000/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalUrl: newUrl
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create short link");
      }
      
      setNewUrl("");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">URL Shortener</h1>
          <p className="text-gray-600">Create and manage your short links</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Links</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalLinks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Link2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalClicks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Short Link</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !newUrl}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
          </div>
        </div>

        {links.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'clicks')}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="clicks">Sort by Clicks</option>
              </select>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-16">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No links found matching your search' : 'No links yet. Create your first short link!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4" />
                        Clicks
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <a 
                          href={link.originalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 max-w-xs truncate"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{link.originalUrl}</span>
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`http://localhost:3000/${link.shortenedUrl}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                        >
                          {link.shortenedUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(link.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {link.timesClicked}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {copiedId === link._id ? (
                            <span className="text-green-600 text-sm font-medium">Copied!</span>
                          ) : (
                            <button
                              onClick={() => copyToClipboard(link._id, link.shortenedUrl)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(link.shortenedUrl)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete link"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}