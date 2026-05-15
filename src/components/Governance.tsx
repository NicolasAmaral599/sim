import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const ITGovernance: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Governança de TI e Gestão de Políticas</h2>
        <p className="text-slate-500">Frameworks de conformidade (COBIT/ITIL), gestão de riscos tecnológicos e diretrizes de infraestrutura.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Shield size={20} />
            </div>
            <h3 className="font-bold">Maturidade COBIT 2019</h3>
          </div>
          <div className="text-3xl font-bold text-emerald-600">Nível 4.2</div>
          <p className="text-xs text-slate-500 mt-1">Status: Processo Gerenciado e Previsível</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Lock size={20} />
            </div>
            <h3 className="font-bold">LGPD e Privacidade</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600">98%</div>
          <p className="text-xs text-slate-500 mt-1">Conformidade total com a Lei Geral de Proteção de Dados</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Eye size={20} />
            </div>
            <h3 className="font-bold">Auditoria de Sistemas</h3>
          </div>
          <div className="text-3xl font-bold text-amber-600">Sem Falhas</div>
          <p className="text-xs text-slate-500 mt-1">Última revisão externa: Março 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FileText size={18} className="text-slate-400" />
            Políticas de TI e Normativas
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Política de Segurança da Informação (PSI)', version: 'v3.0', date: 'Jan 2026', status: 'updated', owner: 'CISO' },
              { name: 'Norma de Uso de Recursos Computacionais', version: 'v1.4', date: 'Fev 2026', status: 'updated', owner: 'CTO' },
              { name: 'Plano de Continuidade e Desastres (DRP)', version: 'v2.1', date: 'Mar 2026', status: 'pending', owner: 'Infrastructure' },
              { name: 'Guia de Governança de Algoritmos e IA', version: 'v1.0', date: 'Abr 2026', status: 'updated', owner: 'Data Science' },
            ].map((policy, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{policy.name}</h4>
                  <p className="text-[10px] text-slate-500">Versão {policy.version} • {policy.date} • Resp: {policy.owner}</p>
                </div>
                {policy.status === 'updated' ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield size={18} className="text-slate-400" />
            Gestão de Riscos (IT Risk Matrix)
          </h3>
          <div className="space-y-3">
            {[
              { threat: 'Ciberataque (Ransomware)', level: 'High', mitigation: 'Backup imutável ativo' },
              { threat: 'Indisponibilidade de Cloud', level: 'Medium', mitigation: 'Estratégia Multi-region' },
              { threat: 'Vazamento de Dados (DLP)', level: 'High', mitigation: 'Criptografia em trânsito' },
              { threat: 'Obsolescência de Hardware', level: 'Low', mitigation: 'Refresh tecnológico anual' },
            ].map((risk, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      risk.level === 'High' ? 'bg-rose-500' : risk.level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    )} />
                    <h4 className="text-sm font-bold text-slate-900">{risk.threat}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500">Mitigação: {risk.mitigation}</p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  risk.level === 'High' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                )}>
                  {risk.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITGovernance;
