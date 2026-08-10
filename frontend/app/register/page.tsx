"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../components/LoadingScreen";
import { getApiUrl } from "../../lib/api-config";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("register");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(getApiUrl("auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Kode OTP telah dikirim ke email anda!");
        setStep("verify");
      } else {
        setMessage(`${data.message || "Register account failed"}`);
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("auth/register/verify"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Verifikasi OTP berhasil! Silakan masuk.");
        router.push("/login");
      } else {
        setMessage(`${data.message || "Verifikasi OTP gagal."}`);
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen saat register process
  if (loading) {
    return (
      <LoadingScreen
        title={step === "register" ? "Creating your account" : "Verifying your code"}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm">
        {step === "register" ? (
          // REGISTER FORM
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Buat akun
              </h1>
              <p className="text-gray-500 text-sm">
                Selamat datang! Silakan isi detail Anda.
              </p>
            </div>
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g., john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              {message && (
                <div
                  className={`text-sm ${
                    message.includes("berhasil") || message.includes("telah dikirim")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Buat akun
              </button>

              <p className="text-center text-sm text-gray-600">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Masuk di sini
                </a>
              </p>
            </form>
          </>
        ) : (
          // OTP VERIFICATION FORM
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Verifikasi email
              </h1>
              <p className="text-gray-500 text-sm">
                Masukkan kode 6 digit yang dikirim ke{" "}
                <span className="text-gray-900 font-medium">{email}</span>
              </p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Kode OTP
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-3 text-center text-2xl tracking-[0.4em] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  required
                  maxLength={6}
                />
              </div>

              {message && (
                <div
                  className={`text-sm ${
                    message.includes("berhasil") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Verifikasi & buat akun
              </button>

              <p className="text-center text-sm text-gray-600">
                Tidak menerima kode?{" "}
                <button
                  type="button"
                  onClick={() => setStep("register")}
                  className="text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Kirim ulang
                </button>
              </p>
            </form>
          </>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
