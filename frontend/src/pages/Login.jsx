import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Splash screen timer badha kar 4 seconds (4000ms) kar diya hai
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // 1. SPLASH SCREEN UI
  // ==============================
 // ==============================
  // 1. SPLASH SCREEN UI (UPDATED)
  // ==============================
  if (showSplash) {
    return (
      <div className="relative min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center overflow-hidden z-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[100px]"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Animation - Width/Height badha di (120) */}
          <div className="animate-pop-in">
            <svg width="120" height="120" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#34D399" />
                  <stop offset="50%" stop-color="#10B981" />
                  <stop offset="100%" stop-color="#0F766E" />
                </linearGradient>
                <linearGradient id="glassReflect" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
                  <stop offset="40%" stop-color="#ffffff" stop-opacity="0.05" />
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
                </linearGradient>
                <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#042F2E" flood-opacity="0.4"/>
                </filter>
              </defs>
              <path d="M256 64 C150 64 64 150 64 256 C64 304 81.5 348 110 381 L86 448 L160 417 C189 436 221 448 256 448 C362 448 448 362 448 256 C448 150 362 64 256 64 Z" fill="url(#brandGrad)" filter="url(#softShadow)"/>
              <path d="M256 64 C150 64 64 150 64 256 C64 304 81.5 348 110 381 L86 448 L160 417 C189 436 221 448 256 448 C362 448 448 362 448 256 C448 150 362 64 256 64 Z" fill="url(#glassReflect)"/>
              <rect x="184" y="216" width="24" height="80" rx="12" fill="white" />
              <rect x="244" y="156" width="24" height="200" rx="12" fill="white" />
              <rect x="304" y="236" width="24" height="40" rx="12" fill="white" />
            </svg>
          </div>

          {/* Typewriter Text - Text size bada diya (text-6xl) */}
          <div className="mt-8 flex items-center justify-center">
            <div 
              className="overflow-hidden whitespace-nowrap border-r-[3px] border-emerald-400 pr-1"
              style={{
                animation: 'typing 1.5s steps(10, end) forwards 0.5s, blink 0.75s step-end infinite',
                maxWidth: '0' 
              }}
            >
              <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 tracking-tight pb-2">
                ChatSphere
              </h1>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes typing {
            from { max-width: 0; }
            to { max-width: 400px; } /* max-width badha di (400px) taaki bade text ko space mile */
          }
          @keyframes blink {
            from, to { border-color: transparent; }
            50% { border-color: #34D399; }
          }
          @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in {
            animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}</style>
      </div>
    );
  }

  // ==============================
  // 2. MAIN LOGIN UI
  // ==============================
  return (
    <div className="relative min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4 overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Login Card with Fade In */}
      <div 
        className="relative w-full max-w-[400px] bg-[#0e1524]/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50"
        style={{ animation: 'fadeIn 0.8s ease-out forwards' }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 tracking-tight">
            ChatSphere
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Welcome back, we've missed you! 👋
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
              <FiMail size={18} />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0a0f1a]/50 border border-slate-700/50 text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
              <FiLock size={18} />
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0a0f1a]/50 border border-slate-700/50 text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-medium text-slate-500 hover:text-emerald-400 transition-colors">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Signing In..." : <>Sign In <FiArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Sign up now
          </Link>
        </p>

        {/* Fade In Keyframe */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Login;