
import React, { useContext } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, ShieldCheck, Lock, Wallet, Activity, Briefcase, Zap } from 'lucide-react';
import { AppContext } from '../App';

const InvestorDashboard: React.FC<{ onNavigate: (v: any) => void }> = ({ onNavigate }) => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const stats = [
    { label: t('holding_amount'), value: `¥${ctx?.balance.toLocaleString()}`, change: lang === 'zh' ? '实时更新' : 'Live Update', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: lang === 'zh' ? '累计收益率' : 'Total Return', value: '+12.5%', change: lang === 'zh' ? '跑赢基准' : 'Vs. Bench', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: lang === 'zh' ? '安全隔离度' : 'Isolation', value: '100%', change: lang === 'zh' ? '银行级' : 'Tier 1', icon: Lock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: lang === 'zh' ? '测评风险等级' : 'Risk Profile', value: 'R3', change: lang === 'zh' ? '平衡型' : 'Balanced', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{lang === 'zh' ? '下午好，Sarah' : 'Good Afternoon, Sarah'}</h1>
          <p className="text-slate-500 text-sm mt-1 italic font-medium">{lang === 'zh' ? '您的财富账户已开启独立托管，实时隔离保护中。' : 'Your wealth account is under tier-1 custodian isolation.'}</p>
        </div>
        <button onClick={() => onNavigate('marketplace')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center gap-2 shadow-2xl uppercase tracking-widest">
          <Zap className="w-4 h-4 text-blue-400" /> {lang === 'zh' ? '浏览新策略' : 'Browse Hub'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4"><div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}><stat.icon className="w-6 h-6" /></div><span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-500 uppercase tracking-tighter">{stat.change}</span></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p><h3 className="text-2xl font-black text-slate-800 mt-2 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm h-96">
           <div className="flex items-center justify-between mb-8"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> {lang === 'zh' ? '策略持仓市值趋势' : 'Asset Value Growth'}</h3></div>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{d:'01',v:100}, {d:'10',v:112}, {d:'20',v:135}, {d:'30',v:145}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={4} fill="#3b82f6" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col items-center justify-center text-center">
           <Briefcase className="w-16 h-16 text-blue-400 mb-8" />
           <h3 className="text-2xl font-black mb-4 tracking-tight">{lang === 'zh' ? '独立账户保护' : 'Isolated Protection'}</h3>
           <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{lang === 'zh' ? 'WealthPulse 确保每一笔持仓均在财富账户中独立清算。' : 'WealthPulse ensures all holdings are settled in isolated wealth accounts.'}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
