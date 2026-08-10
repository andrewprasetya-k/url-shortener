"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Trash2,
  Link2,
  TrendingUp,
  ChartLine,
  Calendar,
  Check,
  MousePointerClick,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";
import { Button } from "../components/Button";
import { Card, CardHeader, CardContent } from "../components/Card";
import LoadingScreen from "../components/LoadingScreen";
import { getApiUrl, getShortUrl, fetchWithAuth } from "../../lib/api-config";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

interface ShortLink {
  _id: string;
  urlName?: string;
  originalUrl: string;
  shortenedUrl: string;
  timesClicked: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOriginalUrl, setNewOriginalUrl] = useState("");
  const [newUrlName, setNewUrlName] = useState("");
  const [newCustomShortenedLink, setNewCustomShortenedLink] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "clicks">("date");
  const [deleteModal, setDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5); // 5 items per page
  const [totalItems, setTotalItems] = useState(0); // Total dari backend

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchLinks();
  }, [router, page, itemsPerPage, totalItems]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        getApiUrl(`my-urls?page=${page}&limit=5`),
      );

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
      if (
        newCustomShortenedLink &&
        !/^[a-zA-Z0-9-_]+$/.test(newCustomShortenedLink)
      ) {
        toast.error(
          "Custom url can only contain alphanumeric characters, hyphens, and underscores",
        );
        return;
      }
      const res = await fetchWithAuth(getApiUrl(), {
        method: "POST",
        body: JSON.stringify({
          customShortLink: newCustomShortenedLink,
          urlName: newUrlName,
          originalUrl: newOriginalUrl,
        }),
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to create short link" }));
        throw new Error(errorData.message);
      }
      toast.success("Short link created successfully!");
      setNewOriginalUrl("");
      setNewUrlName("");
      setNewCustomShortenedLink("");
      fetchLinks(); // Refetch to show the new link
    } catch (error: any) {
      const errorMessage = Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message;
      toast.error(errorMessage || "Failed to create short link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetchWithAuth(getApiUrl(id), { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete link");
      }
      toast.success("Link deleted successfully!");
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
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit();
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredLinks = links
    .filter(
      (link) =>
        link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.shortenedUrl.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "clicks") {
        return b.timesClicked - a.timesClicked;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Create New Short Link
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Link Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter a memorable title..."
                  value={newUrlName}
                  onChange={(e) => setNewUrlName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Original URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/your-long-url"
                  value={newOriginalUrl}
                  onChange={(e) => setNewOriginalUrl(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Custom Short Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="my-custom-link"
                  value={newCustomShortenedLink}
                  onChange={(e) => setNewCustomShortenedLink(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  disabled={isSubmitting}
                />
                <p className="mt-1.5 text-xs text-gray-400">
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
                <Link2 className="w-4 h-4" />
                Shorten URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {links.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "clicks")}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
            >
              <option value="date">Sort by Date</option>
              <option value="clicks">Sort by Clicks</option>
            </select>
          </div>
        )}

        {/* Empty state when there are no links at all */}
        {links.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
            <MousePointerClick className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900">
              No short links yet
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Create your first short link using the form above.
            </p>
          </div>
        )}

        {/* If there are links but the current filter yields no results */}
        {links.length > 0 && filteredLinks.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
            <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900">
              No matching links
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Try a different search or clear filters to see all links.
            </p>
          </div>
        )}

        {/* List of filtered links */}
        {filteredLinks.length > 0 &&
          filteredLinks.map((link) => (
            <div
              key={link._id}
              className="mb-3 p-5 border border-gray-200 rounded-lg"
            >
              <div className="flex flex-col">
                {/* Top Section: Info + QR Code */}
                <div className="flex justify-between items-start gap-6">
                  {/* Left: Info */}
                  <div className="grow min-w-0">
                    {link.urlName ? (
                      <div className="font-medium text-lg text-gray-900 truncate">
                        {link.urlName}
                      </div>
                    ) : null}
                    <a
                      href={getShortUrl(link.shortenedUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-1 text-blue-600 hover:underline text-base font-medium truncate"
                    >
                      {getShortUrl(link.shortenedUrl)}
                    </a>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-1 text-gray-500 hover:underline text-sm truncate"
                    >
                      {link.originalUrl}
                    </a>
                  </div>
                  {/* Right: QR Code */}
                  <div className="w-20 shrink-0">
                    <QRCode
                      id={`qr-code-${link._id}`}
                      value={getShortUrl(link.shortenedUrl)}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Section: Stats and Buttons */}
                <div className="flex justify-between items-end mt-4">
                  {/* Left Group: Stats + Buttons */}
                  <div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <ChartLine className="w-3.5 h-3.5" />
                        {link.timesClicked} Clicks
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(link.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {copiedId === link._id ? (
                        <Button variant="success" size="sm" disabled>
                          <Check className="w-4 h-4" />
                          Copied!
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(link._id, link.shortenedUrl)
                          }
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQRCode(link._id, link.shortenedUrl)}
                    title="Download QR Code"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex gap-4 justify-center items-center mt-8 mb-6">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => {
                setPage((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Previous page"
            >
              <ArrowLeft size={16} />
            </Button>

            <span className="text-sm text-gray-500">
              Page <span className="text-gray-900 font-medium">{page}</span> of{" "}
              {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Next page"
            >
              <ArrowRight size={16} />
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
