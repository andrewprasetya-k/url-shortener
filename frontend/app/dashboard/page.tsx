'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, ExternalLink, Link2, TrendingUp, ChartLine, Calendar, Check, MousePointerClick } from 'lucide-react';
import React from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { link } from 'fs';

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

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchLinks();
  }, [router]);

  const fetchLinks = async () => {
    try {
      setError('');
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Not authenticated. Please login.');
        setLoading(false);
        return;
      }
      
      const res = await fetch("http://localhost:3000/my-urls", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          document.cookie = 'access_token=; path=/; max-age=0';
          router.push('/login');
          return;
        }
        throw new Error("Failed to fetch links");
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-white p-6 mb-8 border border-gray-200 rounded-md">
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
              className="w-full px-4 py-3 my-4 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <h3>Enter your url here</h3>
            <input
              type="url"
              placeholder="Enter your long URL here..."
              value={newOriginalUrl}
              onChange={(e) => setNewOriginalUrl(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-3 my-4 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
            <h3>Enter your custom shortened url (Optional)</h3>
            <input
              type="text"
              placeholder="Enter custom shortened URL (no spaces or special characters, only alphanumeric, hyphens, and underscores) here..."
              value={newCustomShortenedLink}
              onChange={(e) => setNewCustomShortenedLink(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-3 my-4 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md text-red-700 px-4 py-3">
            {error}
          </div>
        )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !newOriginalUrl}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <div className="bg-white p-6 mb-4 border border-gray-200 rounded-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'clicks')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="clicks">Sort by Clicks</option>
          </select>
        </div>
          </div>
        )}

        {/* Empty state when there are no links at all */}
        {links.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <MousePointerClick className="w-12 h-12 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">No short links yet</h3>
          <p className="text-gray-600">Create your first short link using the form above.</p>
        </div>
          </div>
        )}

        {/* If there are links but the current filter yields no results */}
        {links.length > 0 && filteredLinks.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <TrendingUp className="w-10 h-10 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-800">No matching links</h4>
          <p className="text-sm text-gray-500">Try a different search or clear filters to see all links.</p>
        </div>
          </div>
        )}

        {/* List of filtered links */}
        {filteredLinks.length > 0 && filteredLinks.map(link => (
          <div key={link._id} className="bg-white border border-gray-200 p-4 mb-4 flex flex-col sm:justify-between rounded-md">
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
            <button
              disabled
              className="flex items-center gap-2 p-2 text-green-600 bg-green-50 rounded"
              title="Copied"
              aria-label="Link copied"
            >
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium text-green-600">Copied!</span>
            </button>
          ) : (
            <button
              onClick={() => copyToClipboard(link._id, link.shortenedUrl)}
              className="flex cursor-pointer items-center gap-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded"
              title="Copy to clipboard"
              aria-label="Copy shortened URL to clipboard"
            >
              <Copy className="w-5 h-5" />
              <span className="text-sm">Copy</span>
            </button>
          )}
          <button
            onClick={() => setDeleteModal(true)}
            className="cursor-pointer flex items-center gap-2 p-2 text-red-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
            title="Delete link"
            aria-label="Delete shortened URL"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>
        ))}
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