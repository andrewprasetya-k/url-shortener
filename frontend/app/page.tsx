"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Link2 } from "lucide-react";
import { Button } from "./components/Button";
import { getApiUrl, getShortUrl } from "../lib/api-config";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [urlName, setUrlName] = useState("");
  const [customShortLink, setCustomShortLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!originalUrl) return;

    if (customShortLink && !/^[a-zA-Z0-9-_]+$/.test(customShortLink)) {
      toast.error(
        "Custom url can only contain alphanumeric characters, hyphens, and underscores",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(getApiUrl("create-url"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, urlName, customShortLink }),
      });

      const data = await res
        .json()
        .catch(() => ({ message: "Failed to create short link" }));

      if (!res.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
        throw new Error(errorMessage || "Failed to create short link");
      }

      toast.success("Short link created!");
      setResult(getShortUrl(data.shortenedUrl));
      setOriginalUrl("");
      setUrlName("");
      setCustomShortLink("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create short link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-50 rounded-full blur-3xl opacity-60" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.4]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-7 h-7">
                <path
                  d="M28 34 L92 34 L48 86 L92 86"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
              Shorten your links
            </h1>
            <p className="text-gray-500 text-sm">
              Free, fast, and no account needed to get started.
            </p>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl "
          >
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Original URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/your-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Custom Link (Optional)
              </label>
              <input
                type="text"
                placeholder="my-custom-link"
                value={customShortLink}
                onChange={(e) => setCustomShortLink(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              disabled={!originalUrl}
              isLoading={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Link2 className="w-4 h-4" />
              Shorten URL
            </Button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700 mb-1.5 font-medium">
                Your short link is ready
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0 truncate text-blue-700 hover:underline text-sm font-medium"
                >
                  {result}
                </a>
                <Button
                  type="button"
                  variant={copied ? "success" : "outline"}
                  size="icon"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                  className="shrink-0 cursor-pointer hover:bg-gray-100"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Footer / sign-up CTA */}
          {result && !isLoggedIn ? (
            <div className="mt-3 p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Want to track clicks and manage this link later?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/register")}
                className="shrink-0 cursor-pointer hover:bg-gray-100 "
              >
                Sign up free
              </Button>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-600 mt-8">
              {isLoggedIn ? (
                <a
                  href="/dashboard"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Go to Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Log in
                  </a>
                  <span className="mx-1">or</span>
                  <a
                    href="/register"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Sign up
                  </a>
                  <span> to manage all your links.</span>
                </>
              )}
            </p>
          )}

          {/* Simple footer */}
          <p className="text-center text-xs text-gray-400 mt-12">
            © {new Date().getFullYear()} Zippr. No ads, no tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
