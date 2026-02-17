
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Disc, Cpu, UserCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Login() {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Pro-fix: Redirect already authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = 
        user.role === Role.ADMIN ? '/admin' : 
        user.role === Role.BAKER ? '/kds' : 
        user.role === Role.DRIVER ? '/logistics' : '/';
      
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (role: Role) => {
    try {
      await login(role);
      toast.success(`Access_Granted: ${role}_PROTOCOL_ACTIVE`);
    } catch (error) {
      toast.error("AUTH_LINK_FAILURE: Verifique credenciales de red.");
    }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col justify-center items-center p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.05),transparent_70%)] pointer-events-none"></div>
      
      {/* Decorative Branding */}
      <div className="mb-24 text-center animate-fadeIn relative z-10">
        <Disc className="text-neon-green mx-auto mb-8 animate-spin-slow opacity-80" size={48} strokeWidth={1} />
        <h1 className="text-6xl font-serif italic text-white tracking-tighter mb-4">JIRETH_NEXUS</h1>
        <p className="text-[10px] font-mono text-atelier-500 uppercase tracking-[1em]">Secure_Access_Portal.v4</p>
      </div>

      <div className="max-w-md w-full space-y-4 relative z-10">
        <LoginButton 
          icon={<Fingerprint size={24}/>} 
          title="DIRECTOR_CORE" 
          desc="Administrative & Financial Modules"
          color="text-neon-violet border-neon-violet/10 hover:bg-neon-violet/5"
          onClick={() => handleLogin(Role.ADMIN)}
          loading={isLoading}
        />
        <LoginButton 
          icon={<Cpu size={24}/>} 
          title="ARTISAN_PROTOCOL" 
          desc="Production & Molecular Synthesis"
          color="text-neon-green border-neon-green/10 hover:bg-neon-green/5"
          onClick={() => handleLogin(Role.BAKER)}
          loading={isLoading}
        />
        <LoginButton 
          icon={<UserCheck size={24}/>} 
          title="CLIENT_NODE" 
          desc="Exploration & Design Studio"
          color="text-neon-blue border-neon-blue/10 hover:bg-neon-blue/5"
          onClick={() => handleLogin(Role.CLIENT)}
          loading={isLoading}
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-void/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
           <Loader2 className="text-neon-green animate-spin" size={40} />
           <p className="text-[10px] font-mono text-neon-green uppercase tracking-[0.5em]">Establishing_Neural_Link...</p>
        </div>
      )}

      <div className="mt-32 opacity-20 flex gap-10">
         <span className="text-[8px] font-mono uppercase tracking-widest text-white">SSL: ENCRYPTED</span>
         <span className="text-[8px] font-mono uppercase tracking-widest text-white">DB: SYNCED</span>
         <span className="text-[8px] font-mono uppercase tracking-widest text-white">AI: CONNECTED</span>
      </div>
    </div>
  );
}

function LoginButton({ icon, title, desc, color, onClick, loading }: any) {
  return (
    <button 
      disabled={loading}
      onClick={onClick}
      className={`w-full flex items-center p-6 bg-atelier-900/30 border transition-all duration-500 group disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
    >
      <div className="mr-6 group-hover:scale-110 transition-transform duration-700">
        {icon}
      </div>
      <div className="text-left flex-1">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-1 group-hover:text-current">{title}</h3>
        <p className="text-[10px] text-atelier-500 uppercase tracking-widest leading-none">{desc}</p>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-current transition-colors"></div>
    </button>
  );
}
