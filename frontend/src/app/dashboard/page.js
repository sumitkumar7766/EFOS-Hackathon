"use client";
import React, { useState } from "react";
import {
  Trash2,
  Cpu,
  Wind,
  Droplets,
  TrafficCone,
  Lightbulb,
  ClipboardList,
  TreePine,
  Zap,
  Cctv,
  Map,
  HeartPulse,
  Search,
  Bell,
  Activity,
  Users,
  Server,
  ArrowRight,
  LogOut,
  CheckCircle2,
  School,
} from "lucide-react";

const portals = [
  {
    id: 1,
    title: "Safai Mitra",
    subtitle: "Sanitation Worker Tracking",
    icon: Trash2,
    color: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "text-emerald-600",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100/80 text-emerald-700",
    status: "248 Active",
    stats: ["248 Workers Online", "12 Zones", "94% Attendance"],
    url: "http://localhost:3000/",
  },
  {
    id: 2,
    title: "Methane Detector",
    subtitle: "Smart Waste Detection",
    icon: Cpu,
    color: "bg-amber-50",
    border: "border-amber-100",
    accent: "text-amber-600",
    dot: "bg-amber-500",
    badge: "bg-amber-100/80 text-amber-700",
    status: "3 Alerts",
    stats: ["56 Sensors Active", "3 High Fill Zones", "2 Pickups Due"],
    url: "http://localhost:3001/",
  },
  {
    id: 4,
    title: "Water Inflow",
    subtitle: "Water Supply Management",
    icon: Droplets,
    color: "bg-teal-50",
    border: "border-teal-100",
    accent: "text-teal-600",
    dot: "bg-teal-500",
    badge: "bg-teal-100/80 text-teal-700",
    status: "Optimal",
    stats: ["82% Tank Levels", "18 Zones Active", "0 Leaks"],
    url: "http://localhost:3002/",
  },
  {
    id: 6,
    title: "Street Lights",
    subtitle: "Smart Lighting Grid",
    icon: Lightbulb,
    color: "bg-yellow-50",
    border: "border-yellow-100",
    accent: "text-yellow-600",
    dot: "bg-yellow-500",
    badge: "bg-yellow-100/80 text-yellow-700",
    status: "98% On",
    stats: ["4820 Lights Active", "98 Faulty", "Auto Mode: ON"],
    url: "http://localhost:3011/",
  },
  {
    id: 8,
    title: "Green Cover",
    subtitle: "Parks & Tree Census",
    icon: TreePine,
    color: "bg-lime-50",
    border: "border-lime-100",
    accent: "text-lime-600",
    dot: "bg-lime-500",
    badge: "bg-lime-100/80 text-lime-700",
    status: "Healthy",
    stats: ["142 Parks Mapped", "38K Trees", "12 Drives Planned"],
    url: "http://localhost:3109/",
  },
  {
    id: 10,
    title: "Smart CCTV",
    subtitle: "City Surveillance Network",
    icon: Cctv,
    color: "bg-slate-50",
    border: "border-slate-100",
    accent: "text-slate-600",
    dot: "bg-slate-500",
    badge: "bg-slate-100/80 text-slate-700",
    status: "Live",
    stats: ["842 Cameras Live", "6 Offline", "AI Alert: Active"],
    url: "http://localhost:3115",
  },
  {
    id: 11,
    title: "Road Repair",
    subtitle: "Pothole & Road Status",
    icon: Map,
    color: "bg-stone-50",
    border: "border-stone-100",
    accent: "text-stone-600",
    dot: "bg-stone-500",
    badge: "bg-stone-100/80 text-stone-700",
    status: "23 Issues",
    stats: ["23 Potholes Logged", "8 Under Repair", "5 Done Today"],
    url: "http://localhost:5173/",
  },
  {
    id: 11,
    title: "Vasundhara",
    subtitle: "Environmental education platform for school and colleges",
    icon: School,
    color: "bg-green-50",
    border: "border-green-100",
    accent: "text-green-600",
    dot: "bg-green-500",
    badge: "bg-green-100/80 text-green-700",
    status: "23 Issues",
    stats: ["50 School Logged", "35k Students Enrolled", "20 NGOs Partnered"],
    url: "http://localhost:3215/",
  },
];

