import React from 'react';
import { Zap, Cpu, Globe, Database, Server, Timer, Rocket, BarChart } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

const perfData = [
  { time: '00:00', load: 12, performance: 98, latency: 150 },
  { time: '04:00', load: 8, performance: 99, latency: 120 },
  { time: '08:00', load: 35, performance: 95, latency: 210 },
  { time: '12:00', load: 65, performance: 88, latency: 350 },
  { time: '16:00', load: 45, performance: 92, latency: 240 },
  { time: '20:00', load: 25, performance: 96, latency: 180 },
];

const ITStrategy: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Estratégias de TI para Alta Performance</h2>
        <p className="text-slate-500">Otimização de infraestrutura, escalabilidade Cloud e arquitetura de sistemas resilientes.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Uptime Sistema', value: '99.998%', icon: Globe, color: 'text-emerald-500' },
          { label: 'Velocidade DevOps', value: '42 dep/d', icon: Rocket, color: 'text-purple-500' },
          { label: 'Otimização CPU', value: '78%', icon: Cpu, color: 'text-blue-500' },
          { label: 'Tempo Resposta', value: '112ms', icon: Timer, color: 'text-amber-500' },
        ].map((item, i) => (
          <div key={i} className="glass-panel p-4 flex items-center gap-4">
            <div className={cn("p-3 bg-slate-100 rounded-xl", item.color)}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-xl font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Health Index & Load Scaling</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-slate-500">System Load</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-slate-500">Performance Index</span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perfData}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} />
                <Area type="monotone" dataKey="performance" stroke="#10b981" fillOpacity={1} fill="url(#colorPerf)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Server size={18} className="text-slate-400" />
            Infraestrutura Crítica
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold">Cluster Kubernetes Principal</h4>
                <p className="text-xs text-slate-500">12 Nodes ativos • Saúde: 100%</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Estável</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold">Banco de Dados (Sharding)</h4>
                <p className="text-xs text-slate-500">Latency: 12ms • Status: Sincronizado</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Estável</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-amber-900">CDN & Edge Cache</h4>
                <p className="text-xs text-amber-700">Cache hit ratio caído para 72%</p>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Atenção</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 bg-gov-primary text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gov-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Pilar de Inovação de Alta Performance</h3>
            <p className="text-slate-400 text-sm max-w-xl">
              Nossa estratégia foca em CI/CD agressivo, observabilidade total e arquitetura serverless 
              para garantir que a gestão pública nunca sofra interrupções tecnológicas, mesmo em picos massivos de acesso.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-gov-accent">98.4%</p>
              <p className="text-[10px] uppercase font-bold text-slate-500">Automação</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10 self-center" />
            <div className="text-center">
              <p className="text-2xl font-black text-gov-accent">-35%</p>
              <p className="text-[10px] uppercase font-bold text-slate-500">Custo Infra</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITStrategy;
