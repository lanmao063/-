
import React, { useContext } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  FileCheck, ShieldCheck, Lock, Users, ArrowUpRight, Sparkles, Zap, Activity 
} from 'lucide-react';
import { AppContext } from '../App';

const Dashboard: React.FC<{ onNavigate: (v: any) => void }> = ({ onNavigate }) => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const stats = [
    { label: lang === 'zh' ? '管理资产总值 (AUM)' : 'Total AUM', value: '¥12.48 亿', change: '+8.4%', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: lang === 'zh' ? '生效投顾协议' : 'Active Agreements', value: '942 份', change: '82.4%', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: lang === 'zh' ? '通过测评客户' : 'KYC Investors', value: '1,284 人', change: '100%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: lang === 'zh' ? '合规风险监控' : 'Risk Monitor', value: lang === 'zh' ? '安全' : 'SECURE', change: lang === 'zh' ? '稳健' : 'STABLE', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const greeting = lang === 'zh' ? '下午好，Alex。今日有 4 项算法合规流水待手动核准。' : 'Good Afternoon, Alex. You have 4 algo compliance tasks pending.';

  const tasks = [
    { title: lang === 'zh' ? '投资者名册中 3 位用户测评到期' : '3 Investor KYCs expiring soon', time: '12m', type: 'clients' },
    { title: lang === 'zh' ? '半导体 A1 组合收益触发锁定报警' : 'Semi A1 hits profit lock trigger', time: '1h', type: 'portfolios' },
    { title: lang === 'zh' ? '算法调仓建议流水待人工核准' : 'Algo rebalance logs pending audit', time: '3h', type: 'requests' },
    { title: lang === 'zh' ? 'ESG组合策略偏离度预警' : 'ESG Portfolio deviation alert', time: '5h', type: 'portfolios' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('nav_dashboard_manager')}</h1>
          <p className="text-slate-500 text-sm mt-1 font-bold">{greeting}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-500 uppercase tracking-tighter">{stat.change}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
             <Activity className="w-5 h-5 text-blue-500" />
             {lang === 'zh' ? 'AUM 规模与投资者增长曲线' : 'AUM & Investor Growth Trend'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: 'Jan', val: 200, users: 150 },
                { month: 'Feb', val: 400, users: 320 },
                { month: 'Mar', val: 650, users: 580 },
                { month: 'Apr', val: 820, users: 790 },
                { month: 'May', val: 942, users: 856 },
              ]}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fill="transparent" />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="w-32 h-32" /></div>
          <div className="flex items-center gap-2 text-blue-400 mb-8">
             <Sparkles className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{lang === 'zh' ? 'AI 工作台智能提示' : 'AI Workbench Insights'}</span>
          </div>
          <h3 className="text-xl font-bold mb-6">{lang === 'zh' ? '关键待办事项' : 'Critical Tasks'}</h3>
          <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
             {tasks.map((item, i) => (
               <div key={i} onClick={() => onNavigate(item.type as any)} className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group border border-white/5">
                 <div className="flex justify-between items-start">
                   <p className="text-sm font-bold text-slate-200 leading-snug">{item.title}</p>
                   <span className="text-[10px] text-slate-500">{item.time}</span>
                 </div>
                 <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-blue-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                   {lang === 'zh' ? '进入功能详情' : 'View Details'} <ArrowUpRight className="w-3 h-3" />
                 </div>
               </div>
             ))}
          </div>
          <button onClick={() => onNavigate('requests')} className="w-full mt-6 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 uppercase tracking-widest">
            {lang === 'zh' ? '进行合规复核' : 'Run Compliance Audit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
