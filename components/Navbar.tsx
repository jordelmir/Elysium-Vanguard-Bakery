
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Disc, LogOut, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const { cart } = useStore();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${isScrolled ? 'py-4 px-8' : 'py-10 px-12'}`}>
      <div className={`max-w-[1700px] mx-auto flex items-center justify-between px-8 py-4 transition-all ${isScrolled ? 'glass-card border border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        
        <Link to="/" className="flex items-center gap-4 group">
          <Disc className="text-neon-green group-hover:rotate-180 transition-transform duration-1000" size={24} />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-[0.3em] text-white">JIRETH<span className="text-neon-green">_N</span></span>
            <span className="text-[7px] font-mono text-atelier-500 uppercase tracking-[0.5em]">Nexus.Atelier_01</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-12">
          {user.role === Role.CLIENT && (
            <>
              <NavLink to="/" label="Atelier" active={location.pathname === '/'} />
              <NavLink to="/studio" label="Lab_IA" active={location.pathname === '/studio'} />
              <NavLink to="/orders" label="Registros" active={location.pathname === '/orders'} />
              <NavLink to="/profile" label="Identidad" active={location.pathname === '/profile'} />
            </>
          )}
          {(user.role === Role.BAKER || user.role === Role.ADMIN) && (
            <>
              <NavLink to="/kds" label="Producción" active={location.pathname === '/kds'} />
              <NavLink to="/admin" label="Métricas" active={location.pathname === '/admin'} />
              <NavLink to="/inventory" label="Materia" active={location.pathname === '/inventory'} />
            </>
          )}
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden sm:flex items-center gap-4 pr-8 border-r border-white/5">
              <div className="text-right">
                 <p className="text-[9px] font-mono text-atelier-500 uppercase tracking-widest">{user.role}</p>
                 <p className="text-[10px] font-bold text-white uppercase tracking-widest">{user.name}</p>
              </div>
              <button onClick={logout} className="text-atelier-500 hover:text-white transition-colors">
                <LogOut size={16} />
              </button>
           </div>
           
           {user.role === Role.CLIENT && (
             <button onClick={onOpenCart} className="relative group p-2">
                <ShoppingBag size={20} className="text-atelier-500 group-hover:text-neon-green transition-colors" />
                {cart.length > 0 && (
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-green text-black text-[8px] font-black flex items-center justify-center rounded-full">
                     {cart.length}
                   </span>
                )}
             </button>
           )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, active }: { to: string, label: string, active: boolean }) {
  return (
    <Link to={to} className={`text-[10px] font-mono font-bold uppercase tracking-[0.4em] transition-all relative py-2 ${active ? 'text-neon-green' : 'text-atelier-500 hover:text-white'}`}>
      {label}
      {active && <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-neon-green shadow-[0_0_10px_#bfff00]"></span>}
    </Link>
  );
}
