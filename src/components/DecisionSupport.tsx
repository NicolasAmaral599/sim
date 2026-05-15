import React, { useState } from 'react';
import { UserCheck, Brain, MessageSquare, Sparkles, Send, Bot, User, Briefcase, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ExecutiveDecision: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
    { role: 'ai', content: 'Bem-vindo, CIO. Sou o InsightAI Executive. Como posso auxiliar na sua tomada de decisão estratégica de TI hoje? Posso simular ROI, analisar riscos de projetos ou sugerir alinhamento com os objetivos do governo.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Você é o InsightAI Executive, um consultor de elite para CIOs e executivos de TI na Gestão Pública. Ajude em decisões de Liderança, Governança, Investimento e Estratégia. Fale como um consultor sênior da Gartner ou McKinsey. Seja estratégico, foque em ROI, valor público e inovação sustentável."
        }
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || 'Desculpe, não consegui processar sua solicitação estratégica.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Erro de conexão. Verifique a infraestrutura de IA.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Liderança e Decisão Executiva em TI</h2>
          <p className="text-slate-500">Inteligência Estratégica para Alinhamento de Negócio e Governança.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
          <Brain size={20} />
          <span className="text-sm font-bold">Strategic AI Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 glass-panel flex flex-col overflow-hidden border-t-4 border-indigo-600">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-700">Conselho Consultivo de IA</h3>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ready for briefing</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-3 max-w-[90%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                    msg.role === 'ai' ? "bg-gov-primary text-white" : "bg-slate-200 text-slate-600"
                  )}>
                    {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'ai' 
                      ? "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200" 
                      : "bg-gov-primary text-white rounded-tr-none shadow-lg"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="p-4 rounded-2xl bg-slate-100 w-48 h-12" />
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: Qual o ROI estimado para migração de legacy para Microservices?"
                className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gov-primary text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="glass-panel p-6 bg-slate-900 text-white border-none shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-400">
              <Briefcase size={18} />
              Status do Portfólio de Projetos
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Transformação Digital</span>
                  <span className="text-emerald-400">75%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[75%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Cyber-Resilience Fix</span>
                  <span className="text-rose-400">40%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[40%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Cloud Migration Phase 2</span>
                  <span className="text-blue-400">92%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[92%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={18} className="text-indigo-600" />
              OKR Tracker - Q2 2026
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded mt-1">
                  <Zap size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Reduzir Downtime em 50%</p>
                  <p className="text-xs text-slate-500">Status: On Track (99.98% reach)</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded mt-1">
                  <UserCheck size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">NPS do Servidor Público</p>
                  <p className="text-xs text-slate-500">Status: +15pt growth in internal tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDecision;
