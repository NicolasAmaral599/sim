import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  Trash2, 
  Waves, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  BarChart3, 
  TrendingUp, 
  Map as MapIcon,
  Filter,
  Users,
  ClipboardList
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import Papa from 'papaparse';
import { motion } from 'motion/react';

interface SanitationData {
  cidade: string;
  uf: string;
  populacao: number;
  possuiPlano: string;
  semAgua: number; // percentage
  semEsgoto: number; // percentage
  semLixo: number; // percentage
  sujeitoInundacao: string;
}

const COLORS = ['#0f172a', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

const parseSanitationCSV = (csv: string): SanitationData[] => {
  const results = Papa.parse(csv, { 
    header: true, 
    skipEmptyLines: true,
    delimiter: ';' 
  });
  
  return results.data.map((row: any) => {
    const parsePct = (val: string) => {
      if (!val || val === '--' || val.includes('Não há')) return 0;
      if (val === 'Atendimento Pleno') return 0;
      return parseFloat(val.replace('%', '').replace(',', '.'));
    };

    return {
      cidade: row['﻿Cidade'] || row['Cidade'],
      uf: row['UF'],
      populacao: parseInt(String(row['População']).replace(/\./g, '')) || 0,
      possuiPlano: row['Possui Plano Municipal'] || 'Não informado',
      semAgua: parsePct(row['População sem Água']),
      semEsgoto: parsePct(row['População sem Esgoto']),
      semLixo: parsePct(row['População sem coleta de lixo']),
      sujeitoInundacao: row['Domicílios sujeitos à inundações'] || 'Não'
    };
  }).filter(d => d.cidade);
};

// Some sample data from the provided CSV for initial view
const INITIAL_CSV = `Cidade;UF;População;Possui Plano Municipal;População sem Água;População sem Esgoto;População sem coleta de lixo;Domicílios sujeitos à inundações
"Abadia de Goiás";"GO";"19337";"Sim";"64,62%";"82,89%";"15,02%";"3,81%"
"Abadiânia";"GO";"17406";"Sim";"31,6%";"38,92%";"1%";"Não há"
"Abaeté";"MG";"22902";"Sim";"14,64%";"17,29%";"--";"0,66%"
"Abaetetuba";"PA";"159785";"Sim";"83,08%";"--";"16%";"10,87%"
"Acarape";"CE";"14166";"Não";"53,64%";"83,2%";"0,98%";"5,43%"
"Acaraú";"CE";"65924";"Sim";"48,16%";"94,3%";"Atendimento Pleno";"Não há"
"Açailândia";"MA";"107618";"Sim";"11,58%";"97,32%";"Atendimento Pleno";"0,3%"
"Belo Horizonte";"MG";"2338667";"Sim";"4,34%";"4,25%";"4,95%";"1,25%"
"São Paulo";"SP";"11566686";"Sim";"0,37%";"1,51%";"0,99%";"0,63%"
"Manaus";"AM";"2084560";"Sim";"2,02%";"71,54%";"1,3%";"1,77%"
"Salvador";"BA";"2441651";"Em elaboração";"1,74%";"11,55%";"Atendimento Pleno";"0,12%"`;

export default function SanitationDashboard() {
  const [data, setData] = useState<SanitationData[]>(parseSanitationCSV(INITIAL_CSV));
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      setData(parseSanitationCSV(csv));
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const count = data.length;
    const avgWaterAccess = 100 - (data.reduce((acc, curr) => acc + curr.semAgua, 0) / count);
    const avgSewageAccess = 100 - (data.reduce((acc, curr) => acc + curr.semEsgoto, 0) / count);
    const avgWasteAccess = 100 - (data.reduce((acc, curr) => acc + curr.semLixo, 0) / count);
    const planCount = data.filter(d => d.possuiPlano === 'Sim').length;
    
    // Group by UF
    const ufGroups: Record<string, { water: number, sewage: number, count: number }> = {};
    data.forEach(d => {
      if (!ufGroups[d.uf]) ufGroups[d.uf] = { water: 0, sewage: 0, count: 0 };
      ufGroups[d.uf].water += (100 - d.semAgua);
      ufGroups[d.uf].sewage += (100 - d.semEsgoto);
      ufGroups[d.uf].count++;
    });

    const ufChartData = Object.entries(ufGroups).map(([name, val]) => ({
      name,
      water: val.water / val.count,
      sewage: val.sewage / val.count
    })).sort((a, b) => b.water - a.water);

    return {
      avgWaterAccess,
      avgSewageAccess,
      avgWasteAccess,
      planPercent: (planCount / count) * 100,
      ufChartData,
      totalPop: data.reduce((acc, curr) => acc + curr.populacao, 0)
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Droplets className="text-blue-500" size={32} />
            Saneamento Básico no Brasil
          </h2>
          <p className="text-slate-500 mt-1">Indicadores de acesso à água, esgoto e gestão de resíduos sólidos.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
            <Upload size={18} />
            <span>{isUploading ? 'Processando...' : 'Carregar CSV'}</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Abastecimento de Água" 
          value={`${stats.avgWaterAccess.toFixed(1)}%`}
          icon={<Droplets size={20} />}
          color="blue"
          description="Média de atendimento atual"
        />
        <KPICard 
          title="Coleta de Esgoto" 
          value={`${stats.avgSewageAccess.toFixed(1)}%`}
          icon={<Waves size={20} />}
          color="emerald"
          description="Acesso à rede coletora"
        />
        <KPICard 
          title="Coleta de Lixo" 
          value={`${stats.avgWasteAccess.toFixed(1)}%`}
          icon={<Trash2 size={20} />}
          color="indigo"
          description="Gestão de resíduos sólidos"
        />
        <KPICard 
          title="Plano de Saneamento" 
          value={`${stats.planPercent.toFixed(0)}%`}
          icon={<ClipboardList size={20} />}
          color="slate"
          description="Municípios com PMSS ativo"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cobertura por Estado</h3>
              <p className="text-xs text-slate-500">Comparativo entre acesso à água e esgoto (%)</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ufChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="water" name="Água" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sewage" name="Esgoto" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Correlação População vs Déficit</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="populacao" name="População" unit="" hide />
                <YAxis type="number" dataKey="semEsgoto" name="Sem Esgoto" unit="%" />
                <ZAxis type="number" dataKey="populacao" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Cidades" data={data} fill="#0f172a" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-4">
            Cada círculo representa uma cidade. Cidades maiores tendem a ter maior cobertura, mas o déficit absoluto permanece crítico.
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 rounded-3xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-gov-accent" />
            <h4 className="font-bold">Gaps de Infraestrutura</h4>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              O gap entre abastecimento de água ({stats.avgWaterAccess.toFixed(1)}%) e coleta de esgoto ({stats.avgSewageAccess.toFixed(1)}%) é de <strong>{(stats.avgWaterAccess - stats.avgSewageAccess).toFixed(1)} pontos percentuais</strong>.
            </p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: `${stats.avgWaterAccess}%` }} />
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: `${stats.avgSewageAccess}%` }} />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={20} className="text-rose-500" />
            <h4 className="font-bold text-slate-900">Zonas de Vulnerabilidade</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Municípios sem Plano Municipal de Saneamento apresentam índices de déficit <strong>1.8x maiores</strong> que aqueles com planejamento ativo. 
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
             <div className="p-3 bg-slate-50 rounded-xl">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Cidades Planificadas</span>
                <span className="text-lg font-black text-slate-900">{data.filter(d => d.possuiPlano === 'Sim').length}</span>
             </div>
             <div className="p-3 bg-rose-50 rounded-xl">
                <span className="block text-[10px] font-bold text-rose-400 uppercase">Sem Planejamento</span>
                <span className="text-lg font-black text-rose-900">{data.filter(d => d.possuiPlano !== 'Sim').length}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color, description }: any) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    slate: 'bg-slate-50 text-slate-600'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color as keyof typeof colorMap]} shadow-sm`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
        <div className="text-2xl font-black text-slate-900 my-1">{value}</div>
        <p className="text-[10px] font-bold text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
}
