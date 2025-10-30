'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, Link2, TrendingUp, ChartLine, Calendar, Check, MousePointerClick, ArrowRight, ArrowLeft } from 'lucide-react';
import React from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent } from '../components/Card';
import LoadingScreen from '../components/LoadingScreen';

interface ShortLink {
  _id: string;
  urlName?:string;
  originalUrl: string;
  shortenedUrl: string;
  timesClicked: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOriginalUrl, setNewOriginalUrl] = useState('');
  const [newUrlName, setNewUrlName] = useState('');
  const [newCustomShortenedLink, setNewCustomShortenedLink] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'clicks'>('date');
  const [deleteModal, setDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5); // 5 items per page
  const [totalItems, setTotalItems] = useState(0); // Total dari backend

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchLinks();
  }, [router, page]);

  // Helper function untuk refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const res = await fetch('http://localhost:3000/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        return true; // Berhasil refresh
      }
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  };

  const fetchLinks = async () => {
    try {
      setError('');
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Not authenticated. Please login.');
        setLoading(false);
        return;
      }
      
      const res = await fetch(`http://localhost:3000/my-urls?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          // Coba refresh token dulu
          const refreshed = await refreshAccessToken();
          
          if (refreshed) {
            // Token berhasil di-refresh, retry request
            return fetchLinks();
          } else {
            // Refresh token gagal atau expired, logout
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            document.cookie = 'access_token=; path=/; max-age=0';
            router.push('/login');
            return;
          }
        }
        throw new Error("Failed to fetch links");
      }
      const data = await res.json();
      setLinks(data.data);
      setTotalItems(data.total); // Set total dari backend
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
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Not authenticated. Please login.');
        return;
      }

      if(newCustomShortenedLink && !/^[a-zA-Z0-9-_]+$/.test(newCustomShortenedLink)) {
        setError('Custom url can only contain alphanumeric characters, hyphens, and underscores');
        return;
      }
      
      const res = await fetch("http://localhost:3000/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customShortLink: newCustomShortenedLink,
          urlName: newUrlName,
          originalUrl: newOriginalUrl
        })
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          // Coba refresh token
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            // Retry submit
            return handleSubmit();
          } else {
            localStorage.clear();
            router.push('/login');
            return;
          }
        }
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create short link");
      }
      
      setNewOriginalUrl("");
      setNewUrlName("");
      setNewCustomShortenedLink("");
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
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Not authenticated. Please login.');
        return;
      }
      
      const res = await fetch(`http://localhost:3000/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          // Coba refresh token
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            // Retry delete
            return handleDelete(id);
          } else {
            localStorage.clear();
            router.push('/login');
            return;
          }
        }
        throw new Error("Failed to delete link");
      }
      setDeleteModal(false);
      setLinkToDelete(null);
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

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
      <LoadingScreen/>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto mt-10">
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Create New Short Link</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter a memorable title..."
                  value={newUrlName}
                  onChange={(e) => setNewUrlName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/your-long-url"
                  value={newOriginalUrl}
                  onChange={(e) => setNewOriginalUrl(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Short Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="my-custom-link"
                  value={newCustomShortenedLink}
                  onChange={(e) => setNewCustomShortenedLink(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Only alphanumeric characters, hyphens, and underscores allowed
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md text-red-700 px-4 py-3 animate-slide-in-bottom">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!newOriginalUrl}
                isLoading={isSubmitting}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link2 className="w-5 h-5" />
                Shorten URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {links.length > 0 && (
          <Card className="mb-4">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'clicks')}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="date">Sort by Date</option>
                  <option value="clicks">Sort by Clicks</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state when there are no links at all */}
        {links.length === 0 && (
          <Card className="text-center animate-fade-in">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4">
                <MousePointerClick className="w-16 h-16 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">No short links yet</h3>
                <p className="text-gray-600">Create your first short link using the form above.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* If there are links but the current filter yields no results */}
        {links.length > 0 && filteredLinks.length === 0 && (
          <Card className="text-center animate-fade-in">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-3">
                <TrendingUp className="w-12 h-12 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-800">No matching links</h4>
                <p className="text-sm text-gray-500">Try a different search or clear filters to see all links.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List of filtered links */}
        {filteredLinks.length > 0 && filteredLinks.map((link, index) => (
          <Card 
            key={link._id} 
            className="mb-4 p-4" 
            style={{ animationDelay: `${index * 0.05}s` }}
          >
        {link.urlName ? (
          <div className="flex-1 p-2 sm:mb-0">
            <span className="truncate font-semibold text-2xl sm:text-3xl text-gray-900">
          {link.urlName}
            </span>
          </div>
        ) : null}
        <div className="flex-1 pl-2 mt-2 sm:mb-0">
          <a
            href={`http://localhost:3000/${link.shortenedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 max-w-xs truncate text-lg sm:text-xl font-medium"
          >
            {`http://localhost:3000/${link.shortenedUrl}`}
          </a>
        </div>
        <div className="flex-1 pl-2 mt-2 sm:mb-0">
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-800 hover:underline flex items-center gap-2 max-w-xs truncate text-sm sm:text-base"
          >
            <span className="truncate">{link.originalUrl}</span>
          </a>
        </div>
        <div className="my-2 sm:mb-0 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 bg-gray-50 rounded">
            <ChartLine className="w-4 h-4 mr-2" />
            <span className="text-sm">{link.timesClicked} Clicks</span>
          </span>
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-50 rounded">
            <Calendar className="w-4 h-4 mx-2" />
            <span className="text-xs text-gray-500">
              {new Date(link.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mb-0">
          {copiedId === link._id ? (
            <Button
              variant="success"
              size="sm"
              disabled
              className="animate-bounce-in"
            >
              <Check className="w-4 h-4" />
              Copied!
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(link._id, link.shortenedUrl)}
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setLinkToDelete(link.shortenedUrl);
              setDeleteModal(true);
            }}
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </Card>
      ))}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-4 justify-center items-center mt-8 mb-6 animate-fade-in">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => {
              setPage(prev => prev - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Previous page"
          >
            <ArrowLeft size={18} />
          </Button>
          
          <span className="text-sm font-medium text-gray-700 px-4">
            Page <span className="text-blue-600">{page}</span> of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => {
              setPage(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Next page"
          >
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
      
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus link ini?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          if (linkToDelete) {
            handleDelete(linkToDelete);
          }
        }}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}