import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Eye, 
  TrendingUp, 
  Activity, 
  Bus, 
  GraduationCap, 
  Shield, 
  Droplets, 
  MousePointer2,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BarChart3 className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">DataPublic</span>
          </div>

          <nav className="hidden lg:flex gap-8">
            {['Impacto', 'Benefícios', 'Serviços', 'Dashboard', 'IA'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex gap-4">
            <Link to="/login" className="hidden sm:flex items-center text-sm font-semibold text-white hover:text-emerald-400 transition-colors">
              Login
            </Link>
            <Link to="/login?signup=true" className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* SEÇÃO 1 — HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000" 
            alt="Modern City" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-[#020617]/80 to-[#020617]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap size={14} />
            Inteligência em Gestão Pública
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] tracking-tight mb-8"
          >
            Dados que Transformam <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Serviços Públicos
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Ferramentas de Business Intelligence ajudam gestores públicos a tomar decisões melhores, 
            reduzir custos e melhorar a qualidade de vida da população.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
          >
            <a href="#beneficios" className="group bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
              Explorar Benefícios
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#dashboard" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm">
              Ver Análises
            </a>
          </motion.div>

          {/* Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12"
          >
            {[
              { label: "redução de desperdício", value: "30%" },
              { label: "decisões mais rápidas", value: "3x" },
              { label: "transparência", value: "100%" }
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-white mb-1">{metric.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mouse Scroll Icon */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Role para baixo</span>
        </motion.div>
      </section>

      {/* SEÇÃO 2 — IMPACTO SOCIAL */}
      <section id="impacto" className="py-32 px-6 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn} className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800" 
                alt="Impacto Social" 
                className="relative z-10 rounded-3xl shadow-2xl border border-white/5"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-emerald-500 p-6 rounded-2xl shadow-xl z-20">
                <Globe className="text-white" size={32} />
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="space-y-8">
              <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Impacto Social</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Tecnologia a serviço do <br />
                <span className="text-emerald-400">bem comum</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Nossa plataforma utiliza análise avançada de dados para otimizar a gestão pública. 
                Ao transformar números em insights, permitimos que governos operem com máxima eficiência, 
                garantindo que cada recurso chegue onde é mais necessário.
              </p>

              <div className="grid gap-6">
                {[
                  { title: "Qualidade de Vida", desc: "Melhoria direta nos indicadores de bem-estar social." },
                  { title: "Eficiência Governamental", desc: "Processos mais ágeis e menos burocráticos." },
                  { title: "Distribuição de Recursos", desc: "Alocação inteligente baseada em necessidades reais." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="text-emerald-500" size={14} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-300">Redução de Desigualdades</span>
                <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-300">Melhoria no Atendimento</span>
                <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-300">Decisões Baseadas em Dados</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — BENEFÍCIOS */}
      <section id="benefícios" className="py-32 px-6 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div {...fadeIn}>
              <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Benefícios</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Por que escolher o DataPublic?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Uma solução completa para modernizar a administração pública através da ciência de dados.
              </p>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: <Activity className="text-blue-400" />, 
                title: "Melhorar Serviços Públicos", 
                desc: "Monitoramento contínuo da qualidade dos serviços prestados à população.",
                color: "group-hover:bg-blue-500/20"
              },
              { 
                icon: <TrendingUp className="text-emerald-400" />, 
                title: "Uso Inteligente de Recursos", 
                desc: "Redução drástica de desperdício e melhor alocação orçamentária.",
                color: "group-hover:bg-emerald-500/20"
              },
              { 
                icon: <Zap className="text-amber-400" />, 
                title: "Identificação de Problemas", 
                desc: "Detecção de falhas e gargalos em tempo real para ação imediata.",
                color: "group-hover:bg-amber-500/20"
              },
              { 
                icon: <Zap className="text-purple-400" />, 
                title: "Decisões Mais Rápidas", 
                desc: "Dashboards intuitivos com dados atualizados minuto a minuto.",
                color: "group-hover:bg-purple-500/20"
              },
              { 
                icon: <Eye className="text-rose-400" />, 
                title: "Transparência", 
                desc: "Acesso claro e simplificado às informações públicas para o cidadão.",
                color: "group-hover:bg-rose-500/20"
              }
            ].map((benefit, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-colors ${benefit.color}`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 4 — SERVIÇOS PÚBLICOS */}
      <section id="serviços" className="py-32 px-6 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div {...fadeIn}>
              <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Serviços Públicos</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Soluções por Setor</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Módulos especializados para as necessidades críticas de cada área do governo.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
                title: "SAÚDE",
                icon: <Activity size={18} />,
                items: ["Monitoramento de hospitais", "Tempo de espera", "Ocupação de leitos"],
                stats: "98% precisão"
              },
              {
                img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
                title: "TRANSPORTE",
                icon: <Bus size={18} />,
                items: ["Fluxo de trânsito", "Uso de transporte público", "Tempo de deslocamento"],
                stats: "25% mais ágil"
              },
              {
                img: "https://images.unsplash.com/photo-1523050335392-9bc567590959?auto=format&fit=crop&q=80&w=800",
                title: "EDUCAÇÃO",
                icon: <GraduationCap size={18} />,
                items: ["Taxa de aprovação", "Infraestrutura escolar", "Desempenho dos alunos"],
                stats: "+15% nota média"
              },
              {
                img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800",
                title: "SEGURANÇA",
                icon: <Shield size={18} />,
                items: ["Índices de criminalidade", "Monitoramento urbano", "Prevenção"],
                stats: "40% redução"
              },
              {
                img: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=800",
                title: "SANEAMENTO",
                icon: <Droplets size={18} />,
                items: ["Acesso à água", "Tratamento de esgoto", "Infraestrutura básica"],
                stats: "100% cobertura"
              }
            ].map((service, i) => (
              <motion.div 
                key={i} 
                {...fadeIn}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-emerald-400 font-black tracking-widest text-xs">
                      {service.icon}
                      {service.title}
                    </div>
                    <div className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded uppercase tracking-widest">
                      {service.stats}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {service.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — DASHBOARD */}
      <section id="dashboard" className="py-32 px-6 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn} className="order-2 lg:order-1">
              <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Interface</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Gestão em <br />
                <span className="text-emerald-400">tempo real</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Nossos painéis inteligentes consolidam dados complexos em visualizações simples e acionáveis. 
                Acompanhe o desempenho de cada secretaria e tome decisões baseadas na realidade atual.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <BarChart3 size={20} />, text: "Gráficos Dinâmicos" },
                  { icon: <Globe size={20} />, text: "Mapas de Calor" },
                  { icon: <Activity size={20} />, text: "Indicadores de KPI" },
                  { icon: <CheckCircle2 size={20} />, text: "Relatórios Automáticos" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="text-emerald-500">{feature.icon}</div>
                    {feature.text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full" />
              <div className="relative z-10 p-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1200" 
                  alt="Dashboard Preview" 
                  className="rounded-2xl shadow-lg border border-white/5"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — ANÁLISE INTELIGENTE */}
      <section id="ia" className="py-32 px-6 bg-[#020617]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <BrainCircuit size={14} />
              Inteligência Artificial
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Análise Preditiva e Insights</h2>
            <p className="text-slate-400 text-xl leading-relaxed mb-16">
              Não apenas mostramos o que aconteceu, mas prevemos o que vai acontecer. 
              Nossa IA analisa padrões históricos para antecipar demandas e sugerir ações preventivas.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 text-left">
              {[
                { title: "Análise Automática", desc: "Processamento de milhões de registros em segundos." },
                { title: "Geração de Insights", desc: "Sugestões inteligentes baseadas em padrões de sucesso." },
                { title: "Alertas Inteligentes", desc: "Notificações proativas sobre anomalias ou riscos." },
                { title: "Apoio à Decisão", desc: "Simulações de impacto para diferentes cenários políticos." }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 7 — CONCLUSÃO */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#020617] to-emerald-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Transformando dados em decisões que <br />
              <span className="text-emerald-400">melhoram vidas</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12">
              Junte-se a centenas de gestores que já estão modernizando suas cidades com o DataPublic.
            </p>
            <Link to="/login" className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-full font-black text-lg transition-all shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95">
              Acessar Plataforma
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg text-white">DataPublic</span>
          </div>

          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>

          <p className="text-slate-600 text-xs font-medium uppercase tracking-widest">
            © 2026 DataPublic - Inteligência em Dados Públicos
          </p>
        </div>
      </footer>
    </div>
  );
}
