import React from 'react';
import { 
  Terminal, 
  Database, 
  Code, 
  Activity, 
  Server, 
  ShieldAlert 
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

const perfData = [
  { time: '00:00', cpu: 12, ram: 45, latency: 150 },
  { time: '04:00', cpu: 8, ram: 42, latency: 120 },
  { time: '08:00', cpu: 35, ram: 65, latency: 210 },
  { time: '12:00', cpu: 65, ram: 82, latency: 350 },
  { time: '16:00', cpu: 45, ram: 70, latency: 240 },
  { time: '20:00', cpu: 25, ram: 55, latency: 180 },
];

const DevDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Developer Console</h2>
          <p className="text-slate-500">System architecture, API health, and infrastructure monitoring.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1">
            <Terminal size={12} /> Debug Mode: ON
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Code size={20} />
            </div>
            <h3 className="font-bold">API Status</h3>
          </div>
          <div className="text-3xl font-bold text-indigo-600">v2.4.0-stable</div>
          <p className="text-xs text-slate-500 mt-1">All endpoints operational</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Database size={20} />
            </div>
            <h3 className="font-bold">Database Load</h3>
          </div>
          <div className="text-3xl font-bold text-emerald-600">12%</div>
          <p className="text-xs text-slate-500 mt-1">Supabase connection healthy</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-rose-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <h3 className="font-bold">Security Scans</h3>
          </div>
          <div className="text-3xl font-bold text-rose-600">Passed</div>
          <p className="text-xs text-slate-500 mt-1">Last scan: 2h ago</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity size={18} className="text-slate-400" />
          Infrastructure Performance
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={perfData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="cpu" stroke="#6366f1" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Server size={18} className="text-slate-400" />
            Active Microservices
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Auth Service', status: 'healthy', version: '1.2.0' },
              { name: 'Data Processor', status: 'healthy', version: '0.9.5' },
              { name: 'Reporting Engine', status: 'warning', version: '2.1.0' },
              { name: 'Notification Hub', status: 'healthy', version: '1.0.2' },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    service.status === 'healthy' ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  <span className="text-sm font-medium text-slate-900">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">v{service.version}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase",
                    service.status === 'healthy' ? "text-emerald-600" : "text-amber-600"
                  )}>{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 bg-slate-900 text-white">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-400">
            <Terminal size={18} />
            System Logs
          </h3>
          <div className="font-mono text-[10px] space-y-1 opacity-80">
            <p className="text-emerald-400">[2026-03-25 15:04:54] INFO: Supabase connection established.</p>
            <p className="text-emerald-400">[2026-03-25 15:05:12] INFO: Auth session validated for user ID: 8a2f...</p>
            <p className="text-amber-400">[2026-03-25 15:06:45] WARN: High latency detected in Reporting Engine.</p>
            <p className="text-emerald-400">[2026-03-25 15:07:01] INFO: Cache cleared successfully.</p>
            <p className="text-blue-400">[2026-03-25 15:08:22] DEBUG: Rendering DevDashboard component.</p>
            <p className="text-slate-500">_</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../lib/utils';
export default DevDashboard;
