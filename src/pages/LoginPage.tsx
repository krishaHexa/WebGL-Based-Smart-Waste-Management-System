import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck, Building2, Truck, Camera, Navigation, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import BrandLogo from '../components/shared/BrandLogo';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleDemoLogin = async (e: string) => {
    setEmail(e);
    setPassword('ksa2025');
    setIsLoading(true);
    try {
      const success = await login(e, 'ksa2025');
      if (success) navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password. Use demo accounts or ksa2025 for passwords.');
      }
    } catch (err) {
      setError('An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { 
      label: 'Super Admin', 
      email: 'admin@smartwaste.sa', 
      icon: ShieldCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'System Oversight'
    },
    { 
      label: 'Facility Manager', 
      email: 'facility@smartwaste.sa', 
      icon: Building2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Hub Operations'
    },
    { 
      label: 'Fleet Manager', 
      email: 'fleet@smartwaste.sa', 
      icon: Truck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Logistics Control'
    },
    { 
      label: 'CCTV Operator', 
      email: 'cctv@smartwaste.sa', 
      icon: Camera,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Surveillance'
    },
    { 
      label: 'Driver', 
      email: 'driver@smartwaste.sa', 
      icon: Navigation,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Route Response'
    },
    { 
      label: 'Citizen', 
      email: 'citizen@ksa.sa', 
      icon: Users,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      description: 'Public Services'
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-slate-50 font-sans">
      {/* Left Side - Visual/Branding */}
      <div className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden p-8 lg:p-12 text-white md:flex">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2606&auto=format&fit=crop" 
            className="h-full w-full object-cover"
            alt="Modern Infrastructure"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-900/80 to-slate-900 opacity-90" />
          
          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <BrandLogo theme="glass" size="lg" />
          <div>
            <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white uppercase">KSA Smart Waste</h1>
            <p className="text-[9px] lg:text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none">Management Platform</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 backdrop-blur-sm px-3 py-1 text-[10px] font-black tracking-widest text-blue-300 border border-blue-500/20 uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Vision 2030 Integrated
          </div>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight uppercase tracking-tighter">
            Digitalizing <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic">Urban Sustainability.</span>
          </h2>
          <p className="max-w-md text-base lg:text-lg text-slate-300 font-medium leading-relaxed">
            Enterprise-grade waste infrastructure tracking and real-time operational intelligence for the Kingdom's evolving smart cities.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          <span>&copy; 2026 KSA Smart Waste Authority</span>
          <div className="h-1 w-1 rounded-full bg-slate-700" />
          <span>Government Enterprise Node</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-6 md:w-[450px] lg:w-[550px] xl:w-[650px] shrink-0">
        <div className="w-full max-w-sm space-y-6 sm:space-y-8">
          <div className="text-center md:text-left">
            <div className="mb-6 flex justify-center md:hidden">
              <BrandLogo theme="dark" size="lg" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 md:text-4xl uppercase tracking-tight">Access Control</h2>
            <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">Enter your authorization credentials or select a specialized role profile to proceed.</p>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3">
            {demoAccounts.map(account => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email)}
                className={cn(
                  "group flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border border-slate-100 transition-all duration-300 text-left",
                  "bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 hover:-translate-y-1"
                )}
              >
                <div className={cn("p-1.5 sm:p-2 rounded-xl mb-2 sm:mb-3 transition-colors group-hover:scale-110 duration-300", account.bgColor, account.color)}>
                  <account.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="w-full">
                  <div className="text-[9px] sm:text-[10px] font-black text-slate-950 uppercase tracking-widest leading-none mb-1 truncate">{account.label}</div>
                  <div className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full">{account.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-4 text-slate-400 font-black tracking-widest">or direct entry</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl bg-red-50 p-4 text-[11px] font-black text-red-600 border border-red-100 uppercase tracking-wide"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
                  placeholder="name@smartwaste.sa"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Reset</button>
              </div>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-xs font-bold text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-300"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 py-4 text-center text-xs font-black text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-slate-900/20 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Node...</span>
                </>
              ) : (
                <span>Access Workspace</span>
              )}
            </button>
          </form>

          <div className="relative pt-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-medium tracking-wider">Access Requirements</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 grayscale opacity-50 grayscale-0 transition-opacity">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Saudi_Arabia.svg" className="h-4" alt="KSA" />
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400">VISION 2030</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
