
import React, { useState, useContext, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, XAxis as BarXAxis, YAxis as BarYAxis
} from 'recharts';
import { 
  Briefcase, Activity, Target, Plus, ChevronLeft, Users, 
  Search, X, ExternalLink, ArrowUpRight, TrendingUp, PieChart as PieIcon, BarChart3, Calendar
} from 'lucide-react';
import PortfolioCreateForm from './PortfolioCreateForm';
import { LanguageContext } from '../App';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

interface Subscriber {
  id: string;
  name: string;
  nameEn: string;
  invested: number;
  pl: number;
  date: string;
}

const mockSubscribers: Record<string, Subscriber[]> = {
  'P01': [
    { id: 'C001', name: '李强', nameEn: 'Li Qiang', invested: 1200000, pl: 85400, date: '2024-01-12' },
    { id: 'C002', name: '王芳', nameEn: 'Wang Fang', invested: 2500000, pl: 142000, date: '2023-12-05' },
    { id: 'C004', name: '刘洋', nameEn: 'Liu Yang', invested: 550000, pl: -12000, date: '2024-02-18' },
  ],
  'P02': [
    { id: 'C003', name: '张伟', nameEn: 'Zhang Wei', invested: 4500000, pl: 210000, date: '2023-09-20' },
    { id: 'C005', name: '陈静', nameEn: 'Chen Jing', invested: 150000, pl: 2300, date: '2024-03-01' },
  ],
  'NEW': []
};

type TimeRange = '24h' | '3d' | '1w' | '1m' | '6m';

// 模拟趋势数据生成器
const generateTrendData = (range: TimeRange) => {
  const data = [];
  const now = new Date();
  let points = 0;
  let hoursStep = 1;

  switch(range) {
    case '24h': 
      points = 24; 
      hoursStep = 1; 
      break;
    case '3d': 
      points = 12; 
      hoursStep = 6; 
      break;
    case '1w': 
      points = 14; 
      hoursStep = 12; 
      break;
    case '1m': 
      points = 30; 
      hoursStep = 24; 
      break;
    case '6m': 
      points = 26; 
      hoursStep = 24 * 7; 
      break;
  }

  let val = 1.0;
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * hoursStep * 60 * 60 * 1000);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    
    val *= (1 + (Math.random() * 0.04 - 0.015));
    data.push({ 
      time: `${month}-${day} ${hour}:${minute}`, 
      val: parseFloat(val.toFixed(4)) 
    });
  }
  return data;
};

type PortfolioTab = 'allocation' | 'holders' | 'trend';

const PortfolioCard: React.FC<{ 
  p: any, 
  onViewAllSubs: (p: any) => void,
  lang: string,
  t: (k: string) => string
}> = ({ p, onViewAllSubs, lang, t }) => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('allocation');
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');

  const trendData = useMemo(() => generateTrendData(timeRange), [timeRange]);

  const renderRightContent = () => {
    switch (activeTab) {
      case 'allocation':
        return (
          <div className="h-56 animate-in fade-in duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={p.assets} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <BarXAxis type="number" hide />
                <BarYAxis 
                  dataKey="name" 
                  type="category" 
                  width={80} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {p.assets.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'holders':
        const subs = mockSubscribers[p.id] || [];
        return (
          <div className="h-56 flex flex-col justify-center gap-2 animate-in fade-in duration-300 overflow-hidden px-2">
            {subs.length > 0 ? (
              subs.slice(0, 4).map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-100 transition-all cursor-default group/sub shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[8px]">
                      {lang === 'zh' ? sub.name[0] : sub.nameEn[0]}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">{lang === 'zh' ? sub.name : sub.nameEn}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-900">
                      {lang === 'zh' ? `¥${(sub.invested/10000).toFixed(0)}w` : `$${(sub.invested/7000).toFixed(0)}k`}
                    </span>
                    <span className={`text-[8px] font-bold ${sub.pl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {sub.pl >= 0 ? '+' : ''}{sub.pl.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-300 italic text-xs py-8">{t('status_inactive')}</div>
            )}
            <button 
              onClick={() => onViewAllSubs(p)}
              className="mt-2 text-[10px] font-black text-blue-600 hover:underline flex items-center justify-center gap-1"
            >
              {t('btn_view_subs')} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        );
      case 'trend':
        return (
          <div className="h-56 animate-in fade-in duration-300 flex flex-col">
            <div className="flex items-center gap-1 mb-2 px-2 overflow-x-auto scrollbar-hide shrink-0">
              {(['24h', '3d', '1w', '1m', '6m'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase transition-all whitespace-nowrap ${
                    timeRange === r ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t(`range_${r}`)}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                  <defs>
                    <linearGradient id={`grad-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 7, fill: '#94a3b8' }} 
                    interval="preserveStartEnd"
                    minTickGap={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fill: '#94a3b8' }} 
                    domain={['dataMin - 0.02', 'dataMax + 0.02']} 
                    width={35}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2.5} fill={`url(#grad-${p.id})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
    }
  };

  const tabs: {id: PortfolioTab, label: string, icon: any}[] = [
    { id: 'allocation', label: t('tab_allocation'), icon: BarChart3 },
    { id: 'holders', label: t('tab_holders'), icon: Users },
    { id: 'trend', label: t('tab_trend'), icon: TrendingUp },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 overflow-hidden hover:border-blue-400 hover:shadow-2xl transition-all group relative flex flex-col h-[600px]">
      {p.id === 'NEW' && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl shadow-lg z-10 animate-pulse">
          New Strategy
        </div>
      )}
      
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-none mb-2">{p.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{p.id}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                p.risk === t('risk_agg') ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
              }`}>{p.risk}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{t('port_aum_label')}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">
            {lang === 'zh' ? `¥${(p.aum / 10000).toFixed(0)}万` : `$${(p.aum / 7 / 10000).toFixed(0)}M`}
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-8 items-stretch mb-8 overflow-hidden">
        <div className="bg-slate-50/50 rounded-[2rem] p-4 flex flex-col items-center justify-center relative border border-slate-100 shadow-inner overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-1.5">
             <PieIcon className="w-3.5 h-3.5 text-blue-500" />
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fixed Asset View</span>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={p.assets} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                  {p.assets.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Structure</p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white border border-slate-100 rounded-[2rem] shadow-sm p-4 min-h-0 overflow-hidden">
             {renderRightContent()}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
          <Activity className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t('port_vol')}</p>
          <p className="text-sm font-black text-slate-800">{p.risk === t('risk_agg') ? t('port_high') : t('port_low')}</p>
        </div>
        <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-50">
          <Target className="w-5 h-5 text-purple-500 mx-auto mb-2" />
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t('port_exp_return')}</p>
          <p className="text-sm font-black text-slate-800">{p.risk === t('risk_agg') ? '12.5%' : '4.2%'}</p>
        </div>
        <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-50">
          <Users className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t('port_sub_label')}</p>
          <p className="text-sm font-black text-slate-800">{p.subs}</p>
        </div>
      </div>
    </div>
  );
};

