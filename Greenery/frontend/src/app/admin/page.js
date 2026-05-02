"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── API CONFIG ───────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5111";

const LAYERS = [
  { id: "impact", label: "Impact Score" },
  { id: "ndvi", label: "NDVI (Canopy)" },
  { id: "lst", label: "LST (Heat)" },
  { id: "vuln", label: "Vulnerability" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function wardStyle(w, layer) {
  if (layer === "ndvi")
    return w.ndvi > 0.5
      ? {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          accent: "text-emerald-600",
        }
      : w.ndvi > 0.3
        ? {
            bg: "bg-yellow-50",
            text: "text-yellow-700",
            accent: "text-yellow-600",
          }
        : { bg: "bg-red-50", text: "text-red-700", accent: "text-red-600" };
  if (layer === "lst")
    return w.lst > 40
      ? { bg: "bg-red-100", text: "text-red-800", accent: "text-red-600" }
      : w.lst > 35
        ? {
            bg: "bg-orange-50",
            text: "text-orange-800",
            accent: "text-orange-600",
          }
        : { bg: "bg-blue-50", text: "text-blue-800", accent: "text-blue-600" };
  if (layer === "vuln")
    return w.vuln > 0.7
      ? {
          bg: "bg-purple-50",
          text: "text-purple-800",
          accent: "text-purple-600",
        }
      : w.vuln > 0.4
        ? {
            bg: "bg-violet-50",
            text: "text-violet-800",
            accent: "text-violet-600",
          }
        : {
            bg: "bg-slate-50",
            text: "text-slate-600",
            accent: "text-slate-800",
          };
  return w.score > 80
    ? { bg: "bg-red-50", text: "text-red-800", accent: "text-red-600" }
    : w.score > 60
      ? {
          bg: "bg-orange-50",
          text: "text-orange-800",
          accent: "text-orange-600",
        }
      : w.score > 40
        ? {
            bg: "bg-amber-50",
            text: "text-amber-800",
            accent: "text-amber-600",
          }
        : {
            bg: "bg-emerald-50",
            text: "text-emerald-800",
            accent: "text-emerald-600",
          };
}

function wardVal(w, layer) {
  if (layer === "ndvi") return w.ndvi.toFixed(2);
  if (layer === "lst") return w.lst.toFixed(1) + "°";
  if (layer === "vuln") return w.vuln.toFixed(2);
  return w.score;
}

function scoreColor(score) {
  if (score > 80) return "text-red-600";
  if (score > 60) return "text-orange-500";
  if (score > 40) return "text-amber-500";
  return "text-emerald-600";
}

function scoreBarColor(score) {
  if (score > 80) return "bg-red-500";
  if (score > 60) return "bg-orange-500";
  if (score > 40) return "bg-amber-500";
  return "bg-emerald-500";
}

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = {
  Tree: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 22H5.71C7.13 18 9 14.28 17 12V16L22 11L17 6V8Z" />
    </svg>
  ),
  Grid: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  Map: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Globe: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Chart: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Leaf: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 22H5.71C7.13 18 9 14.28 17 12V16L22 11L17 6V8Z" />
    </svg>
  ),
  Temp: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  Shield: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Activity: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Bot: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Drop: () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Camera: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  ),
  Target: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="20" y2="12" />
    </svg>
  ),
};

// ─── LEAFLET MAP COMPONENT ────────────────────────────────────────────────────

