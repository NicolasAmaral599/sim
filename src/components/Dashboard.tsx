import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  AlertCircle,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Saúde', value: 45, budget: 1200000, efficiency: 88 },
  { name: 'Educação', value: 30, budget: 950000, efficiency: 92 },
  { name: 'Segurança', value: 15, budget: 600000, efficiency: 75 },
  { name: 'Transporte', value: 7, budget: 450000, efficiency: 82 },
  { name: 'Outros', value: 3, budget: 200000, efficiency: 95 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Executive IT Insights</h2>
          <p className="text-slate-500">Gestão estratégica de tecnologia, governança e performance de infraestrutura.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
            <Activity size={12} /> Infraestrutura Ativa
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
            Real-time Monitoring
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Investimento em Inovação', value: 'R$ 12.4M', change: '+18.5%', icon: DollarSign, trend: 'up' },
          { label: 'Maturidade de Governança', value: 'Nível 4.2', change: '+0.5', icon: ShieldCheck, trend: 'up' },
          { label: 'Disponibilidade (SLA)', value: '99.998%', change: '+0.01%', icon: Activity, trend: 'up' },
          { label: 'Projetos Estratégicos', value: '24', change: 'Estável', icon: Briefcase, trend: 'neutral' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass-panel p-6"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <stat.icon size={20} />
              </div>
              <span className={cn(
                "text-xs font-bold flex items-center gap-0.5",
                stat.trend === 'up' ? "text-emerald-600" : stat.trend === 'down' ? "text-rose-600" : "text-slate-500"
              )}>
                {stat.trend === 'up' && <TrendingUp size={12} />}
                {stat.trend === 'down' && <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Budget de TI por Setor de Governo</h3>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1">
              <option>Últimos 12 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="budget" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-6">Distribuição de Ativos (Cloud vs On-Prem)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {data.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-4">Eficiência Infraestrutura (IT Strategy)</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-4">Alertas de Governança & LGPD</h3>
          <div className="space-y-4">
            {[
              { title: 'Auditoria de Dados - Saúde', status: 'compliant', time: '2h atrás' },
              { title: 'Vazamento de Dados Detectado', status: 'critical', time: '5h atrás' },
              { title: 'Conformidade LGPD - Educação', status: 'warning', time: '1d atrás' },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    alert.status === 'compliant' ? "bg-emerald-500" : alert.status === 'warning' ? "bg-amber-500" : "bg-rose-500"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                    <p className="text-[10px] text-slate-500">{alert.time}</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-indigo-600 hover:underline">Ver Detalhes</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../lib/utils';
export default Dashboard;
