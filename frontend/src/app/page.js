"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (form.username === "admin" && form.password === "admin123") {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Use admin / admin123");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── LEFT DECORATIVE PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex-col justify-between p-12 overflow-hidden">
        {/* Soft blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/4 opacity-50" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-teal-100 rounded-full translate-y-1/3 -translate-x-1/4 opacity-50" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(#bbf7d0 1px, transparent 1px), linear-gradient(90deg, #bbf7d0 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xl leading-none" style={{ fontFamily: "'Georgia', serif" }}>SaharSathi</p>
            <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mt-0.5">SCC Center</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-5">
          <h2 className="text-5xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
            Smart City<br />
            <span className="text-emerald-600">Control Center</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Unified smart city platform — monitor sanitation, air quality, traffic, water, and 8 more services in real time.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {["Safai Mitra", "CH₄ Monitor", "Water Inflow", "Traffic", "Green Cover", "+7 more"].map((f, i) => (
              <span
                key={f}
                className={`px-3 py-1.5 text-xs rounded-full font-medium border ${
                  i === 5
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-emerald-700 border-emerald-200 shadow-sm"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom stat cards */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { val: "12", label: "Portals" },
            { val: "4.2L", label: "Citizens" },
            { val: "99.7%", label: "Uptime" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>{s.val}</div>
              <div className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT LOGIN PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Georgia', serif" }}>SmartCity BMC</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm mt-1.5">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "u" ? "text-emerald-500" : "text-gray-300"}`}>
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  onFocus={() => setFocused("u")}
                  onBlur={() => setFocused("")}
                  placeholder="admin"
                  className="w-full border-2 border-gray-100 bg-gray-50/80 text-gray-800 placeholder-gray-300 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "p" ? "text-emerald-500" : "text-gray-300"}`}>
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused("p")}
                  onBlur={() => setFocused("")}
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-100 bg-gray-50/80 text-gray-800 placeholder-gray-300 rounded-2xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPass ? (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500 text-xs">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition-all duration-200 shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-100 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Portal
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700">Demo Credentials</p>
              <p className="text-xs text-gray-400 mt-0.5">
                User: <span className="text-gray-700 font-medium">admin</span> &nbsp;·&nbsp;
                Pass: <span className="text-gray-700 font-medium">admin123</span>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-300 text-xs mt-8">©️ 2025 Bhopal Municipal Corporation</p>
        </div>
      </div>
    </div>
  );
}