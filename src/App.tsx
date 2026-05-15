import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DevDashboard from './components/DevDashboard';
import Governance from './components/Governance';
import Performance from './components/Performance';
import DecisionSupport from './components/DecisionSupport';
import BusinessIntelligence from './components/BusinessIntelligence';
import SecurityDashboard from './components/SecurityDashboard';
import HealthDashboard from './components/HealthDashboard';
import MobilityDashboard from './components/MobilityDashboard';
import EducationDashboard from './components/EducationDashboard';
import SanitationDashboard from './components/SanitationDashboard';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<'cliente' | 'dev' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSignUpInitial = searchParams.get('signup') === 'true';

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      const role = data?.role as 'cliente' | 'dev';
      setUserRole(role);
      
      // Initial redirection based on role
      if (role === 'dev') {
        setActiveTab('dev-dashboard');
      } else {
        setActiveTab('dashboard');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('cliente'); // Fallback
    }
  };

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userRole) {
      setLoading(false);
    }
  }, [userRole]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const renderContent = () => {
    // Route protection
    if (activeTab === 'dev-dashboard' && userRole !== 'dev') {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Acesso Negado</h2>
          <p className="text-slate-500 max-w-md">Você não tem permissão para acessar o Console de Desenvolvedor.</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="px-6 py-2 bg-gov-primary text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'dev-dashboard':
        return <DevDashboard />;
      case 'governance':
        return <Governance />;
      case 'performance':
        return <Performance />;
      case 'leadership':
        return <DecisionSupport />;
      case 'bi':
        return <BusinessIntelligence />;
      default:
        if (activeTab === 'sector-security') {
          return <SecurityDashboard />;
        }
        if (activeTab === 'sector-health') {
          return <HealthDashboard />;
        }
        if (activeTab === 'sector-education') {
          return <EducationDashboard />;
        }
        if (activeTab === 'sector-transport') {
          return <MobilityDashboard />;
        }
        if (activeTab === 'sector-sanitation') {
          return <SanitationDashboard />;
        }
        if (activeTab.startsWith('sector-')) {
          const sector = activeTab.replace('sector-', '');
          return (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 capitalize">Setor: {sector}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 h-64 flex items-center justify-center text-slate-400 italic">
                  Visualizações específicas de {sector} em desenvolvimento...
                </div>
                <div className="glass-panel p-6 h-64 flex items-center justify-center text-slate-400 italic">
                  KPIs de impacto social para {sector}...
                </div>
              </div>
            </div>
          );
        }
        return <Dashboard />;
    }
  };

  const MainApp = () => (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole || 'cliente'} onLogout={handleLogout} />
      
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden group relative cursor-pointer">
              <img 
                src={session?.user?.user_metadata?.avatar_url || `https://picsum.photos/seed/${session?.user?.id}/100/100`} 
                alt="User" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div 
                onClick={handleLogout}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-[8px] text-white font-bold uppercase">Sair</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {userRole === 'dev' ? 'Developer' : 'Gestor Público'}
              </p>
              <p className="text-sm font-bold text-slate-900">{session?.user?.email?.split('@')[0]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full" />
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </button>
            </div>
            {userRole === 'dev' && (
              <button className="px-4 py-2 bg-gov-primary text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                Novo Relatório
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <p>© 2026 InsightGov - Projeto Acadêmico de Gestão Pública Inteligente</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacidade & LGPD</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Suporte Técnico</a>
          </div>
        </footer>
      </main>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          session ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={() => navigate('/dashboard')} initialIsSignUp={isSignUpInitial} />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          session ? <MainApp /> : <Navigate to="/login" replace />
        } 
      />
      {/* Catch all redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
