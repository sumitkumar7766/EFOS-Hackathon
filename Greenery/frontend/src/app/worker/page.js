"use client";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5111";

export default function WorkerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  // API se tasks load karna
  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      const data = await res.json();
      if (data.status === "success") {
        // Sirf wahi tasks dikhao jo 'pending' hain
        setTasks(data.tasks.filter(t => t.status === "pending"));
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Upload Proof Logic (GPS + Image)
  const handleProof = (e, taskId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingId(taskId);

    // GPS Location lena
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("task_id", taskId);
      formData.append("lat", pos.coords.latitude);
      formData.append("lng", pos.coords.longitude);

      try {
        const res = await fetch(`${API_BASE}/api/tasks/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.status === "success") {
          alert("Kaam khatam! Proof upload ho gaya.");
          loadTasks(); // List update karo
        }
      } catch (err) {
        alert("Upload fail ho gaya!");
      }
      setUploadingId(null);
    });
  };

  if (isLoggedOut) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">EcoGrid Field</h1>
        <p className="text-slate-500 mb-6">Aap logout ho chuke hain.</p>
        <button onClick={() => setIsLoggedOut(false)} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold">Wapas Dashboard par jayein</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-10">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-600 uppercase tracking-tight">EcoGrid Worker</h1>
          <p className="text-[10px] font-bold text-slate-400">FIELD OPERATIONS ACTIVE</p>
        </div>
        <a href="/">
        <button 
          className="bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-xl border border-red-100"
        >
          LOGOUT
        </button>
        </a>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-800">Assigned Tasks ({tasks.length})</h2>
          <button onClick={loadTasks} className="text-emerald-600 text-xs font-bold">Refresh List</button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading assigned tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200">
            <span className="text-4xl mb-4 block">🌳</span>
            <h3 className="font-bold text-slate-800 text-lg">Sab Kaam Ho Gaya!</h3>
            <p className="text-sm text-slate-500 mt-1">Abhi koi naya task assigned nahi hai.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-3xl p-5 shadow-md border border-slate-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase mb-2 inline-block">Pending</span>
                    <h3 className="font-black text-slate-800 text-lg">{task.zone.name}</h3>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 p-2 rounded-2xl">
                    <span className="text-xs font-bold">{task.zone.trees} Plants</span>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                   <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-slate-50 p-2 rounded-lg">
                      <span>📍 {task.zone.lat}, {task.zone.lng}</span>
                   </div>
                </div>

                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" // Direct camera open karega mobile pe
                    onChange={(e) => handleProof(e, task.id)}
                    disabled={uploadingId === task.id}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                    uploadingId === task.id ? "bg-slate-200 text-slate-500" : "bg-slate-900 text-white active:scale-95"
                  }`}>
                    {uploadingId === task.id ? (
                      "Uploading Proof..."
                    ) : (
                      <>📷 Kaam Done? Photo Kheecho</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}