const PortfolioGallery: React.FC = () => {
  const { lang, t } = useContext(LanguageContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any | null>(null);
  const [portfolios, setPortfolios] = useState<any[]>([
    { 
      id: 'P01', 
      name: t('zh' === lang ? '全球科技成长组合 A1' : 'Global Tech Growth A1'), 
      risk: t('risk_agg'), 
      aum: 4250000, 
      subs: 12,
      assets: [
        { name: lang === 'zh' ? '科技龙头' : 'Tech Leads', value: 60 },
        { name: lang === 'zh' ? '新兴市场' : 'Emerging', value: 20 },
        { name: lang === 'zh' ? '私募股权' : 'Private', value: 15 },
        { name: lang === 'zh' ? '现金预留' : 'Cash', value: 5 },
      ]
    },
    { 
      id: 'P02', 
      name: t('zh' === lang ? '稳健养老配置组合 B2' : 'Steady Pension B2'), 
      risk: t('risk_con'), 
      aum: 8520000, 
      subs: 45,
      assets: [
        { name: lang === 'zh' ? '政府国债' : 'Gov Bonds', value: 50 },
        { name: lang === 'zh' ? '分红股' : 'Dividend', value: 30 },
        { name: lang === 'zh' ? '企业债' : 'Credit', value: 15 },
        { name: lang === 'zh' ? '流动金' : 'Liquidity', value: 5 },
      ]
    },
  ]);

  const handlePublish = (newPortfolio: any) => {
    setPortfolios([newPortfolio, ...portfolios]);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button 
          onClick={() => setShowCreateForm(false)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {t('btn_back')}
        </button>
        <PortfolioCreateForm 
          onCancel={() => setShowCreateForm(false)} 
          onPublish={handlePublish}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t('port_title')}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">{t('port_subtitle')}</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-3xl text-sm font-black hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {t('btn_create_port')}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {portfolios.map((p) => (
          <PortfolioCard 
            key={p.id} 
            p={p} 
            onViewAllSubs={setSelectedPortfolio} 
            lang={lang} 
            t={t} 
          />
        ))}
      </div>

      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPortfolio(null)} />
          <div className="w-full max-w-xl bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{selectedPortfolio.id}</div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedPortfolio.name}</h2>
              </div>
              <button onClick={() => setSelectedPortfolio(null)} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-7 h-7 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  {t('sub_title')} ({selectedPortfolio.subs})
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-blue-100 transition-all w-48 shadow-inner" placeholder="Search..." />
                </div>
              </div>

              {mockSubscribers[selectedPortfolio.id]?.length > 0 ? (
                <div className="space-y-5">
                  {mockSubscribers[selectedPortfolio.id].map((sub) => (
                    <div key={sub.id} className="p-6 border border-slate-100 rounded-[2rem] hover:bg-slate-50 hover:border-blue-200 transition-all group shadow-sm bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg">
                            {lang === 'zh' ? sub.name[0] : sub.nameEn[0]}
                          </div>
                          <div>
                            <div className="text-base font-black text-slate-800">{lang === 'zh' ? sub.name : sub.nameEn}</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{sub.id} • {sub.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900">
                             {lang === 'zh' ? `¥${sub.invested.toLocaleString()}` : `$${(sub.invested / 7).toLocaleString(undefined, {maximumFractionDigits:0})}`}
                          </div>
                          <div className={`text-xs font-bold flex items-center justify-end gap-1.5 mt-1 ${sub.pl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                             {sub.pl >= 0 ? '+' : ''}{sub.pl.toLocaleString()}
                             {sub.pl >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-slate-50 flex justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                         <button className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all border border-blue-100">
                            Open Profile <ExternalLink className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                  <Users className="w-20 h-20 opacity-10 mb-6" />
                  <p className="text-base font-black text-slate-400">{lang === 'zh' ? '暂无持仓客户' : 'No Holders Found'}</p>
                </div>
              )}
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 rounded-t-[3rem] shrink-0">
               <div className="flex items-center justify-between mb-6">
                 <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{lang === 'zh' ? '该策略总计盈亏' : 'Strategy Total P/L'}</span>
                 <span className="text-xl font-black text-emerald-600">+¥1,245,000</span>
               </div>
               <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-2xl hover:bg-slate-800 transition-all transform active:scale-[0.98]">
                  {lang === 'zh' ? '导出客户名单报告' : 'Export holder reports'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