function LeafletMap({
  selectedZone,
  onSelectZone,
  zonesData,
  heatmapData,
  bounds,
}) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (leafletRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => initMap();
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current || leafletRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([23.255, 77.39], 13);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 },
      ).addTo(map);

      leafletRef.current = map;
    }

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  // 🌍 HANDLE HEATMAP OVERLAY
  useEffect(() => {
    if (!leafletRef.current || !heatmapData || !bounds) return;
    const map = leafletRef.current;
    const L = window.L;

    if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
    }

    overlayRef.current = L.imageOverlay(heatmapData, bounds, {
      opacity: 0.65,
      interactive: false,
    }).addTo(map);

    map.fitBounds(bounds);
  }, [heatmapData, bounds]);

  // 📍 HANDLE DYNAMIC MARKERS
  useEffect(() => {
    if (!leafletRef.current || !zonesData) return;
    const map = leafletRef.current;
    const L = window.L;

    markersRef.current.forEach((m) => {
      map.removeLayer(m.bgMarker);
      map.removeLayer(m.fgMarker);
    });
    markersRef.current = [];

    zonesData.forEach((zone) => {
      const isRed = zone.status === "red";
      const color = isRed ? "#ef4444" : "#22c55e";

      const bgMarker = L.circleMarker([zone.lat, zone.lng], {
        radius: isRed ? 22 : 16,
        color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.2,
      }).addTo(map);

      const fgMarker = L.circleMarker([zone.lat, zone.lng], {
        radius: isRed ? 9 : 6,
        color: "#fff",
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
      }).addTo(map);

      fgMarker.on("click", () => {
        onSelectZone(zone);
        map.flyTo([zone.lat, zone.lng], 15, { duration: 0.8 });
      });

      markersRef.current.push({ id: zone.id, bgMarker, fgMarker });
    });
  }, [zonesData, onSelectZone]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-14 z-[1000] flex flex-col gap-2 pointer-events-none">
        <span className="bg-white/90 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 backdrop-blur-md tracking-widest font-mono shadow-sm animate-fade-in">
          SYS.COORD: ACTIVE
        </span>
        {heatmapData && (
          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-200 backdrop-blur-md tracking-widest font-mono shadow-sm animate-slide-up">
            HEATMAP: RENDERED
          </span>
        )}
      </div>
    </div>
  );
}

// ─── ZONE DETAIL CARD ─────────────────────────────────────────────────────────

