
import React, { useContext } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  FileCheck, ShieldCheck, Lock, Users, ArrowUpRight, Sparkles, Zap, Activity, PowerOff, Database, Bell
} from 'lucide-react';
import { AppContext } from '../App';

const Dashboard: React.FC<{ onNavigate: (v: any) => void }> = ({ onNavigate }) => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const stats = [
    { label: lang === 'zh' ? '管理资产规模 (AUM)' : 'Total AUM', value: '¥12.48 亿', change: '+8.4%', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: lang === 'zh' ? '生效投顾协议' : 'Active Agreements', value: '942 份', change: '82.4%', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: lang === 'zh' ? '今日清算通知' : 'Liquidation Logs', value: '3 条', change: lang === 'zh' ? '自动结转' : 'Settled', icon: PowerOff, color: 'text-red-600', bg: 'bg-red-50' },
    { label: lang === 'zh' ? '合规风险矩阵' : 'Risk Monitor', value: lang === 'zh' ? '稳健' : 'SECURE', change: '100%', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('nav_dashboard_manager')}</h1>
          <p className="text-slate-500 text-sm mt-1 font-bold">
            {lang === 'zh' ? '下午好，Alex。今日系统已完成 98.5% 的日终清算对账流程，暂未发现异常。' : 'Good Afternoon, Alex. 98.5% of daily settlement logs are synchronized.'}
          </p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center animate-pulse"><Database className="w-5 h-5" /></div>
           <div className="text-left">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">清算对账引擎</p>
             <p className="text-xs font-black text-slate-800 tracking-tighter">运行中 (T+0 同步)</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
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
        <div className="lg:col-span-2 bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm h-[420px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Activity className="w-5 h-5 text-blue-500" />
               AUM 增长与投资者分布趋势
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /><span className="text-[10px] font-bold text-slate-400">AUM Scale</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full" /><span className="text-[10px] font-bold text-slate-400">Net Flow</span></div>
            </div>
          </div>
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
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fill="url(#colorVal)" />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="w-32 h-32" /></div>
          <div className="flex items-center gap-2 text-blue-400 mb-8">
             <Bell className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI 智能合规看板</span>
          </div>
          <h3 className="text-xl font-bold mb-6">今日待办公作列表</h3>
          <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
             {[
               { title: '收到 3 位投资者的解约清算通知', time: '现在', type: 'requests', urgent: true },
               { title: '核心组合 A1 偏离度预警 (8.5%)', time: '12m', type: 'requests', urgent: true },
               { title: '投资者 Wang Fang 的 KYC 即将失效', time: '1h', type: 'requests' },
               { title: 'AI 模型已生成 3 月月度调仓流水', time: '3h', type: 'requests' },
               { title: '2 月份投资运作报告已生成', time: '5h', type: 'reports' },
             ].map((item, i) => (
               <div key={i} onClick={() => onNavigate(item.type as any)} className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group border border-white/5">
                 <div className="flex justify-between items-start">
                   <p className={`text-sm font-bold leading-snug ${item.urgent ? 'text-red-400' : 'text-slate-200'}`}>{item.title}</p>
                   <span className="text-[10px] text-slate-500 font-bold">{item.time}</span>
                 </div>
                 <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-blue-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">
                   进入合规处理流程 <ArrowUpRight className="w-3 h-3" />
                 </div>
               </div>
             ))}
          </div>
          <button onClick={() => onNavigate('requests')} className="w-full mt-6 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 uppercase tracking-widest">
             一键归档所有已知通知
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
