
import React, { useContext } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, ClipboardList, AlertCircle, ArrowUpRight, Sparkles, Zap 
} from 'lucide-react';
import { LanguageContext } from '../App';

const Dashboard: React.FC<{ onNavigate: (v: any) => void }> = ({ onNavigate }) => {
  const { lang } = useContext(LanguageContext);

  const data = [
    { name: lang === 'zh' ? '1月' : 'Jan', value: 400 },
    { name: lang === 'zh' ? '2月' : 'Feb', value: 300 },
    { name: lang === 'zh' ? '3月' : 'Mar', value: 600 },
    { name: lang === 'zh' ? '4月' : 'Apr', value: 800 },
    { name: lang === 'zh' ? '5月' : 'May', value: 500 },
    { name: lang === 'zh' ? '6月' : 'Jun', value: 900 },
  ];

  const stats = [
    { 
      label: lang === 'zh' ? '总资产规模 (AUM)' : 'Total AUM', 
      value: lang === 'zh' ? '¥8.24 亿' : '$118.2M', 
      change: '+12.5%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' 
    },
    { 
      label: lang === 'zh' ? '服务客户总数' : 'Active Clients', 
      value: lang === 'zh' ? '1,284 位' : '1,284', 
      change: '+3.2%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' 
    },
    { 
      label: lang === 'zh' ? '待处理任务' : 'Pending Tasks', 
      value: lang === 'zh' ? '12 件' : '12', 
      change: lang === 'zh' ? '8件紧急' : '8 Urgent', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' 
    },
    { 
      label: lang === 'zh' ? '合规风控率' : 'Compliance Rate', 
      value: '99.98%', 
      change: lang === 'zh' ? '健康' : 'Stable', icon: AlertCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {lang === 'zh' ? '下午好，张经理' : 'Good Afternoon, Manager Zhang'}
          </h1>
          <p className="text-slate-500 text-sm">
            {lang === 'zh' ? '这是您今日的资产管理实时数据与预警分析。' : 'Your daily investment oversight and AI-driven insights.'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold">{lang === 'zh' ? 'AI 智能分析已开启' : 'AI Engine Active'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                stat.change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">{lang === 'zh' ? '资产规模增长趋势' : 'AUM Growth Trend'}</h3>
            <select className="text-xs border border-slate-200 rounded-md px-2 py-1 outline-none">
              <option>{lang === 'zh' ? '近6个月' : 'Last 6 Months'}</option>
              <option>{lang === 'zh' ? '近1年' : 'Last 1 Year'}</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800">{lang === 'zh' ? '实时系统预警' : 'System Alerts'}</h3>
             <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">
               {lang === 'zh' ? '急需处理' : 'Urgent'}
             </span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {[
              { 
                title: lang === 'zh' ? 'AI 自动调仓建议: 激进组合 A1' : 'AI Rebalance: Aggressive A1', 
                time: lang === 'zh' ? '5分钟前' : '5m ago', 
                priority: lang === 'zh' ? '紧急' : 'Urgent', isAI: true, type: 'requests' 
              },
              { 
                title: lang === 'zh' ? '大额资金转入: 客户 李忠' : 'Transfer-In: Li Zhong', 
                time: lang === 'zh' ? '1小时前' : '1h ago', 
                priority: lang === 'zh' ? '常规' : 'Normal', isAI: false, type: 'requests' 
              },
              { 
                title: lang === 'zh' ? '资产偏离预警: 稳健增长 B2' : 'Portfolio Drift: Balanced B2', 
                time: lang === 'zh' ? '3小时前' : '3h ago', 
                priority: lang === 'zh' ? '紧急' : 'Urgent', isAI: true, type: 'requests' 
              },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group border ${
                item.isAI ? 'border-purple-100 bg-purple-50/30' : 'border-transparent'
              }`} onClick={() => onNavigate(item.type as any)}>
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  item.priority === (lang === 'zh' ? '紧急' : 'Urgent') ? 'bg-red-500' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{item.title}</p>
                    {item.isAI && <Sparkles className="w-3 h-3 text-purple-500" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                    <span className={`text-[9px] font-bold ${
                      item.priority === (lang === 'zh' ? '紧急' : 'Urgent') ? 'text-red-400' : 'text-slate-400'
                    }`}>{item.priority}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('requests')}
            className="w-full mt-4 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all"
          >
            {lang === 'zh' ? '进入审批任务中心' : 'Open Audit Center'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
