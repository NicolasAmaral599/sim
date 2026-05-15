import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  Activity, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  Upload,
  BarChart3,
  Calendar,
  Zap,
  GanttChart
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
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { motion } from 'motion/react';
import Papa from 'papaparse';

interface CrimeNature {
  natureza: string;
  monthly: number[];
  total: number;
}

const SEED_DATA_RAW = `Natureza,Janeiro,Fevereiro,Marco,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro,Total
HOMICÍDIO DOLOSO (2),215,201,225,197,190,212,197,189,191,191,186,244,2.438
HOMICÍDIO DOLOSO POR ACIDENTE DE TRÂNSITO,3,2,1,5,1,4,6,1,2,3,3,2,33
HOMICÍDIO CULPOSO POR ACIDENTE DE TRÂNSITO,296,274,368,292,389,323,339,344,334,297,272,327,3.855
HOMICÍDIO CULPOSO OUTROS,14,12,10,8,21,12,11,10,22,17,15,16,168
TENTATIVA DE HOMICÍDIO,319,336,325,293,341,299,305,338,278,320,283,348,3.785
LESÃO CORPORAL SEGUIDA DE MORTE,7,15,12,17,17,14,9,8,10,2,3,8,122
LESÃO CORPORAL DOLOSA,13.607,13.922,15.122,13.038,12.913,12.021,12.140,13.860,14.735,14.206,13.680,15.802,165.046
LESÃO CORPORAL CULPOSA POR ACIDENTE DE TRÂNSITO,5.221,5.582,6.041,6.068,6.368,5.997,6.335,6.415,6.756,6.325,5.597,5.961,72.666
LESÃO CORPORAL CULPOSA - OUTRAS,219,234,245,208,242,300,262,279,312,334,283,266,3.184
LATROCÍNIO,18,10,10,13,7,11,15,8,9,8,11,9,129
TOTAL DE ESTUPRO (4),1.286,1.201,1.375,1.174,1.183,1.035,1.132,1.253,1.311,1.248,1.157,1.088,14.443
ESTUPRO,307,291,332,251,273,250,246,293,300,288,281,287,3.399
ESTUPRO DE VULNERÁVEL,979,910,1.043,923,910,785,886,960,1.011,960,876,801,11.044
TOTAL DE ROUBO - OUTROS (1),15.972,14.208,15.041,13.981,13.437,12.891,14.001,13.235,12.766,12.368,11.631,11.779,161.310
ROUBO - OUTROS,15.622,13.889,14.739,13.646,13.129,12.648,13.750,12.978,12.470,12.074,11.384,11.509,157.838
ROUBO DE VEÍCULO,2.312,2.250,2.386,2.057,2.200,1.985,2.020,1.976,2.016,2.004,1.907,1.911,25.024
ROUBO A BANCO,0,0,0,1,0,0,1,0,0,0,0,0,2
ROUBO DE CARGA,350,319,302,334,308,243,250,257,296,294,247,270,3.470
FURTO - OUTROS,48.026,44.982,47.939,46.544,46.283,43.289,46.353,45.670,47.282,47.023,43.912,42.670,549.973
FURTO DE VEÍCULO,7.729,7.327,7.496,7.322,7.665,6.626,7.348,7.204,7.102,7.806,7.119,6.590,87.334`;

const MONTHS = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const COLORS = ['#0f172a', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6', '#f97316'];

const cleanNum = (val: any) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(String(val).replace(/\./g, ''));
};

const parseSecurityCSV = (csv: string): CrimeNature[] => {
  const results = Papa.parse(csv, { header: true, skipEmptyLines: true });
  return results.data.map((row: any) => ({
    natureza: row.Natureza,
    monthly: MONTHS.map(m => cleanNum(row[m])),
    total: cleanNum(row.Total)
  })).filter(d => d.natureza && !d.natureza.includes('Nº DE VÍTIMAS'));
};

