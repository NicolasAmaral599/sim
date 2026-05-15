import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'motion/react';
import { BarChart3, Lock, Mail, Loader2, ShieldCheck, User } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  initialIsSignUp?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, initialIsSignUp = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent, intendedRole?: 'cliente' | 'dev') => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'cliente',
            }
          }
        });
        if (signUpError) throw signUpError;

        // Manual profile creation
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              role: 'cliente'
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }

        setShowSuccess(true);
      } else {
        if (!intendedRole) return;

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;

        if (data.user) {
          // Fetch role to validate
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            await supabase.auth.signOut();
            throw new Error('Erro ao verificar perfil do usuário.');
          }

          if (profile.role !== intendedRole) {
            await supabase.auth.signOut();
            if (intendedRole === 'cliente' && profile.role === 'dev') {
              throw new Error('Esta conta é de desenvolvedor. Use o acesso "Sou Dev".');
            } else if (intendedRole === 'dev' && profile.role === 'cliente') {
              throw new Error('Você não possui acesso de desenvolvedor.');
            } else {
              throw new Error('Acesso não autorizado para este perfil.');
            }
          }
        }

        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 bg-gov-primary text-white text-center">
            <div className="w-16 h-16 bg-gov-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
              <BarChart3 size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">InsightGov</h1>
            <p className="text-slate-400 text-sm mt-2">Plataforma de Inteligência Governamental</p>
          </div>

          <div className="p-8">
            {showSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Verifique seu E-mail</h2>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Enviamos um link de confirmação para <span className="font-bold text-slate-900">{email}</span>. 
                  Por favor, verifique sua caixa de entrada e spam para ativar sua conta.
                </p>
                <button 
                  onClick={() => {
                    setShowSuccess(false);
                    setIsSignUp(false);
                  }}
                  className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Voltar para o Login
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex gap-4 mb-8 p-1 bg-slate-100 rounded-xl">
                  <button 
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-white text-gov-primary shadow-sm' : 'text-slate-500'}`}
                  >
                    Entrar
                  </button>
                  <button 
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-white text-gov-primary shadow-sm' : 'text-slate-500'}`}
                  >
                    Cadastrar
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Email Corporativo</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        placeholder="exemplo@gov.br"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex flex-col gap-3">
                    {isSignUp ? (
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gov-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Criar Conta'}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAuth(null as any, 'cliente')}
                          disabled={loading}
                          className="w-full py-3 bg-gov-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar como Cliente'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAuth(null as any, 'dev')}
                          disabled={loading}
                          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sou Dev'}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-bold uppercase">Seguro</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <User size={20} />
                  <span className="text-[10px] font-bold uppercase">LGPD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-6">
          Acesso restrito a servidores e parceiros autorizados.<br/>
          InsightGov © 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