const statCards = [
  {
    label: "Active Portals",
    value: "12",
    sub: "+2 this week",
    icon: Activity,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Total Alerts",
    value: "28",
    sub: "5 critical",
    icon: Bell,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Citizens Served",
    value: "4.2L",
    sub: "+3.2% today",
    icon: Users,
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    label: "System Uptime",
    value: "99.7%",
    sub: "Last 30 days",
    icon: Server,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
];

export default function App() {
  const [search, setSearch] = useState("");

  const filtered = portals.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden">
      {/* CSS For Smooth Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Decorative Ambient Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3 mix-blend-multiply pointer-events-none animate-fade-in" />
      <div
        className="absolute top-40 right-0 w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-[100px] translate-x-1/3 mix-blend-multiply pointer-events-none animate-fade-in"
        style={{ animationDelay: "200ms" }}
      />

      {/* ── NAVBAR (Glassmorphism) ── */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm animate-fade-in-down">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/30 transition-all duration-300">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-slate-900 text-lg leading-none tracking-tight group-hover:text-emerald-700 transition-colors duration-300">
                SaharSathi
              </span>
              <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mt-1 hidden sm:block">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Search (Desktop) */}
          <div className="hidden md:flex items-center bg-slate-100/50 hover:bg-slate-100 border border-slate-200/80 rounded-full px-4 py-2 gap-2 w-80 focus-within:!bg-white focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300 group">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services & portals..."
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full font-medium"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50/80 border border-emerald-100/80 rounded-full px-3 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                All Systems Live
              </span>
            </div>

            <div className="hidden md:block bg-white border border-slate-200/80 rounded-full px-4 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>

            <div className="flex items-center gap-3 pl-2 sm:border-l border-slate-200/80">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 p-[2px] shadow-sm cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-300">
                <div className="w-full h-full bg-white rounded-full border border-white flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-700">AK</span>
                </div>
              </div>
              <a href="/">
                <button className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-rose-50 hidden sm:block">
                  <LogOut className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-10 relative z-10">
        {/* ── PAGE HEADER ── */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/80 mb-4 shadow-sm hover:bg-white transition-colors cursor-default">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-[11px] text-slate-600 uppercase tracking-widest font-bold">
                Smart City Control Center
              </p>
            </div>
            <h1 className="text-3xl md:text-[2.5rem] leading-tight font-extrabold text-slate-900 tracking-tight">
              City Administration
            </h1>
            <p className="text-slate-500 text-[15px] mt-3 font-medium max-w-xl leading-relaxed">
              Real-time monitoring and control center for municipal services,
              infrastructure, and public grievance systems.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:shadow-md transition-all duration-300 focus:ring-4 focus:ring-slate-100 active:scale-95">
              Export Report
            </button>
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 rounded-xl text-sm text-white font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-500/20 focus:ring-4 focus:ring-slate-200 active:scale-95">
              + Add Module
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="animate-fade-in-up bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                style={{ animationDelay: `${200 + i * 100}ms` }}
              >
                {/* Subtle hover glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div
                    className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md">
                    {s.sub}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight relative z-10">
                  {s.value}
                </div>
                <div className="text-sm text-slate-500 mt-1 font-semibold relative z-10">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SECTION HEADER + MOBILE SEARCH ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              City Portals
              <span className="px-2.5 py-0.5 bg-slate-200/60 text-slate-600 text-[11px] font-bold rounded-full">
                {filtered.length} Active
              </span>
            </h2>
          </div>

          {/* Mobile Search */}
          <div className="flex md:hidden items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 gap-2 w-full shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search portals..."
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full font-medium"
            />
          </div>
        </div>

        {/* ── PORTAL GRID ── */}
        {filtered.length === 0 ? (
          <div
            className="animate-fade-in-up bg-white rounded-2xl border border-slate-200 border-dashed text-center py-24 flex flex-col items-center justify-center shadow-sm"
            style={{ animationDelay: "500ms" }}
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">
              No portals found
            </h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Try adjusting your search terms
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-emerald-600 text-sm font-semibold hover:text-emerald-700 hover:underline transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filtered.map((portal, idx) => {
              const PortalIcon = portal.icon;
              return (
                <div
                  key={portal.id}
                  onClick={() =>
                    portal.url && window.open(portal.url, "_blank")
                  }
                  className={`animate-fade-in-up group relative bg-white border ${portal.border} rounded-2xl p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full`}
                  style={{ animationDelay: `${400 + idx * 100}ms` }}
                >
                  {/* Subtle top glow line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${portal.dot} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Subtle background glow on hover */}
                  <div
                    className={`absolute inset-0 ${portal.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div
                      className={`w-12 h-12 ${portal.color} rounded-2xl flex items-center justify-center border ${portal.border} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}
                    >
                      <PortalIcon
                        className={`w-6 h-6 ${portal.accent}`}
                        strokeWidth={1.75}
                      />
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold ${portal.badge} shadow-sm border border-white/50 flex items-center gap-1.5`}
                    >
                      {portal.status === "Optimal" ||
                      portal.status === "Healthy" ||
                      portal.status === "Live" ||
                      portal.status.includes("Active") ||
                      portal.status.includes("On") ? (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${portal.dot} animate-pulse`}
                        />
                      ) : null}
                      {portal.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-slate-900 text-[17px] leading-tight mb-1.5 group-hover:text-emerald-700 transition-colors relative z-10">
                    {portal.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mb-5 relative z-10">
                    {portal.subtitle}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 group-hover:bg-slate-200/60 transition-colors mb-4 w-full relative z-10" />

                  {/* Stats */}
                  <div className="space-y-2.5 flex-grow relative z-10">
                    {portal.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${portal.dot} shadow-sm opacity-60 group-hover:opacity-100 transition-opacity`}
                        />
                        <span className="text-xs font-semibold text-slate-600">
                          {stat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="mt-6 pt-4 border-t border-slate-50 group-hover:border-slate-100 transition-colors flex items-center justify-between relative z-10">
                    <span
                      className={`text-xs font-bold ${portal.accent} opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`}
                    >
                      Access Portal
                    </span>
                    <div
                      className={`w-8 h-8 ${portal.color} border ${portal.border} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-sm`}
                    >
                      <ArrowRight
                        className={`w-4 h-4 ${portal.accent}`}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div
          className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in"
          style={{ animationDelay: "800ms" }}
        >
          <p className="text-sm font-semibold text-slate-400">
            © 2026 Bhopal Municipal Corporation · SmartCity Hub
          </p>
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-400">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">
              Version 3.0.2
            </span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
            <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/50">
              <ShieldCheck className="w-4 h-4" />
              Secure Connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Icon for Footer
function ShieldCheck(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