export default function SecurityDashboard() {
  const [data, setData] = useState<CrimeNature[]>(parseSecurityCSV(SEED_DATA_RAW));
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      setData(parseSecurityCSV(csv));
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  const kpis = useMemo(() => {
    // Avoid double counting (ignoring TOTAL subtypes)
    const propertyCrimesSet = ['ROUBO - OUTROS', 'ROUBO DE VEÍCULO', 'ROUBO A BANCO', 'ROUBO DE CARGA', 'FURTO - OUTROS', 'FURTO DE VEÍCULO'];
    const lethalCrimesSet = ['HOMICÍDIO DOLOSO (2)', 'LATROCÍNIO', 'LESÃO CORPORAL SEGUIDA DE MORTE'];
    const sexualCrimesSet = ['ESTUPRO', 'ESTUPRO DE VULNERÁVEL'];

    const totalOccurrences = data.reduce((acc, curr) => {
      // Logic to avoid double counting from "TOTAL DE X" rows if they exist
      if (curr.natureza.startsWith('TOTAL DE')) return acc;
      return acc + curr.total;
    }, 0);

    const lethalTotal = data.filter(d => lethalCrimesSet.includes(d.natureza)).reduce((a, b) => a + b.total, 0);
    const propertyTotal = data.filter(d => propertyCrimesSet.includes(d.natureza)).reduce((a, b) => a + b.total, 0);
    const sexualTotal = data.filter(d => sexualCrimesSet.includes(d.natureza)).reduce((a, b) => a + b.total, 0);

    // Monthly totals for evolution chart
    const monthlyEvolution = MONTHS.map((m, idx) => {
      const sum = data.reduce((acc, curr) => {
        if (curr.natureza.startsWith('TOTAL DE')) return acc;
        return acc + curr.monthly[idx];
      }, 0);
      return { month: m.substring(0, 3), occurrences: sum };
    });

    const largestNature = [...data]
      .filter(d => !d.natureza.startsWith('TOTAL DE'))
      .sort((a, b) => b.total - a.total)[0];

    return {
      totalOccurrences,
      lethalTotal,
      propertyTotal,
      sexualTotal,
      monthlyEvolution,
      largestNature
    };
  }, [data]);

  const categoryDistribution = [
    { name: 'Patrimoniais', value: kpis.propertyTotal, color: '#0f172a' },
    { name: 'Letais', value: kpis.lethalTotal, color: '#ef4444' },
    { name: 'Sexuais', value: kpis.sexualTotal, color: '#8b5cf6' },
    { name: 'Outros/Lesões', value: kpis.totalOccurrences - kpis.propertyTotal - kpis.lethalTotal - kpis.sexualTotal, color: '#94a3b8' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Shield className="text-gov-accent" size={32} />
            Monitor de Segurança Pública
          </h2>
          <p className="text-slate-500 mt-1">Análise consolidada de indicadores de criminalidade e impacto social.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
            <Upload size={18} />
            <span>{isUploading ? 'Processando...' : 'Carregar CSV'}</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button className="p-2 bg-gov-primary text-white rounded-xl hover:bg-slate-800 transition-all shadow-md">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIItem 
          title="Total de Ocorrências" 
          value={kpis.totalOccurrences.toLocaleString('pt-BR')} 
          icon={<Activity size={20} />}
          color="slate"
          description="Consolidado anual"
        />
        <KPIItem 
          title="Crimes Contra Vida" 
          value={kpis.lethalTotal.toLocaleString('pt-BR')} 
          icon={<AlertTriangle size={20} />}
          color="rose"
          description="Homicídios e Latrocínios"
        />
        <KPIItem 
          title="Crime Prevalente" 
          value={kpis.largestNature?.natureza || 'N/A'} 
          icon={<Zap size={20} />}
          color="amber"
          description="Maior volume registrado"
        />
        <KPIItem 
          title="Média Mensal" 
          value={Math.round(kpis.totalOccurrences / 12).toLocaleString('pt-BR')} 
          icon={<Calendar size={20} />}
          color="indigo"
          description="Eventos/mês"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Evolução da Criminalidade</h3>
              <p className="text-xs text-slate-500">Distribuição mensal de ocorrências agregadas.</p>
            </div>
            <GanttChart size={20} className="text-slate-300" />
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpis.monthlyEvolution}>
                <defs>
                  <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="occurrences" name="Ocorrências" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorOcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Composição Criminal</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {categoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {((item.value / kpis.totalOccurrences) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Matriz de Naturezas Criminais</h3>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-gov-accent/10 rounded-lg text-gov-accent text-[10px] font-black uppercase tracking-wider">Top Indicadores</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Natureza da Ocorrência</th>
                <th className="px-6 py-4">Total Anual</th>
                <th className="px-6 py-4">Mês de Pico</th>
                <th className="px-6 py-4">Participação</th>
                <th className="px-6 py-4 text-center">Status Tendência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.filter(d => d.total > 0).sort((a, b) => b.total - a.total).map((item, idx) => {
                const maxVal = Math.max(...item.monthly);
                const maxMonth = MONTHS[item.monthly.indexOf(maxVal)];
                const share = ((item.total / kpis.totalOccurrences) * 100).toFixed(2);
                const trend = item.monthly[11] > item.monthly[0] ? 'up' : 'down';

                return (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/80 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900 uppercase">{item.natureza}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-600">
                      {item.total.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{maxMonth}</span>
                        <span className="text-[10px] text-slate-400 font-bold">({maxVal.toLocaleString()})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-800 rounded-full" 
                            style={{ width: `${Math.min(parseFloat(share) * 2, 100)}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-black">{share}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {trend === 'up' ? 
                        <TrendingUp size={16} className="text-rose-500 mx-auto" /> : 
                        <TrendingUp size={16} className="text-emerald-500 rotate-180 mx-auto" />
                      }
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Strategic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 rounded-3xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-gov-accent" />
            </div>
            <h4 className="font-bold">Análise de Tendência Mensal</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed italic">
            "Observamos uma oscilação média de {((Math.max(...kpis.monthlyEvolution.map(m => m.occurrences)) - Math.min(...kpis.monthlyEvolution.map(m => m.occurrences))) / kpis.totalOccurrences * 100).toFixed(1)}% na criminalidade total entre meses. O pico registrado em {kpis.monthlyEvolution.sort((a, b) => b.occurrences - a.occurrences)[0].month} sugere sazonalidade crítica que requer reforço preventivo."
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-rose-500" />
            </div>
            <h4 className="font-bold text-slate-900">Alerta de Impacto Social</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            A categoria de <strong>Crimes Contra Vida</strong> (Letais) totalizou {kpis.lethalTotal.toLocaleString('pt-BR')} ocorrências. A participação de {((kpis.lethalTotal / kpis.totalOccurrences) * 100).toFixed(1)}% no volume total, embora inferior aos crimes patrimoniais, representa o indicador de maior criticidade para políticas de direitos humanos e segurança pública.
          </p>
        </div>
      </div>
    </div>
  );
}

function KPIItem({ title, value, icon, color, description }: any) {
  const colorMap = {
    slate: 'bg-slate-100 text-slate-600',
    rose: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color as keyof typeof colorMap]} shadow-sm border border-white/50`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
        <div className="text-xl font-black text-slate-900 my-1 truncate" title={value}>{value}</div>
        <p className="text-[10px] font-bold text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
}
