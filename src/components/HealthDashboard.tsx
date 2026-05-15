import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Heart, Activity, Users, PlusCircle } from 'lucide-react';

const healthData = [
  { region: "Alto do Tietê", value: 10303 },
  { region: "Franco da Rocha", value: 2638 },
  { region: "Mananciais", value: 3919 },
  { region: "Rota dos Bandeirantes", value: 8091 },
  { region: "Grande ABC", value: 9575 },
  { region: "São Paulo", value: 59090 },
  { region: "Cantareira/DRS I", value: 1552 },
  { region: "Central DRS II", value: 920 },
  { region: "Lagos DRS II", value: 1012 },
  { region: "Consórcios DRS II", value: 2080 },
  { region: "Central DRS III", value: 2130 },
  { region: "Coração DRS III", value: 1617 },
  { region: "Noroeste DRS III", value: 7022 },
  { region: "Baixada Santista", value: 3039 },
  { region: "Norte - Barretos", value: 755 },
  { region: "Sul - Barretos", value: 1299 },
  { region: "Vale do Jurumirim", value: 4345 },
  { region: "Bauru", value: 2843 },
  { region: "Polo Cuesta", value: 2400 },
  { region: "Jaú", value: 1125 },
  { region: "Lins", value: 2226 },
  { region: "Bragança", value: 13734 },
  { region: "Metropolitana Campinas", value: 4954 },
  { region: "Jundiaí", value: 906 },
  { region: "Circuito das Águas", value: 2040 },
  { region: "Três Colinas", value: 754 },
  { region: "Alta Anhanguera", value: 462 },
  { region: "Alta Mogiana", value: 792 },
  { region: "Adamantina", value: 1570 },
  { region: "Assis", value: 2889 },
  { region: "Marília", value: 1396 },
  { region: "Ourinhos", value: 956 },
  { region: "Tupã", value: 1288 },
  { region: "Araras", value: 1231 },
  { region: "Limeira", value: 3438 },
  { region: "Piracicaba", value: 1020 },
  { region: "Rio Claro", value: 439 },
  { region: "Alta Paulista", value: 4169 },
  { region: "Alta Sorocabana", value: 405 },
  { region: "Alto Capivari", value: 394 },
  { region: "Extremo Oeste Paulista", value: 302 },
  { region: "Vale do Ribeira", value: 1371 },
  { region: "Horizonte Verde", value: 1203 },
  { region: "Aquífero Guarani", value: 7491 },
  { region: "Vale das Cachoeiras", value: 735 },
  { region: "Baixa Mogiana", value: 2117 },
  { region: "Mantiqueira", value: 1594 },
  { region: "Rio Pardo", value: 1681 },
  { region: "Catanduva", value: 2436 },
  { region: "Santa Fé do Sul", value: 273 },
  { region: "Jales", value: 849 },
  { region: "Fernandópolis", value: 698 },
  { region: "São José do Rio Preto", value: 8034 },
  { region: "José Bonifácio", value: 682 },
  { region: "Votuporanga", value: 1227 },
  { region: "Itapetininga", value: 1925 },
  { region: "Itapeva", value: 1445 },
  { region: "Sorocaba", value: 8422 },
  { region: "Alto Vale do Paraíba", value: 6378 },
  { region: "Circuito da Fé", value: 2423 },
  { region: "Litoral Norte", value: 2718 },
  { region: "Vale do Paraíba Serra", value: 2855 },
].sort((a, b) => b.value - a.value);

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const HealthDashboard: React.FC = () => {
  const top10Regions = healthData.slice(0, 10);
  const totalAIH = healthData.reduce((acc, curr) => acc + curr.value, 0);
  const avgAIH = Math.round(totalAIH / healthData.length);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard de Saúde Pública</h2>
          <p className="text-slate-500 font-medium">Procedimentos Hospitalares (AIH) - São Paulo • Fev/2026</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <Activity size={16} className="text-emerald-500" />
            Sincronizar SIH/SUS
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gov-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-all">
            <PlusCircle size={16} />
            Novo Alerta Epidemiológico
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Heart size={20} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">+4.2%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total AIH Aprovadas</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalAIH.toLocaleString('pt-BR')}</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-tighter">Estável</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Média por CIR</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{avgAIH.toLocaleString('pt-BR')}</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Maior Incidência</p>
          <p className="text-3xl font-black text-slate-900 mt-1 truncate" title="São Paulo">São Paulo</p>
          <p className="text-xs font-medium text-slate-400 mt-1">25.9% do total estadual</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Shield size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status do Sistema</p>
          <p className="text-3xl font-black text-rose-600 mt-1">Alerta</p>
          <p className="text-xs font-medium text-slate-400 mt-1">Processamento SIH pendente em 3 CIRs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Top 10 Regiões de Saúde (CIR)</h3>
              <p className="text-sm text-slate-500">Volume de AIHs aprovadas por local de internação</p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Regions} layout="vertical" margin={{ left: 60, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  scale="band" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  width={150}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toLocaleString(), 'AIHs']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {top10Regions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0f172a' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900">Distribuição Regional</h3>
            <p className="text-sm text-slate-500">Concentração de internações</p>
          </div>
          <div className="h-[300px] w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top10Regions}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {top10Regions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nota Técnica</p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                A Região de São Paulo concentra a maior parte dos procedimentos hospitalares aprovados, 
                representando um desafio logístico e orçamentário para o DRS I.
              </p>
            </div>
            <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-bold hover:shadow-md transition-all">
              Exportar Relatório Detalhado
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Detalhamento por Região de Saúde (CIR)</h3>
            <p className="text-sm text-slate-500">Banco de dados consolidado SIH/SUS - Fev 2026</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filtrar região..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <Activity className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white border-b border-slate-100 shadow-sm z-10">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Região de Saúde (CIR)</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">AIHs Aprovadas</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {healthData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4">
                    <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{item.region}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="font-mono text-slate-600 font-medium">{item.value.toLocaleString('pt-BR')}</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {((item.value / totalAIH) * 100).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;

import { Shield } from 'lucide-react';
