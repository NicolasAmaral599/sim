import React, { useState, useMemo, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Upload, 
  Filter, 
  BarChart3, 
  AlertCircle,
  Clock,
  School,
  Activity,
  Layers
} from 'lucide-react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'motion/react';

interface EducationData {
  ano: number;
  localizacao: string;
  rede: string;
  // Approval
  taxa_aprovacao_ef: number;
  taxa_aprovacao_em: number;
  // Dropout
  taxa_abandono_ef: number;
  taxa_abandono_em: number;
  // Reprovation
  taxa_reprovacao_ef: number;
  taxa_reprovacao_em: number;
  // Class size (atu)
  atu_ei?: number;
  atu_ef?: number;
  atu_em?: number;
  // Age-grade distortion (tdi)
  tdi_ef?: number;
  tdi_em?: number;
  // Teacher regularity/effort/complexity
  icg_nivel_6?: number;
  ied_em_nivel_6?: number;
}

// Initial sample data based on the provided CSV
const INITIAL_DATA: EducationData[] = [
  { ano: 2011, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 86.3, taxa_aprovacao_em: 75.2, taxa_abandono_ef: 3.2, taxa_abandono_em: 10.8, taxa_reprovacao_ef: 10.5, taxa_reprovacao_em: 14.0, atu_ef: 24.7, atu_em: 32.2, tdi_ef: 25.6, tdi_em: 36.3 },
  { ano: 2012, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 86.9, taxa_aprovacao_em: 76.5, taxa_abandono_ef: 3.0, taxa_abandono_em: 10.4, taxa_reprovacao_ef: 10.1, taxa_reprovacao_em: 13.1, atu_ef: 24.3, atu_em: 31.7, tdi_ef: 24.7, tdi_em: 34.5 },
  { ano: 2013, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 88.0, taxa_aprovacao_em: 78.1, taxa_abandono_ef: 2.6, taxa_abandono_em: 9.2, taxa_reprovacao_ef: 9.4, taxa_reprovacao_em: 12.7, atu_ef: 24.0, atu_em: 31.3, tdi_ef: 23.7, tdi_em: 32.7 },
  { ano: 2014, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 87.8, taxa_aprovacao_em: 78.3, taxa_abandono_ef: 2.6, taxa_abandono_em: 8.6, taxa_reprovacao_ef: 9.6, taxa_reprovacao_em: 13.1, atu_ef: 23.9, atu_em: 31.0, tdi_ef: 22.7, tdi_em: 31.3 },
  { ano: 2015, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 88.5, taxa_aprovacao_em: 79.8, taxa_abandono_ef: 2.3, taxa_abandono_em: 7.8, taxa_reprovacao_ef: 9.2, taxa_reprovacao_em: 12.4, atu_ef: 23.7, atu_em: 30.5, tdi_ef: 21.9, tdi_em: 30.4 },
  { ano: 2016, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 88.3, taxa_aprovacao_em: 79.6, taxa_abandono_ef: 2.2, taxa_abandono_em: 7.5, taxa_reprovacao_ef: 9.5, taxa_reprovacao_em: 12.9, atu_ef: 23.8, atu_em: 30.9, tdi_ef: 21.2, tdi_em: 30.9 },
  { ano: 2017, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 89.6, taxa_aprovacao_em: 81.4, taxa_abandono_ef: 2.0, taxa_abandono_em: 6.8, taxa_reprovacao_ef: 8.4, taxa_reprovacao_em: 11.8, atu_ef: 23.7, atu_em: 30.8, tdi_ef: 20.7, tdi_em: 31.1 },
  { ano: 2018, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 90.2, taxa_aprovacao_em: 81.7, taxa_abandono_ef: 1.7, taxa_abandono_em: 6.9, taxa_reprovacao_ef: 8.1, taxa_reprovacao_em: 11.4, atu_ef: 23.9, atu_em: 30.6, tdi_ef: 19.7, tdi_em: 31.1 },
  { ano: 2019, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 91.7, taxa_aprovacao_em: 84.7, taxa_abandono_ef: 1.4, taxa_abandono_em: 5.3, taxa_reprovacao_ef: 6.9, taxa_reprovacao_em: 10.0, atu_ef: 23.9, atu_em: 29.9, tdi_ef: 18.7, tdi_em: 28.9 },
  { ano: 2020, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 98.4, taxa_aprovacao_em: 94.4, taxa_abandono_ef: 0.8, taxa_abandono_em: 2.3, taxa_reprovacao_ef: 0.8, taxa_reprovacao_em: 3.3, atu_ef: 24.0, atu_em: 30.8, tdi_ef: 17.8, tdi_em: 28.9 },
  { ano: 2021, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 96.3, taxa_aprovacao_em: 89.8, taxa_abandono_ef: 1.5, taxa_abandono_em: 5.6, taxa_reprovacao_ef: 2.2, taxa_reprovacao_em: 4.6, atu_ef: 24.0, atu_em: 30.6, tdi_ef: 15.6, tdi_em: 27.9 },
  { ano: 2022, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 93.3, taxa_aprovacao_em: 85.1, taxa_abandono_ef: 1.3, taxa_abandono_em: 6.5, taxa_reprovacao_ef: 5.4, taxa_reprovacao_em: 8.4, atu_ef: 23.6, atu_em: 29.9, tdi_ef: 13.8, tdi_em: 21.6 },
  { ano: 2023, localizacao: 'total', rede: 'publica', taxa_aprovacao_ef: 85.0, taxa_aprovacao_em: 68.0, taxa_abandono_ef: 2.1, taxa_abandono_em: 19.1, taxa_reprovacao_ef: 5.4, taxa_reprovacao_em: 12.9, atu_ef: 23.4, atu_em: 29.0, tdi_ef: 13.3, tdi_em: 21.6 },
];

