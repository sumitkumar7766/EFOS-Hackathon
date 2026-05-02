"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Leaf, Users, TreePine, MapPin, Sprout, ArrowRight, Loader2 } from "lucide-react";

const roles = [
  {
    id: "admin",
    title: "City Admin",
    route: "/admin",
    badge: "Governance",
    icon: Shield,
    description: "Approve plantation drives, track wards, and review green impact reports.",
    color: "from-emerald-500 to-teal-600",
    lightColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "worker",
    title: "City Worker",
    route: "/worker",
    badge: "Field Team",
    icon: Sprout,
    description: "Manage assigned planting tasks, site checks, and sapling care updates.",
    color: "from-green-500 to-emerald-600",
    lightColor: "bg-green-50 text-green-700 border-green-200"
  },
  {
    id: "citizen",
    title: "Citizen",
    route: "/citizen",
    badge: "Community",
    icon: Users,
    description: "Request trees, join drives, and report areas that need greenery.",
    color: "from-teal-500 to-cyan-600",
    lightColor: "bg-teal-50 text-teal-700 border-teal-200"
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const blobVariants = {
  animate: {
    scale: [1, 1.1, 1],
    rotate: [0, 90, 0],
    transition: { duration: 20, repeat: Infinity, ease: "linear" }
  }
};

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const activeRole = useMemo(
    () => roles.find((role) => role.id === selectedRole) ?? roles[0],
    [selectedRole],
  );

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingIn(true);
    router.push(activeRole.route);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <section className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            variants={blobVariants} animate="animate"
            className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-emerald-200/40 blur-[100px]" 
          />
          <motion.div 
            variants={blobVariants} animate="animate" style={{ animationDelay: '-5s' }}
            className="absolute -right-[5%] top-[20%] h-[600px] w-[600px] rounded-full bg-teal-200/30 blur-[120px]" 
          />
          <motion.div 
            variants={blobVariants} animate="animate" style={{ animationDelay: '-10s' }}
            className="absolute bottom-[-10%] left-[20%] h-[400px] w-[400px] rounded-full bg-green-200/40 blur-[100px]" 
          />
        </div>

        {/* Main Glass Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid w-full max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/60 shadow-[0_30px_60px_-15px_rgba(4,43,22,0.15)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]"
        >
          
          {/* LEFT PANEL - Branding & Stats */}
          <div className="relative flex min-h-[680px] flex-col justify-between overflow-hidden bg-emerald-950 p-10 text-white sm:p-12 lg:p-16">
            {/* Subtle overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-emerald-950 to-black/80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            
            {/* Decorative circles */}
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-emerald-500/20 bg-emerald-500/5 blur-2xl" 
            />
            
            <motion.div 
              variants={containerVariants} initial="hidden" animate="visible"
              className="relative z-10 flex flex-col h-full justify-between"
            >
              <div>
                <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold tracking-widest text-emerald-300 backdrop-blur-md">
                  <Leaf className="h-4 w-4" />
                  <span>GREENERY PORTAL</span>
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="max-w-xl text-5xl font-black leading-[1.05] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-100 sm:text-6xl lg:text-7xl">
                  Grow the city,<br/>one login<br/>at a time.
                </motion.h1>
                
                <motion.p variants={itemVariants} className="mt-6 max-w-md text-lg leading-relaxed text-emerald-200/80 font-medium">
                  A unified command center for managing planting drives, field worker updates, and local citizen requests.
                </motion.p>
              </div>

              {/* Stats Grid */}
              <motion.div variants={containerVariants} className="mt-16 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Active wards", value: "24", icon: MapPin },
                  { label: "Trees planted", value: "1.8k", icon: TreePine },
                  { label: "Citizen reports", value: "312", icon: Users },
                ].map((stat, idx) => (
                  <motion.div 
                    key={idx} variants={itemVariants}
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors"
                  >
                    <stat.icon className="absolute right-4 top-4 h-12 w-12 text-emerald-500/20 transition-transform group-hover:scale-110 group-hover:text-emerald-500/30" />
                    <p className="text-4xl font-black text-white">{stat.value}</p>
                    <p className="mt-2 text-sm font-medium text-emerald-200">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT PANEL - Login Form */}
          <div className="flex items-center p-8 sm:p-12 lg:p-16">
            <motion.div 
              variants={containerVariants} initial="hidden" animate="visible"
              className="w-full max-w-lg mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-10">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Secure Access</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Welcome back.</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-500">
                  Select your role to access the personalized workspace for your environmental initiatives.
                </p>
              </motion.div>

              {/* Role Selection */}
              <motion.div variants={itemVariants} className="mb-8 grid gap-4 sm:grid-cols-3">
                {roles.map((role) => {
                  const isActive = selectedRole === role.id;
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.id)}
                      className={`relative flex flex-col items-start rounded-3xl border-2 p-4 text-left transition-all duration-300 ${
                        isActive
                          ? `border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-900/5`
                          : `border-transparent bg-white shadow-sm hover:border-emerald-200 hover:shadow-md`
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-3xl border-2 border-emerald-500"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                      <div className={`mb-3 rounded-2xl p-2.5 transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{role.badge}</span>
                      <span className={`mt-1 block text-base font-bold ${isActive ? 'text-emerald-950' : 'text-slate-700'}`}>
                        {role.title}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Login Form */}
              <motion.form 
                variants={itemVariants}
                onSubmit={handleSubmit} 
                className="relative overflow-hidden rounded-[2rem] border border-white bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8"
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeRole.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-8 rounded-2xl border p-5 transition-colors ${activeRole.lightColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm ${activeRole.color}`}>
                        <activeRole.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Signing in as {activeRole.title}</p>
                        <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{activeRole.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@greenery.gov"
                      className="mt-2 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="mt-2 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-200"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoggingIn}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-500 hover:to-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Continue as {activeRole.title}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </motion.form>
              
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}