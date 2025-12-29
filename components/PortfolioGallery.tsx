
import React, { useState, useContext, useMemo } from 'react';
import { 
  TrendingUp, BarChart3, Users, Briefcase, Plus, ArrowUpRight, 
  Activity, Calendar, PieChart as PieIcon, List 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { AppContext } from '../App';
import PortfolioCreateForm from './PortfolioCreateForm';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

// 格式化日期：mm-dd hh-mm-ss
const formatFullDate = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${mm}-${dd} ${hh}-${min}-${ss}`;
};

// 生成模拟趋势数据
const generateTrendData = (range: '1D' | '1W' | '6M') => {
  const data = [];
  const now = new Date();
  let points = 20;
  let interval = 0;

  if (range === '1D') { points = 24; interval = 3600 * 1000; } // 每小时
  else if (range === '1W') { points = 7; interval = 24 * 3600 * 1000; } // 每天
  else { points = 30; interval = 6 * 24 * 3600 * 1000; } // 每6天

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

const PortfolioCard: React.FC<{ p: any, t: (k: string) => string }> = ({ p, t }) => {
  const [activeRightView, setActiveRightView] = useState<'dist' | 'holders' | 'trend'>('dist');
  const [trendRange, setTrendRange] = useState<'1D' | '1W' | '6M'>('6M');

  const trendData = useMemo(() => generateTrendData(trendRange), [trendRange]);

  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group flex flex-col h-[700px]">
      {/* 头部信息 */}
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
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">当前 AUM</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">¥{(p.aum / 10000).toFixed(0)}万</p>
        </div>
      </div>

      {/* 主体双栏布局 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-8 overflow-hidden">
        
        {/* 左侧：资产构成饼图 (2/5) */}
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

        {/* 右侧：功能切换区 (3/5) */}
        <div className="lg:col-span-3 flex flex-col bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-inner relative">
          {/* 功能选择器 (滑动胶囊样式) */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            {[
              { id: 'dist', label: '持仓占比', icon: BarChart3 },
              { id: 'holders', label: '持有分布', icon: Users },
              { id: 'trend', label: '业绩趋势', icon: TrendingUp },
            ].map((v) => (
              <button 
                key={v.id} 
                onClick={() => setActiveRightView(v.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeRightView === v.id ? 'bg-white text-blue-600 shadow-sm shadow-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <v.icon className="w-3.5 h-3.5" /> {v.label}
              </button>
            ))}
          </div>

          {/* 右侧内容动态区域 */}
          <div className="flex-1 overflow-hidden relative">
            {/* 1. 条形图展示每种基金占比 */}
            {activeRightView === 'dist' && (
              <div className="h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={p.funds || [
                    { name: '中欧电子', val: 35 },
                    { name: '华夏红利', val: 25 },
                    { name: '富国成长', val: 20 },
                    { name: '现金储备', val: 20 }
                  ]} layout="vertical" margin={{ left: 0, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} width={60} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="val" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 2. 持有者分布 */}
            {activeRightView === 'holders' && (
              <div className="h-full space-y-3 overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-right-4 duration-300">
                {[
                  { name: 'Sarah Chen', id: 'WA-0856', amount: '125.0w', status: 'Active' },
                  { name: 'Li Qiang', id: 'WA-1022', amount: '84.2w', status: 'Active' },
                  { name: 'Wang Fang', id: 'WA-0599', amount: '210.5w', status: 'Pending' },
                  { name: 'Zhang Wei', id: 'WA-2201', amount: '45.0w', status: 'Active' },
                  { name: 'Liu Yang', id: 'WA-0311', amount: '12.0w', status: 'Inactive' },
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

            {/* 3. 业绩趋势 (mm-dd hh-mm-ss) */}
            {activeRightView === 'trend' && (
              <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                {/* 时间范围选择 */}
                <div className="flex justify-end gap-2 mb-4">
                  {(['1D', '1W', '6M'] as const).map(r => (
                    <button 
                      key={r} 
                      onClick={() => setTrendRange(r)}
                      className={`px-3 py-1 rounded-md text-[9px] font-black border transition-all ${
                        trendRange === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 7, fontWeight: 700, fill: '#94a3b8' }}
                        interval={trendRange === '6M' ? 5 : 2}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 8, fontWeight: 700, fill: '#94a3b8' }}
                        domain={['auto', 'auto']}
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#3b82f6', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部按钮区 */}
      <div className="pt-8 mt-6 border-t border-slate-50 flex justify-between items-center">
         <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group/btn">
            {t('btn_view_subs')} <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
  const { lang, t } = ctx;
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const portfolios = [
    { 
      id: 'P01', 
      name: '科技成长旗舰 A1', 
      risk: '进取型', 
      aum: 4250000, 
      assets: [{ name: '权益', value: 80 }, { name: '现金', value: 20 }],
      funds: [
        { name: '中欧电子', val: 35 },
        { name: '华夏半导体', val: 25 },
        { name: '富国成长', val: 20 },
        { name: '现金储备', val: 20 }
      ]
    },
    { 
      id: 'P02', 
      name: '稳健养老配置 B2', 
      risk: '平衡型', 
      aum: 8520000, 
      assets: [{ name: '固收', value: 70 }, { name: '权益', value: 30 }],
      funds: [
        { name: '博时短债', val: 40 },
        { name: '工银固收', val: 30 },
        { name: '易方达红利', val: 20 },
        { name: '现金余额', val: 10 }
      ]
    },
  ];

  if (showCreateForm) return <PortfolioCreateForm onCancel={() => setShowCreateForm(false)} onPublish={() => setShowCreateForm(false)} />;

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
        {portfolios.map((p) => <PortfolioCard key={p.id} p={p} t={t} />)}
      </div>
    </div>
  );
};

export default PortfolioGallery;
