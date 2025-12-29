
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { 
  TrendingUp, BarChart3, Users, Briefcase, Plus, ArrowUpRight, 
  Activity, Calendar, PieChart as PieIcon, List, Zap, ShieldAlert, FileSearch, RefreshCw, X, ChevronRight, CheckCircle2, Edit3, Loader2
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { AppContext } from '../App';
import PortfolioCreateForm from './PortfolioCreateForm';
import ManualRebalance from './ManualRebalance';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const formatFullDate = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${mm}-${dd} ${hh}-${min}-${ss}`;
};

const generateTrendData = (range: '1D' | '1W' | '6M') => {
  const data = [];
  const now = new Date();
  let points = 20;
  let interval = 0;
  if (range === '1D') { points = 24; interval = 3600 * 1000; }
  else if (range === '1W') { points = 7; interval = 24 * 3600 * 1000; }
  else { points = 30; interval = 6 * 24 * 3600 * 1000; }
  let baseValue = 1000000;
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval);
    baseValue += (Math.random() - 0.45) * 50000;
    data.push({
      time: formatFullDate(time),
      amount: parseFloat(baseValue.toFixed(2))
    });
  }
  return data;
};

const PortfolioCard: React.FC<{ p: any, t: (k: string) => string, onDiagnose: (p: any) => void }> = ({ p, t, onDiagnose }) => {
  const [activeRightView, setActiveRightView] = useState<'dist' | 'holders' | 'trend'>('dist');
  const [trendRange, setTrendRange] = useState<'1D' | '1W' | '6M'>('6M');
  const trendData = useMemo(() => generateTrendData(trendRange), [trendRange]);

  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group flex flex-col h-[750px]">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:bg-blue-600 transition-colors">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-3">{p.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">{p.id}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">{p.risk}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border mb-2 ${p.deviation > 5 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-green-50 text-green-600 border-green-100'}`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('monitor_deviation')}: {p.deviation}%</span>
           </div>
           <div className="text-right">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">当前 AUM</p>
             <p className="text-3xl font-black text-slate-900 tracking-tighter">¥{(p.aum / 10000).toFixed(0)}万</p>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-8 overflow-hidden">
        <div className="lg:col-span-2 bg-slate-50/50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center relative border border-slate-50">
          <p className="absolute top-6 left-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <PieIcon className="w-3 h-3" /> 资产穿透
          </p>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={p.assets} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none" paddingAngle={5}>
                  {p.assets.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 w-full px-4">
            {p.assets.map((asset: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-slate-500">{asset.name}</span>
                </div>
                <span className="text-[10px] font-black text-slate-700">{asset.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-inner relative">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            {[
              { id: 'dist', label: '持仓占比', icon: BarChart3 },
              { id: 'holders', label: '持有分布', icon: Users },
              { id: 'trend', label: '业绩趋势', icon: TrendingUp },
            ].map((v) => (
              <button key={v.id} onClick={() => setActiveRightView(v.id as any)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRightView === v.id ? 'bg-white text-blue-600 shadow-sm shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                <v.icon className="w-3.5 h-3.5" /> {v.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden relative">
            {activeRightView === 'dist' && (
              <div className="h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={p.funds} layout="vertical" margin={{ left: 0, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} width={60} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="val" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {activeRightView === 'holders' && (
              <div className="h-full space-y-3 overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-right-4 duration-300">
                {[
                  { name: 'Sarah Chen', id: 'WA-0856', amount: '125.0w', status: 'Active' },
                  { name: 'Li Qiang', id: 'WA-1022', amount: '84.2w', status: 'Active' },
                  { name: 'Wang Fang', id: 'WA-0599', amount: '210.5w', status: 'Pending' },
                ].map((holder, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-blue-600">{holder.name[0]}</div>
                      <div>
                        <p className="text-[11px] font-black text-slate-800">{holder.name}</p>
                        <p className="text-[9px] font-mono text-slate-400 uppercase">{holder.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-slate-900">¥{holder.amount}</p>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${holder.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>{holder.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeRightView === 'trend' && (
              <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-end gap-2 mb-4">
                  {(['1D', '1W', '6M'] as const).map(r => (
                    <button key={r} onClick={() => setTrendRange(r)} className={`px-3 py-1 rounded-md text-[9px] font-black border transition-all ${trendRange === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}> {r} </button>
                  ))}
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs><linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 7, fontWeight: 700, fill: '#94a3b8' }} interval={trendRange === '6M' ? 5 : 2} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 700, fill: '#94a3b8' }} domain={['auto', 'auto']} width={40} />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 mt-6 border-t border-slate-50 flex justify-between items-center">
         <button onClick={() => onDiagnose(p)} className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl active:scale-95 group">
            <FileSearch className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {t('btn_diagnose')}
         </button>
         <div className="flex gap-4">
           <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">策略穿透</button>
           <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-1">
             <Calendar className="w-3.5 h-3.5" /> 调仓记录
           </button>
         </div>
      </div>
    </div>
  );
};

const PortfolioGallery: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t, portfolios, setPortfolios } = ctx;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showManualRebalance, setShowManualRebalance] = useState(false);
  const [diagnosingPortfolio, setDiagnosingPortfolio] = useState<any>(null);
  const [isRebalancing, setIsRebalancing] = useState(false);

  useEffect(() => {
    const autoOpenName = localStorage.getItem('auto_open_diagnose');
    if (autoOpenName) {
      const p = portfolios.find(item => item.name === autoOpenName);
      if (p) {
        setDiagnosingPortfolio(p);
      }
      localStorage.removeItem('auto_open_diagnose');
    }
  }, [portfolios]);

  const handleAutoRebalance = () => {
    setIsRebalancing(true);
    setTimeout(() => {
      setIsRebalancing(false);
      setDiagnosingPortfolio(null);
      alert(lang === 'zh' ? 'AI 自动调仓指令已执行。' : 'AI Auto-rebalance order executed.');
    }, 1500);
  };

  const handleManualRebalanceTrigger = () => {
    setShowManualRebalance(true);
  };

  const handleConfirmManualRebalance = (newFunds: any[]) => {
    // 同步更新全局 portfolios 状态
    if (diagnosingPortfolio) {
      setPortfolios(prev => prev.map(p => 
        p.id === diagnosingPortfolio.id ? { ...p, funds: newFunds, deviation: 0.1 } : p
      ));
    }
    setShowManualRebalance(false);
    setDiagnosingPortfolio(null);
  };

  if (showCreateForm) return <PortfolioCreateForm onCancel={() => setShowCreateForm(false)} onPublish={() => setShowCreateForm(false)} />;
  if (showManualRebalance && diagnosingPortfolio) return (
    <ManualRebalance 
      portfolio={diagnosingPortfolio} 
      onCancel={() => setShowManualRebalance(false)} 
      onConfirm={handleConfirmManualRebalance} 
    />
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('nav_portfolios')}</h1>
          <p className="text-slate-500 text-sm font-bold mt-2">{t('portfolios_subtitle')}</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] text-sm font-black hover:bg-blue-600 transition-all shadow-2xl uppercase tracking-widest active:scale-95 transform">
          <Plus className="w-6 h-6" /> {t('btn_create_port')}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {portfolios.map((p) => <PortfolioCard key={p.id} p={p} t={t} onDiagnose={setDiagnosingPortfolio} />)}
      </div>

      {/* 持仓诊断报告 */}
      {diagnosingPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
           <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
             <div className="p-12 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg"><Zap className="w-8 h-8" /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{lang === 'zh' ? '持仓偏离诊断报告' : 'Holding Diagnosis'}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{diagnosingPortfolio.name} • {diagnosingPortfolio.id}</p>
                  </div>
                </div>
                <button onClick={() => setDiagnosingPortfolio(null)} className="p-3 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100"><X className="w-8 h-8 text-slate-400" /></button>
             </div>

             <div className="p-12 overflow-y-auto max-h-[70vh]">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-1 space-y-8">
                    <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 relative overflow-hidden">
                       <ShieldAlert className="absolute -right-2 -top-2 w-20 h-20 text-red-500 opacity-10" />
                       <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">当前偏离风险指标</p>
                       <p className="text-4xl font-black text-red-600">{diagnosingPortfolio.deviation}%</p>
                       <p className="text-[10px] font-bold text-red-400 mt-2 uppercase">高于阈值 (5.0%)</p>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
                       <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">诊断简报 (PulseAI)</h4>
                       <p className="text-xs italic leading-relaxed text-slate-400">
                         检测到“中欧电子”近期净值快速上涨，导致权益资产仓位自动漂移超配。建议进行调仓干预，将权益配比回调至 80% 目标值，并补充现金头寸。
                       </p>
                    </div>
                 </div>

                 <div className="lg:col-span-2 space-y-8">
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">拟调仓建议 (前 vs 后)</h4>
                   <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">底层基金</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">当前配比</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">建议目标</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">变动额度</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {diagnosingPortfolio.funds.map((f: any, i: number) => (
                            <tr key={i} className="group">
                              <td className="py-4 text-xs font-black text-slate-800">{f.name}</td>
                              <td className="py-4 text-xs font-bold text-slate-500 text-center">{f.val}%</td>
                              <td className="py-4 text-xs font-black text-blue-600 text-center">{f.val - (i === 0 ? 5 : -1)}%</td>
                              <td className="py-4 text-xs font-mono text-right font-black text-red-500">-{ (diagnosingPortfolio.aum * 0.05 / 10000).toFixed(1) }万</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>

                   <div className="flex gap-4 pt-4">
                     <button onClick={() => setDiagnosingPortfolio(null)} className="flex-1 py-5 rounded-3xl border border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">暂缓执行</button>
                     <button onClick={handleAutoRebalance} disabled={isRebalancing} className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-2xl transition-all flex items-center justify-center gap-2">
                       {isRebalancing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                       通过调仓
                     </button>
                     <button onClick={handleManualRebalanceTrigger} className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 shadow-2xl transition-all flex items-center justify-center gap-2">
                       <Edit3 className="w-5 h-5" />
                       手动调仓
                     </button>
                   </div>
                 </div>
               </div>
             </div>

             <div className="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Activity className="w-4 h-4" /> 监控频率: 每30分钟
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <RefreshCw className="w-4 h-4" /> 末次扫描: {new Date().toLocaleTimeString()}
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