const COLORS = ['#0f172a', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const EducationDashboard: React.FC = () => {
  const [data, setData] = useState<EducationData[]>(INITIAL_DATA);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('publica');
  const [selectedLocation, setSelectedLocation] = useState<string>('total');
  const [isUploading, setIsUploading] = useState(false);

  const networks = useMemo(() => Array.from(new Set(data.map(d => d.rede))), [data]);
  const locations = useMemo(() => Array.from(new Set(data.map(d => d.localizacao))), [data]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
     Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: EducationData[] = results.data.map((row: any) => ({
          ano: parseInt(row.ano),
          localizacao: row.localizacao || 'total',
          rede: row.rede || 'total',
          taxa_aprovacao_ef: parseFloat(row.taxa_aprovacao_ef) || 0,
          taxa_aprovacao_em: parseFloat(row.taxa_aprovacao_em) || 0,
          taxa_abandono_ef: parseFloat(row.taxa_abandono_ef) || 0,
          taxa_abandono_em: parseFloat(row.taxa_abandono_em) || 0,
          taxa_reprovacao_ef: parseFloat(row.taxa_reprovacao_ef) || 0,
          taxa_reprovacao_em: parseFloat(row.taxa_reprovacao_em) || 0,
          atu_ef: parseFloat(row.atu_ef) || 0,
          atu_em: parseFloat(row.atu_em) || 0,
          tdi_ef: parseFloat(row.tdi_ef) || 0,
          tdi_em: parseFloat(row.tdi_em) || 0
        })).filter(d => !isNaN(d.ano));

        if (parsedData.length > 0) {
          setData(parsedData);
          if (parsedData[0].rede) setSelectedNetwork(parsedData[0].rede);
          if (parsedData[0].localizacao) setSelectedLocation(parsedData[0].localizacao);
        }
        setIsUploading(false);
      }
    });
  };

  const filteredData = useMemo(() => {
    return data
      .filter(d => d.rede === selectedNetwork && d.localizacao === selectedLocation)
      .sort((a, b) => a.ano - b.ano);
  }, [data, selectedNetwork, selectedLocation]);

  const lastYearData = filteredData[filteredData.length - 1] || filteredData[0];
  const previousYearData = filteredData[filteredData.length - 2] || lastYearData;

  const getEvolution = (current: number, previous: number) => {
    if (!previous) return '0';
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Educação Básica: Brasil</h2>
          <p className="text-slate-500 mt-1">Monitoramento de indicadores de fluxo e qualidade de ensino.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
            <select 
              value={selectedNetwork} 
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="text-xs font-bold text-slate-600 px-3 py-1 outline-none bg-transparent capitalize"
            >
              {networks.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs font-bold text-slate-600 px-3 py-1 outline-none bg-transparent capitalize"
            >
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-gov-primary text-white rounded-lg font-medium cursor-pointer hover:bg-slate-800 transition-all shadow-sm">
            <Upload size={18} />
            <span className="text-sm">{isUploading ? 'Processando...' : 'Atualizar Dados'}</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Taxa de Aprovação (EM)" 
          value={`${lastYearData?.taxa_aprovacao_em || 0}%`}
          evolution={parseFloat(getEvolution(lastYearData?.taxa_aprovacao_em, previousYearData?.taxa_aprovacao_em))}
          icon={<GraduationCap size={24} />}
          color="blue"
        />
        <KPICard 
          title="Taxa de Abandono (EM)" 
          value={`${lastYearData?.taxa_abandono_em || 0}%`}
          evolution={parseFloat(getEvolution(lastYearData?.taxa_abandono_em, previousYearData?.taxa_abandono_em))}
          inverse
          icon={<AlertCircle size={24} />}
          color="rose"
        />
        <KPICard 
          title="Média Alunos/Turma (EM)" 
          value={lastYearData?.atu_em?.toFixed(1) || '0'}
          evolution={parseFloat(getEvolution(lastYearData?.atu_em || 0, previousYearData?.atu_em || 0))}
          inverse
          icon={<Users size={24} />}
          color="indigo"
        />
        <KPICard 
          title="Distorção Idade-Série" 
          value={`${lastYearData?.tdi_em || 0}%`}
          evolution={parseFloat(getEvolution(lastYearData?.tdi_em || 0, previousYearData?.tdi_em || 0))}
          inverse
          icon={<Activity size={24} />}
          color="amber"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-400" />
              <h4 className="font-bold text-slate-900">Evolução do Fluxo Escolar</h4>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ensino Médio</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorAProv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ano" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Area 
                  type="monotone" 
                  dataKey="taxa_aprovacao_em" 
                  name="Aprovação" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAProv)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="taxa_abandono_em" 
                  name="Abandono" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-slate-400" />
              <h4 className="font-bold text-slate-900">Densidade por Turma vs. Distorção</h4>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ano" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="atu_em" name="Alunos por Turma" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="tdi_em" name="Distorção Idade-Série (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-panel p-6">
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            Distribuição por Rede
          </h4>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Federal', value: data.filter(d => d.rede === 'federal' && d.ano === 2023).length || 1 },
                    { name: 'Estadual', value: data.filter(d => d.rede === 'estadual' && d.ano === 2023).length || 1 },
                    { name: 'Municipal', value: data.filter(d => d.rede === 'municipal' && d.ano === 2023).length || 1 },
                    { name: 'Privada', value: data.filter(d => d.rede === 'privada' && d.ano === 2023).length || 1 }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {networks.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
             {networks.slice(0, 4).map((n, i) => (
               <div key={n} className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                   <span className="capitalize text-slate-600">{n}</span>
                 </div>
                 <span className="font-bold">Análise Ativa</span>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-6">
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <School size={18} className="text-slate-400" />
            Insights e Impacto Social
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                   <TrendingUp size={16} />
                 </div>
                 <h5 className="font-bold text-emerald-900 text-sm">Resiliência Pandêmica</h5>
               </div>
               <p className="text-xs text-emerald-700 leading-relaxed">
                 Os dados de 2020 e 2021 mostram um aumento atípico nas taxas de aprovação (saltando de 84% para 98%), refletindo políticas de aprovação automática durante o ensino remoto. É necessário avaliar a perda de aprendizagem.
               </p>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                   <AlertCircle size={16} />
                 </div>
                 <h5 className="font-bold text-rose-900 text-sm">Risco de Evasão</h5>
               </div>
               <p className="text-xs text-rose-700 leading-relaxed">
                 {lastYearData?.taxa_abandono_em > 5 ? 'Alerta crítico: ' : ''}
                 A taxa de abandono no Ensino Médio ({lastYearData?.taxa_abandono_em}%) ainda é um gargalo para a universalização do ensino. Regiões rurais costumam apresentar taxas 2.4x maiores que urbanas.
               </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                   <Users size={16} />
                 </div>
                 <h5 className="font-bold text-blue-900 text-sm">Qualidade do Ambiente</h5>
               </div>
               <p className="text-xs text-blue-700 leading-relaxed">
                 A média de {lastYearData?.atu_em?.toFixed(1)} alunos por turma indica um cenário próximo ao ideal para interação pedagógica (meta: máx 30). Redes privadas mantêm média inferior a 25 alunos.
               </p>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                   <BarChart3 size={16} />
                 </div>
                 <h5 className="font-bold text-indigo-900 text-sm">Distorção Idade-Série</h5>
               </div>
               <p className="text-xs text-indigo-700 leading-relaxed">
                 Houve uma redução consistente na TDI ao longo da última década (de 36% em 2011 para 21% em 2023). Isso indica uma melhoria na progressão escolar, embora o impacto da pandemia ainda reverbere.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  evolution: number;
  icon: React.ReactNode;
  color: 'blue' | 'rose' | 'emerald' | 'indigo' | 'amber';
  inverse?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, evolution, icon, color, inverse }) => {
  const isPositive = evolution > 0;
  const isGood = inverse ? !isPositive : isPositive;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    rose: 'bg-rose-100 text-rose-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
          isGood ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        )}>
          {isPositive ? '↑' : ''} {evolution}%
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default EducationDashboard;
