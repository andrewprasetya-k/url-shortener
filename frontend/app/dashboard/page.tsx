'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, Link2, TrendingUp, ChartLine, Calendar, Check, MousePointerClick, ArrowRight, ArrowLeft } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import ConfirmModal from '../components/ConfirmModal';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent } from '../components/Card';
import LoadingScreen from '../components/LoadingScreen';
import { getApiUrl, getShortUrl, fetchWithAuth } from '../../lib/api-config';
import { QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

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
  }, [router, page, itemsPerPage, totalItems]);


  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(getApiUrl(`my-urls?page=${page}&limit=5`));
      
      if (!res.ok) {
        // The auth wrapper handles 401, so we only need to handle other errors.
        throw new Error("Failed to fetch links");
      }
      const data = await res.json();
      setLinks(data.data);
      setTotalItems(data.total); // Set total dari backend
    } catch (err: any) {
      toast.error(err.message || "An error occurred while fetching links");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newOriginalUrl) return;
    setIsSubmitting(true);
    try {
      if (newCustomShortenedLink && !/^[a-zA-Z0-9-_]+$/.test(newCustomShortenedLink)) {
        toast.error('Custom url can only contain alphanumeric characters, hyphens, and underscores');
        return;
      }
      const res = await fetchWithAuth(getApiUrl(), {
        method: 'POST',
        body: JSON.stringify({
          customShortLink: newCustomShortenedLink,
          urlName: newUrlName,
          originalUrl: newOriginalUrl
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to create short link' }));
        throw new Error(errorData.message);
      }
      toast.success('Short link created successfully!');
      setNewOriginalUrl("");
      setNewUrlName("");
      setNewCustomShortenedLink("");
      fetchLinks(); // Refetch to show the new link
    } catch (error: any) {
      const errorMessage = Array.isArray(error.message) ? error.message.join(', ') : error.message;
      toast.error(errorMessage || "Failed to create short link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetchWithAuth(getApiUrl(id), { method: 'DELETE' });
      if (!res.ok) {
        throw new Error("Failed to delete link");
      }
      toast.success('Link deleted successfully!');
      setDeleteModal(false);
      setLinkToDelete(null);
      fetchLinks(); // Refetch to update the list
    } catch (error: any) {
      toast.error(error.message || "Failed to delete link");
    }
  };

  const downloadQRCode = (linkId: string, shortUrl: string) => {
    const svg = document.getElementById(`qr-code-${linkId}`);
    if (!svg) {
      toast.error("QR Code element not found.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Could not create canvas context.");
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${shortUrl}-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR Code downloaded!");
    };
    img.onerror = () => {
      toast.error("Failed to load QR code image for download.");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyToClipboard = (id: string, text: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
    navigator.clipboard.writeText(getShortUrl(text));
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
    <div className="min-h-screen animate-fade-in">
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
            <div className="flex flex-col">
              {/* Top Section: Info + QR Code */}
              <div className="flex justify-between items-stretch gap-6">
                {/* Left: Info */}
                <div className="grow">
                  {link.urlName ? (
                    <div className="flex-1 p-2 sm:mb-0">
                      <span className="truncate font-semibold text-2xl sm:text-3xl text-gray-900">
                        {link.urlName}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex-1 pl-2 mt-2 sm:mb-0">
                    <a
                      href={getShortUrl(link.shortenedUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 max-w-xs truncate text-lg sm:text-xl font-medium"
                    >
                      {getShortUrl(link.shortenedUrl)}
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
                </div>
                {/* Right: QR Code */}
                <div className="w-32 shrink-0">
                  <QRCode
                    id={`qr-code-${link._id}`}
                    value={getShortUrl(link.shortenedUrl)}
                    style={{ height: "auto", maxWidth: "100%", width: "100%", paddingTop: "10px" }}
                  />
                </div>
              </div>

              {/* Bottom Section: Stats and Buttons */}
              <div className="flex justify-between items-end mt-2">
                {/* Left Group: Stats + Buttons */}
                <div>
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
                  <div className="flex items-center gap-2 mt-2">
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
                </div>
                {/* Right Group: Download Button */}
                <div className="w-32 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQRCode(link._id, link.shortenedUrl)}
                    title="Download QR Code"
                    className="w-full"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
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