function ZoneCard({ zone }) {
  if (!zone)
    return (
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium text-center px-6 bg-slate-50 transition-all duration-300">
        Click any zone on the map to view details
      </div>
    );
  const isRed = zone.status === "red";
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 animate-slide-up ${isRed ? "border-red-100 bg-red-50/50" : "border-emerald-100 bg-emerald-50/50"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">
            Selected Zone
          </p>
          <h4 className="font-bold text-slate-900 text-base leading-tight">
            {zone.name}
          </h4>
        </div>
        <span
          className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${isRed ? "bg-red-100 text-red-600 border-red-200" : "bg-emerald-100 text-emerald-600 border-emerald-200"}`}
        >
          {isRed ? "⚠ CRITICAL" : "✓ HEALTHY"}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-4">{zone.issue}</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            label: "NDVI",
            val: zone.ndvi.toFixed(2),
            color: "text-emerald-600",
          },
          {
            label: "LST",
            val: zone.lst.toFixed(1) + "°C",
            color: "text-orange-600",
          },
          {
            label: "Trees Needed",
            val: zone.trees || "—",
            color: "text-blue-600",
          },
          {
            label: "Coordinates",
            val: `${zone.lat}, ${zone.lng}`,
            color: "text-slate-600",
          },
        ].map((row, i) => (
          <div
            key={row.label}
            className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:-translate-y-0.5 transition-transform duration-200"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p className="text-[10px] text-slate-500 font-semibold mb-1">
              {row.label}
            </p>
            <p className={`font-bold text-sm ${row.color}`}>{row.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI PLAN PANEL ────────────────────────────────────────────────────────────

function AiPanel({ isOpen, onClose, currentZones }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  const generate = useCallback(() => {
    if (ran) return;
    setRan(true);
    setLoading(true);
    setSteps([]);
    const redZones = currentZones.filter((z) => z.status === "red");
    const totalTrees = redZones.reduce((s, z) => s + z.trees, 0);

    let allSteps = [];
    if (redZones.length > 0) {
      allSteps = [
        `Analysis Complete: ${redZones.length} critical red zones detected across the city grid.`,
        `Total Requirement: ${totalTrees.toLocaleString()} trees needed across all critical areas.`,
        `Step 1: Prioritise ${redZones[0].name} — "${redZones[0].issue}" is most severe (LST: ${redZones[0].lst}°C).`,
        `Step 2: Coordinate irrigation with the water supply dept for all ${redZones.length} red zone locations.`,
        `Step 3: Assign community workers and track real-time progress via this dashboard.`,
      ];
    } else {
      allSteps = [
        `Analysis Complete: Area looks generally healthy. No highly critical zones detected.`,
        `Step 1: Continue standard maintenance and watering schedules.`,
        `Step 2: Monitor periphery for any concrete expansion.`,
      ];
    }

    let i = 0;
    const delay = () => {
      if (i === 0) setLoading(false);
      if (i >= allSteps.length) return;
      const idx = i++;
      setTimeout(() => {
        setSteps((prev) => [...prev, allSteps[idx]]);
        delay();
      }, 500);
    };
    setTimeout(delay, 1400);
  }, [ran, currentZones]);

  useEffect(() => {
    if (isOpen) generate();
  }, [isOpen, generate]);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-[1001] bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Icon.Bot />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">AI Master Plan</p>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase">
                Smart Strategy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors text-xs font-semibold border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-1.5"
          >
            ✕ Close
          </button>
        </div>
        {loading && (
          <div className="flex items-center gap-3 text-slate-600 text-sm py-3 animate-pulse">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
            AI analyzing satellite data…
          </div>
        )}
        <div className="space-y-2 max-h-44 overflow-y-auto pr-2 custom-scrollbar">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-700 animate-slide-up shadow-sm hover:shadow transition-shadow"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 h-fit shadow-sm">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LIVE MAP PANEL WITH API INTEGRATION ───────────────────────────────────────

function LiveMapPanel() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

  const [liveZones, setLiveZones] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [targetLat, setTargetLat] = useState("23.2599");
  const [targetLng, setTargetLng] = useState("77.4126");

  const fetchLiveSatelliteData = async () => {
    setIsFetching(true);
    setSelectedZone(null);
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: parseFloat(targetLat),
          lon: parseFloat(targetLng),
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setLiveZones(data.zones);
        setHeatmapData(data.heatmap_image);
        setBounds(data.bounds);
      } else {
        alert("Backend Error: " + data.message);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to backend API. Ensure Flask is running.");
    }
    setIsFetching(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0 z-10 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-red-500 animate-pulse">⬤</span> Live Naksha
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time satellite tracking & dynamic Heatmap Overlay
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <div className="flex flex-col px-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Lat
            </span>
            <input
              type="text"
              value={targetLat}
              onChange={(e) => setTargetLat(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 w-20 focus:outline-none"
            />
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="flex flex-col px-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Lng
            </span>
            <input
              type="text"
              value={targetLng}
              onChange={(e) => setTargetLng(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 w-20 focus:outline-none"
            />
          </div>
          <button
            onClick={fetchLiveSatelliteData}
            disabled={isFetching}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            {isFetching ? (
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Icon.Target />
            )}
            {isFetching ? "Scanning..." : "Scan Area"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-4 p-4 bg-slate-50">
        <div className="flex-1 relative">
          {liveZones.length === 0 && !isFetching && (
            <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
              <div className="p-4 bg-slate-100 rounded-full mb-4 text-slate-400">
                <Icon.Map />
              </div>
              <p className="text-slate-600 font-semibold">
                Please scan an area to load the satellite map.
              </p>
            </div>
          )}
          <LeafletMap
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            zonesData={liveZones}
            heatmapData={heatmapData}
            bounds={bounds}
          />
          {/* {liveZones.length > 0 && (
            <button
              onClick={() => setAiOpen((v) => !v)}
              className="absolute bottom-4 right-4 z-[1000] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Icon.Bot /> AI Plan Agent
            </button>
          )} */}
          <AiPanel
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            currentZones={liveZones}
          />
        </div>

        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <ZoneCard zone={selectedZone} />
          <div
            className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                Scanned Zones
              </p>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                {liveZones.length} Sectors
              </span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
              {liveZones.map((z, index) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left animate-slide-up ${selectedZone?.id === z.id ? "bg-emerald-50 border border-emerald-200 shadow-sm" : "hover:bg-slate-50 border border-transparent"}`}
                  style={{ animationDelay: `${index * 15 + 100}ms` }}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${z.status === "red" ? "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"}`}
                  />
                  <span className="text-xs font-semibold text-slate-700 flex-1 truncate">
                    {z.name}
                  </span>
                  {z.trees > 0 && (
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md">
                      {z.trees}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: IconComp,
  iconBg,
  trend,
  trendColor,
  delay,
}) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}
      >
        <IconComp />
      </div>
      <p className="text-2xl font-black text-slate-900 tracking-tight">
        {value}
      </p>
      <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
      {trend && (
        <p className={`text-[11px] font-bold mt-2 ${trendColor}`}>{trend}</p>
      )}
    </div>
  );
}

function DashboardPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-slate-500">
        Loading Dashboard Data...
      </div>
    );
  if (!data)
    return (
      <div className="p-10 text-center text-slate-500 font-medium">
        Please go to Live Map and scan an area first to view dashboard metrics.
      </div>
    );

  return (
    <div className="flex flex-col flex-1 overflow-hidden animate-fade-in bg-slate-50">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
        <h2 className="text-xl font-black text-slate-900">
          Shahar Ki Samiksha
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Satellite metrics & active planting drives
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            delay="0ms"
            label="Avg Canopy (NDVI)"
            value={data.metrics.avg_ndvi}
            icon={Icon.Leaf}
            iconBg="bg-emerald-100 text-emerald-600"
            trend={data.metrics.ndvi_trend}
            trendColor="text-emerald-600"
          />
          <MetricCard
            delay="50ms"
            label="Urban Heat (LST)"
            value={data.metrics.urban_heat}
            icon={Icon.Temp}
            iconBg="bg-orange-100 text-orange-600"
            trend={data.metrics.heat_trend}
            trendColor="text-orange-600"
          />
          <MetricCard
            delay="100ms"
            label="High Risk Zones"
            value={data.metrics.high_risk_zones}
            icon={Icon.Shield}
            iconBg="bg-red-100 text-red-600"
            trend={data.metrics.risk_trend}
            trendColor="text-red-600"
          />
          <MetricCard
            delay="150ms"
            label="Trees Planted"
            value={data.metrics.trees_planted}
            icon={Icon.Activity}
            iconBg="bg-blue-100 text-blue-600"
            trend={data.metrics.trees_trend}
            trendColor="text-blue-600"
          />
        </div>

        <div
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm">
              Priority Targets — Highest Impact Zones
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {data.priority_targets.map((w, i) => (
              <div
                key={w.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group animate-slide-up"
                style={{ animationDelay: `${i * 30 + 250}ms` }}
              >
                <span className="text-xs font-bold text-slate-400 w-5 group-hover:text-emerald-600 transition-colors">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {w.name}
                </span>
                <span className="text-xs text-slate-500 w-16">
                  {w.lst.toFixed(1)}°C
                </span>
                <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${scoreBarColor(w.score)}`}
                    style={{ width: `${w.score}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-black w-8 text-right ${scoreColor(w.score)}`}
                >
                  {w.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeoPanel() {
  const [activeLayer, setActiveLayer] = useState("impact");
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/wards`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") setWards(res.wards);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-slate-500">
        Loading Geo Intel...
      </div>
    );
  if (wards.length === 0)
    return (
      <div className="p-10 text-center text-slate-500 font-medium">
        Please scan an area from Live Map first.
      </div>
    );

  return (
    <div className="flex flex-col flex-1 overflow-hidden animate-fade-in bg-slate-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0 gap-4 flex-wrap shadow-sm z-10">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Bhaugolik Jankari
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-band satellite imagery & data fusion
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${activeLayer === l.id ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wards.map((w, index) => {
            const { bg, text, accent } = wardStyle(w, activeLayer);
            const val = wardVal(w, activeLayer);
            return (
              <div
                key={w.id}
                className={`${bg} rounded-2xl p-5 border border-white hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-default relative animate-slide-up shadow-sm`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {!w.water && activeLayer === "impact" && (
                  <div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-slate-500 shadow-sm"
                    title="No water supply"
                  >
                    <Icon.Drop />
                  </div>
                )}
                <p
                  className={`text-[9px] font-black tracking-widest uppercase opacity-70 ${text}`}
                >
                  {w.id}
                </p>
                <p className={`text-sm font-bold leading-tight mt-1 ${text}`}>
                  {w.name}
                </p>
                <p className={`text-4xl font-black mt-3 ${accent}`}>{val}</p>
                <p
                  className={`text-[10px] mt-1 ${text} opacity-70 uppercase tracking-wider font-bold`}
                >
                  {activeLayer === "impact"
                    ? "impact score"
                    : activeLayer.toUpperCase()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OptimizerPanel() {
  const [budget, setBudget] = useState(3000);
  const [requireWater, setRequireWater] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runOpt = useCallback(
    (b = budget, rw = requireWater) => {
      setLoading(true);
      fetch(`${API_BASE}/api/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: b, requireWater: rw }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") setResult(data.result);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    },
    [budget, requireWater],
  );

  useEffect(() => {
    runOpt();
  }, [runOpt]);

  function handleBudget(e) {
    const v = Number(e.target.value);
    setBudget(v);
    runOpt(v, requireWater);
  }

  function handleWater() {
    const nw = !requireWater;
    setRequireWater(nw);
    runOpt(budget, nw);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden animate-fade-in bg-slate-50">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
            <Icon.Chart />
          </div>
          AI Budget Optimizer
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Knapsack algorithm — maximum-ROI tree planting allocation
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 h-fit shadow-sm animate-slide-up">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Tree Budget
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={budget}
                  onChange={handleBudget}
                  className="flex-1 accent-emerald-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-black text-emerald-600 w-14 text-right bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                  {budget}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Water Filter
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleWater}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${requireWater ? "bg-emerald-600" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${requireWater ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Only include wards with water supply infrastructure
                </p>
              </div>
            </div>

            <button
              onClick={() => runOpt()}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm transition-all duration-300 hover:shadow-lg active:scale-95 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />{" "}
                  Optimizing…
                </>
              ) : (
                "Run Optimizer"
              )}
            </button>
          </div>

          <div className="space-y-4">
            {result && !loading && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Trees Allocated",
                    val: result.treesAllocated,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50 border-emerald-100",
                  },
                  {
                    label: "Wards Covered",
                    val: result.sel.length,
                    color: "text-blue-600",
                    bg: "bg-blue-50 border-blue-100",
                  },
                  {
                    label: "Avg Impact ROI",
                    val: result.avgImp,
                    color: "text-purple-600",
                    bg: "bg-purple-50 border-purple-100",
                  },
                ].map((c, index) => (
                  <div
                    key={c.label}
                    className={`border rounded-2xl p-4 text-center shadow-sm animate-slide-up ${c.bg}`}
                    style={{ animationDelay: `${index * 100 + 100}ms` }}
                  >
                    <p className={`text-3xl font-black ${c.color}`}>{c.val}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">
                  Optimized Planting List
                </h3>
                <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full tracking-wider uppercase shadow-sm">
                  Knapsack Result
                </span>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
                  <div className="w-8 h-8 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-sm font-semibold animate-pulse">
                    Processing data variables…
                  </p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-white">
                      {["#", "Ward", "Impact", "Water", "Allocated"].map(
                        (h, i) => (
                          <th
                            key={h}
                            className={`py-3 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${i === 4 ? "text-right" : "text-left"}`}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(!result || result.sel.length === 0) && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-slate-500 text-sm font-medium"
                        >
                          No wards match current constraints or please scan area
                          first.
                        </td>
                      </tr>
                    )}
                    {result?.sel.map((w, i) => (
                      <tr
                        key={w.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors animate-slide-up"
                        style={{ animationDelay: `${i * 40 + 300}ms` }}
                      >
                        <td className="py-3 px-5 text-slate-400 font-bold">
                          #{i + 1}
                        </td>
                        <td className="py-3 px-5 font-semibold text-slate-700">
                          {w.name}
                        </td>
                        <td className="py-3 px-5">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {w.score}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          {w.water ? (
                            <span className="text-emerald-500">
                              <Icon.Check />
                            </span>
                          ) : (
                            <span className="text-red-400">
                              <Icon.X />
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-right font-black text-emerald-600 text-base">
                          {w.alloc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FIELD OPS ──────────────────────────────────────────────────

function FieldOpsPanel() {
  const [assignments, setAssignments] = useState([]);
  const [availableZones, setAvailableZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [leadName, setLeadName] = useState("");

  // Initial Fetch
  useEffect(() => {
    fetch(`${API_BASE}/api/wards`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setAvailableZones(data.wards);
          if (data.wards.length > 0) setSelectedZone(data.wards[0].id);
        }
      });

    fetch(`${API_BASE}/api/tasks`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setAssignments(data.tasks);
      });
  }, []);

  const handleAssign = () => {
    if (!leadName.trim() || !selectedZone) return;
    const zone = availableZones.find((z) => z.id === selectedZone);
    if (!zone) return;

    fetch(`${API_BASE}/api/tasks/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zone, leadName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setAssignments([data.task, ...assignments]);
          setLeadName("");
        }
      });
  };

  const handleUpload = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    // Yahan aage chalkar FormData upload banega. Abhi UX flow pura karne ke liye local update kar rahe hain.
    const url = URL.createObjectURL(file);
    const now = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: "completed",
            proof: { url, timestamp: now, lat: a.zone.lat, lng: a.zone.lng },
          };
        }
        return a;
      }),
    );
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden animate-fade-in bg-slate-50">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Icon.Users />
          </div>
          Field Operations
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Assign worker teams to zones & upload geo-tagged proofs.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 h-fit shadow-sm animate-slide-up">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">
              Assign Team Lead
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Select Target Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
              >
                {availableZones.length === 0 && (
                  <option>Please scan area first</option>
                )}
                {availableZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.status === "red" ? "Critical" : "Healthy"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Team Lead Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              onClick={handleAssign}
              disabled={!leadName.trim() || availableZones.length === 0}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold text-sm transition-all duration-300 shadow-md shadow-emerald-600/20 active:scale-95 mt-2"
            >
              Assign Team Task
            </button>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">
                Active & Completed Tasks
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold shadow-sm">
                {assignments.length} Total
              </span>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
              {assignments.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center gap-4">
                  <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                    <Icon.Users />
                  </div>
                  <p>
                    No active assignments yet.
                    <br />
                    Assign a team from the panel to begin.
                  </p>
                </div>
              ) : (
                assignments.map((task, index) => (
                  <div
                    key={task.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-slide-up hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shadow-sm ${task.status === "completed" ? "bg-emerald-500" : "bg-orange-500 animate-pulse shadow-[0_0_5px_rgba(249,115,22,0.5)]"}`}
                        />
                        <h4 className="font-bold text-slate-800 text-sm">
                          {task.zone.name}
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${task.status === "completed" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-orange-100 text-orange-700 border border-orange-200"}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-md border border-slate-100 inline-block">
                        Lead:{" "}
                        <span className="text-slate-800 font-bold">
                          {task.leadName}
                        </span>
                      </p>
                    </div>

                    {task.status === "pending" ? (
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleUpload(e, task.id)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <button className="bg-white group-hover:bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all duration-300 pointer-events-none group-active:scale-95">
                          <Icon.Camera /> Upload Proof
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-24 rounded-lg overflow-hidden relative border-2 border-white shadow-md bg-slate-200 group flex-shrink-0 cursor-pointer">
                        <img
                          src={task.proof.url}
                          alt="Proof"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 opacity-90 transition-opacity duration-300">
                          <p className="text-[8px] text-emerald-300 font-mono font-bold leading-tight drop-shadow-md">
                            LAT: {task.proof.lat}
                          </p>
                          <p className="text-[8px] text-emerald-300 font-mono font-bold leading-tight drop-shadow-md">
                            LNG: {task.proof.lng}
                          </p>
                          <p className="text-[7px] text-white/90 font-mono mt-0.5">
                            {task.proof.timestamp}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAV BUTTON ───────────────────────────────────────────────────────────────

function NavBtn({ id, label, icon: IconComp, active, onClick, live }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold w-full text-left transition-all duration-300 relative overflow-hidden group ${active ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}
    >
      {active && (
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
      <span className="relative z-10">
        <IconComp />
      </span>
      <span className="flex-1 relative z-10">{label}</span>
      {live && (
        <span className="relative z-10 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)] animate-pulse" />
      )}
    </button>
  );
}

// ─── AI PROMPTING AGENT (FULL DATA ACCESS) ───────────────────────────────────

// ─── AI PROMPTING AGENT (FULL DATA ACCESS) ───────────────────────────────────

// ─── AI PROMPTING AGENT (FULL DATA ACCESS) ───────────────────────────────────

function PromptingAgent({ isOpen, onClose, fullContext }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Systems online. I am tracking all satellite zones, team assignments, and uploaded proofs. How can I assist you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // ⚠️ Ensure your API key is valid
  const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    // 🧠 UPGRADED SYSTEM PROMPT
    const systemPrompt = `You are the Central AI Manager for the 'EcoGrid: Satellite-Based Urban Tree-Equity Auditor'. 
You are assisting the Admin ). 
You have FULL, REAL-TIME ACCESS to the dashboard state provided as JSON below.

YOUR RESPONSIBILITIES:
1. Act as a strategic planner. Tell the admin what the most critical zones are based on LST (Heat) and NDVI (Canopy).
2. Track workers and tasks. If the admin asks "Who is assigned to what?" or "Did we get proof?", read the "tasks" array in the JSON context. 
3. If a task status is "completed", confirm that proof was received (with timestamp/coordinates). If "pending", note that the team lead is still working.
4. Offer actionable solutions. If a zone is critical, suggest assigning a team, or running the budget optimizer.
5. Answer naturally, clearly, and use markdown formatting (bolding, lists) for readability. Speak in a mix of Hindi and English if the user talks to you in Hindi/Hinglish.

CURRENT DASHBOARD DATA:
${JSON.stringify(fullContext, null, 2)}`;

    const chatHistory = messages.map((m) => ({
      role: m.role === "ai" ? "assistant" : m.role,
      content: m.text,
    }));

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "EcoGrid Dashboard",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: userMsg },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error("OpenRouter API Error Details:", data);
        const errorMsg =
          data?.error?.message || `HTTP Error ${res.status}: Failed to fetch`;
        throw new Error(errorMsg);
      }

      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content;
        setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
      } else {
        throw new Error("Invalid response structure from OpenRouter.");
      }
    } catch (err) {
      console.error("Chatbot Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `⚠ API Error: ${err.message}. Please check console.`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-[1001] bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out h-[450px] flex flex-col ${isOpen ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Icon.Bot />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">
              Central AI Manager
            </p>
            <p className="text-[10px] text-emerald-600 tracking-wider uppercase font-bold">
              Live Task & Data Sync: Active
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg transition-colors hover:bg-slate-50"
        >
          ✕ Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20" : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"}`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me about pending tasks, zone proofs, or action plans..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 text-white px-5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function EcoGridDashboard() {
  const [tab, setTab] = useState("liveMap");
  const [aiOpen, setAiOpen] = useState(false);

  // 🟢 GLOBAL CONTEXT STATE: Yeh AI agent ka dimaag hai
  const [globalData, setGlobalData] = useState({
    zones: [],
    metrics: null,
    optimizerOutput: null,
    geoIntel: [],
  });

  // Helper function taaki child components data bhej sakein
  const updateGlobalData = useCallback((key, data) => {
    setGlobalData((prev) => ({ ...prev, [key]: data }));
  }, []);

  const tabs = [
    { id: "dashboard", label: "Overview", icon: Icon.Grid },
    { id: "liveMap", label: "Live Map", icon: Icon.Map, live: true },
    { id: "geo", label: "Geo Intel", icon: Icon.Globe },
    { id: "optimizer", label: "Optimizer", icon: Icon.Chart },
    { id: "fieldOps", label: "Field Ops", icon: Icon.Users },
  ];

  return (
    <>
      <style>{/* Aapka purana CSS same rahega */}</style>
      <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
        <aside className="w-56 flex-shrink-0 flex flex-col border-r border-slate-200 bg-white px-4 py-6 z-20">
          {/* Sidebar Code same rahega */}
          <div className="flex items-center gap-3 px-2 mb-8 animate-slide-up">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
              <Icon.Tree />
            </div>
            <div>
              <p className="text-xl font-black">EcoGrid</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1.5 flex-1">
            {tabs.map((t) => (
              <NavBtn
                key={t.id}
                {...t}
                active={tab === t.id}
                onClick={setTab}
              />
            ))}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
          <div
            key={tab}
            className="flex-1 flex flex-col overflow-hidden panel-enter relative z-10"
          >
            {/* Components ko global update handler pass kar rahe hain */}
            {tab === "liveMap" && (
              <LiveMapPanel
                updateGlobal={(data) => updateGlobalData("zones", data)}
              />
            )}
            {tab === "dashboard" && <DashboardPanel />}
            {tab === "geo" && <GeoPanel />}
            {tab === "optimizer" && <OptimizerPanel />}
            {tab === "fieldOps" && <FieldOpsPanel />}
          </div>

          {/* 🤖 FLOATING AI BUTTON - Hamesha available rahega */}
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="absolute bottom-6 right-6 z-[1000] bg-slate-900 hover:bg-emerald-600 text-white font-bold px-5 py-3.5 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
          >
            <Icon.Bot /> Ask AI Agent
          </button>

          {/* THE NEW PROMPTING AGENT */}
          <PromptingAgent
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            fullContext={globalData}
          />
        </main>
      </div>
    </>
  );
}
