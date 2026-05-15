import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle,
  useMap 
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import Papa from 'papaparse';
import { 
  Bus, 
  Upload, 
  Info, 
  Map as MapIcon, 
  BarChart2, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// Fix for default marker icons in Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BusStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  neighborhood?: string;
  isCovered?: boolean;
}

const SP_MOCK_DATA: BusStop[] = [
  // Sé Center
  { stop_id: '1', stop_name: 'Pça. da Sé, 100', stop_lat: -23.5505, stop_lon: -46.6333, neighborhood: 'Centro' },
  { stop_id: '2', stop_name: 'Rua Direita', stop_lat: -23.5489, stop_lon: -46.6345, neighborhood: 'Centro' },
  { stop_id: '3', stop_name: 'Pça. Patriarca', stop_lat: -23.5482, stop_lon: -46.6371, neighborhood: 'Centro' },
  { stop_id: '4', stop_name: 'Viaduto do Chá', stop_lat: -23.5475, stop_lon: -46.6385, neighborhood: 'Centro' },
  
  // Paulista
  { stop_id: '5', stop_name: 'Av. Paulista, 1000', stop_lat: -23.5617, stop_lon: -46.6560, neighborhood: 'Paulista' },
  { stop_id: '6', stop_name: 'Av. Paulista, 1500 (MASP)', stop_lat: -23.5612, stop_lon: -46.6552, neighborhood: 'Paulista' },
  { stop_id: '7', stop_name: 'Av. Paulista, 2000', stop_lat: -23.5595, stop_lon: -46.6588, neighborhood: 'Paulista' },
  { stop_id: '8', stop_name: 'Rua da Consolação x Paulista', stop_lat: -23.5583, stop_lon: -46.6610, neighborhood: 'Paulista' },

  // Pinheiros
  { stop_id: '9', stop_name: 'Rua Teodoro Sampaio, 2500', stop_lat: -23.5667, stop_lon: -46.7000, neighborhood: 'Pinheiros' },
  { stop_id: '10', stop_name: 'Largo da Batata', stop_lat: -23.5678, stop_lon: -46.7025, neighborhood: 'Pinheiros' },
  { stop_id: '11', stop_name: 'Av. Brg. Faria Lima, 1200', stop_lat: -23.5695, stop_lon: -46.6950, neighborhood: 'Pinheiros' },
  
  // Itaim Bibi
  { stop_id: '12', stop_name: 'Rua Joaquim Floriano', stop_lat: -23.5845, stop_lon: -46.6740, neighborhood: 'Itaim Bibi' },
  { stop_id: '13', stop_name: 'Av. Santo Amaro, 500', stop_lat: -23.5900, stop_lon: -46.6780, neighborhood: 'Itaim Bibi' },
  
  // Mooca
  { stop_id: '14', stop_name: 'Rua da Mooca, 2000', stop_lat: -23.5552, stop_lon: -46.5986, neighborhood: 'Mooca' },
  { stop_id: '15', stop_name: 'Rua Juventus', stop_lat: -23.5601, stop_lon: -46.5950, neighborhood: 'Mooca' },

  // Santana
  { stop_id: '16', stop_name: 'Rua Voluntários da Pátria', stop_lat: -23.5042, stop_lon: -46.6250, neighborhood: 'Santana' },
  { stop_id: '17', stop_name: 'Av. Cruzeiro do Sul', stop_lat: -23.5060, stop_lon: -46.6238, neighborhood: 'Santana' },

  // Add more random points to flesh it out
  ...Array.from({ length: 50 }, (_, i) => ({
    stop_id: `rand-${i}`,
    stop_name: `Parada Aleatória ${i + 18}`,
    stop_lat: -23.5 + (Math.random() - 0.5) * 0.2,
    stop_lon: -46.6 + (Math.random() - 0.5) * 0.2,
    neighborhood: ['Periferia Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste'][Math.floor(Math.random() * 4)],
    isCovered: Math.random() > 0.3
  }))
];

