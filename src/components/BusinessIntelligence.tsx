import React from 'react';
import { BarChart3, PieChart, TrendingUp, Filter, Download, Database, Layers, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'Mai', value: 500 },
  { name: 'Jun', value: 900 },
];

const pieData = [
  { name: 'Infraestrutura', value: 35 },
  { name: 'Segurança', value: 25 },
  { name: 'Sistemas', value: 25 },
  { name: 'Suporte', value: 15 },
];

const COLORS = ['#0f172a', '#10b981', '#3b82f6', '#f59e0b'];

const BusinessIntelligence: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Business Intelligence Avançado</h2>
          <p className="text-slate-500">Análise de dados multidimensional e visualização estratégica de ativos de TI.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gov-primary text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Volume de Dados', value: '14.2 TB', delta: '+12%', icon: Database, color: 'text-blue-500' },
          { label: 'Queries / Segmento', value: '1.2M', delta: '+5%', icon: Layers, color: 'text-emerald-500' },
          { label: 'Previsão ROI TI', value: '245%', delta: '+2%', icon: TrendingUp, color: 'text-amber-500' },
          { label: 'Modelos IA Ativos', value: '12', delta: '0%', icon: Brain, color: 'text-indigo-500' },
        ].map((item, i) => (
          <div key={i} className="glass-panel p-4 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className={cn("p-2 bg-slate-100 rounded-lg", item.color)}>
                <item.icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {item.delta}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-black text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-slate-400" />
            Tendência de Eficiência Operacional
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0f172a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-slate-400" />
            Distribuição de Custos TI
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../lib/utils';
export default BusinessIntelligence;
