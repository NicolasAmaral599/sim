import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  UserCheck, 
  Settings, 
  BarChart3,
  Heart,
  BookOpen,
  Shield,
  Bus,
  Droplets,
  Terminal,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'cliente' | 'dev';
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Insights', icon: LayoutDashboard, category: 'Main' },
    { id: 'bi', label: 'Business Intelligence', icon: BarChart3, category: 'Main' },
    { id: 'governance', label: 'IT Governance & Policies', icon: ShieldCheck, category: 'IT Pillars' },
    { id: 'performance', label: 'High Performance IT', icon: Zap, category: 'IT Pillars' },
    { id: 'leadership', label: 'Executive Leadership', icon: UserCheck, category: 'IT Pillars' },
    { id: 'dev-dashboard', label: 'Developer Console', icon: Terminal, category: 'Dev', hidden: userRole !== 'dev' },
  ];

  const sectors = [
    { id: 'health', label: 'Saúde', icon: Heart },
    { id: 'education', label: 'Educação', icon: BookOpen },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'transport', label: 'Transporte', icon: Bus },
    { id: 'sanitation', label: 'Saneamento', icon: Droplets },
  ];

  return (
    <div className="w-64 h-screen bg-gov-primary text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-gov-accent rounded-lg flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          InsightGov
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">Gestão Pública Inteligente</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Visão Geral</p>
          <nav className="space-y-1">
            {menuItems.filter(i => i.category === 'Main' && !i.hidden).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {userRole === 'dev' && (
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Developer Tools</p>
            <nav className="space-y-1">
              {menuItems.filter(i => i.category === 'Dev' && !i.hidden).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === item.id 
                      ? "bg-indigo-500/20 text-indigo-400" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Estratégias e Pilares de TI</p>
          <nav className="space-y-1">
            {menuItems.filter(i => i.category === 'IT Pillars').map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Setores Atendidos</p>
          <nav className="space-y-1">
            {sectors.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(`sector-${item.id}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === `sector-${item.id}` 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <Settings size={18} />
          Configurações
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut size={18} />
          Voltar ao Login
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