const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MobilityDashboard: React.FC = () => {
  const [data, setData] = useState<BusStop[]>(SP_MOCK_DATA);
  const [viewMode, setViewMode] = useState<'clusters' | 'heatmap'>('clusters');
  const [isUploading, setIsUploading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: BusStop[] = results.data.map((row: any) => ({
          stop_id: row.stop_id || String(Math.random()),
          stop_name: row.stop_name || 'Desconhecido',
          stop_lat: parseFloat(String(row.stop_lat)),
          stop_lon: parseFloat(String(row.stop_lon)),
          neighborhood: row.neighborhood || 'Outro',
          isCovered: row.is_covered === 'true' || row.is_covered === true
        })).filter(stop => !isNaN(stop.stop_lat) && !isNaN(stop.stop_lon));

        if (parsedData.length > 0) {
          setData(parsedData);
          setMapCenter([parsedData[0].stop_lat, parsedData[0].stop_lon]);
        }
        setIsUploading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setIsUploading(false);
      }
    });
  };

  const insights = useMemo(() => {
    const total = data.length;
    const neighborhoods: Record<string, number> = {};
    data.forEach(stop => {
      const n = stop.neighborhood || 'Desconhecido';
      neighborhoods[n] = (neighborhoods[n] || 0) + 1;
    });

    const topNeighborhoods = Object.entries(neighborhoods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const minCoverageNeighborhood = Object.entries(neighborhoods)
      .sort((a, b) => a[1] - b[1])[0];

    return {
      total,
      topNeighborhoods,
      minCoverageNeighborhood,
      densityIndex: (total / 10).toFixed(1) // Simplified calculation
    };
  }, [data]);

  const chartData = useMemo(() => {
    return insights.topNeighborhoods.map(([name, count]) => ({
      name,
      count
    }));
  }, [insights]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mobilidade Urbana: São Paulo</h2>
          <p className="text-slate-500 mt-1">Análise de distribuição e cobertura de paradas de ônibus.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-gov-primary text-white rounded-lg font-medium cursor-pointer hover:bg-slate-800 transition-all shadow-sm">
            <Upload size={18} />
            <span>{isUploading ? 'Processando...' : 'Carregar CSV'}</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('clusters')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'clusters' ? 'bg-white text-gov-primary shadow-sm' : 'text-slate-500'}`}
            >
              Agrupamento
            </button>
            <button 
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'heatmap' ? 'bg-white text-gov-primary shadow-sm' : 'text-slate-500'}`}
            >
              Densidade
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Bus size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Paradas</p>
              <h3 className="text-2xl font-bold text-slate-900">{insights.total}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Índice de Densidade</p>
              <h3 className="text-2xl font-bold text-slate-900">{insights.densityIndex}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bairro com Mais Atendimento</p>
              <h3 className="text-sm font-bold text-slate-900 truncate">{insights.topNeighborhoods[0]?.[0] || 'N/A'}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menor Atendimento</p>
              <h3 className="text-sm font-bold text-slate-900 truncate">{insights.minCoverageNeighborhood?.[0] || 'N/A'}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Panel */}
        <div className="lg:col-span-2 glass-panel overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon size={18} className="text-slate-400" />
              <h4 className="font-bold text-slate-900">Distribuição Geográfica</h4>
            </div>
            <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">LIVE</div>
          </div>
          <div className="flex-1 relative z-0">
            <MapContainer 
              center={mapCenter} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapRecenter center={mapCenter} />
              
              {viewMode === 'clusters' && (
                <MarkerClusterGroup>
                  {data.map((stop) => (
                    <Marker key={stop.stop_id} position={[stop.stop_lat, stop.stop_lon]}>
                      <Popup>
                        <div className="p-1">
                          <p className="font-bold text-slate-900">{stop.stop_name}</p>
                          <p className="text-xs text-slate-500 mt-1">ID: {stop.stop_id}</p>
                          <p className="text-xs text-emerald-600 font-medium mt-1">Bairro: {stop.neighborhood}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              )}

              {viewMode === 'heatmap' && (
                <>
                  {data.map((stop) => (
                    <Circle 
                      key={stop.stop_id}
                      center={[stop.stop_lat, stop.stop_lon]}
                      radius={300}
                      pathOptions={{
                        fillColor: '#ef4444',
                        color: 'transparent',
                        fillOpacity: 0.15
                      }}
                    />
                  ))}
                </>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Insights & Metrics Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 size={18} className="text-slate-400" />
              <h4 className="font-bold text-slate-900">Concentração por Região</h4>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#0f172a' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Info size={18} className="text-slate-400" />
              <h4 className="font-bold text-slate-900">Insights Gerenciais</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg flex gap-3">
                <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-900">Densidade Ideal</p>
                  <p className="text-xs text-blue-705 mt-1">O centro da cidade apresenta uma saturação de pontos, otimizando o tempo de espera dos usuários.</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg flex gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Zonas de Sombra</p>
                  <p className="text-xs text-amber-705 mt-1">Identificamos baixa frequência de paradas em regiões periféricas. Sugerimos estudo de viabilidade para novas linhas.</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg flex gap-3">
                <TrendingUp size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Potencial de Integração</p>
                  <p className="text-xs text-emerald-705 mt-1">A região da Mooca possui alta capilaridade e pode servir como hub para conexões intermunicipais.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilityDashboard;
