
import React, { useContext, useState } from 'react';
import { Compass, ShieldCheck, Target, ChevronRight, Users, Wallet, TrendingUp } from 'lucide-react';
import { AppContext } from '../App';
import { RiskLevel } from '../types';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const Marketplace: React.FC<{onStartSigning: (strat: any) => void}> = ({onStartSigning}) => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const strategies = [
    { 
      code: 'ST-001', name: lang === 'zh' ? '全球科技旗舰 A1' : 'Global Tech Flagship A1', risk: RiskLevel.R4, min: 50000, return: '15.4%', 
      tags: lang === 'zh' ? ['AI赋能', '纳指联动'] : ['AI Powered', 'Nasdaq Core'], holders: 1284, totalAum: '¥4.2亿',
      composition: [
        { name: lang === 'zh' ? '权益' : 'Equity', value: 75 },
        { name: lang === 'zh' ? '固收' : 'Fixed Income', value: 15 },
        { name: lang === 'zh' ? '现金' : 'Cash', value: 10 },
      ],
      trend: [10, 25, 15, 30, 28, 45, 50, 48, 60, 65]
    },
    { 
      code: 'ST-002', name: lang === 'zh' ? '稳健养老核心收益' : 'Steady Pension Core', risk: RiskLevel.R2, min: 10000, return: '4.8%', 
      tags: lang === 'zh' ? ['红利增长', '低波动'] : ['Dividend', 'Low Vol'], holders: 3521, totalAum: '¥8.9亿',
      composition: [
        { name: lang === 'zh' ? '权益' : 'Equity', value: 20 },
        { name: lang === 'zh' ? '固收' : 'Fixed Income', value: 70 },
        { name: lang === 'zh' ? '现金' : 'Cash', value: 10 },
      ],
      trend: [5, 8, 12, 11, 15, 18, 20, 19, 22, 24]
    },
    { 
      code: 'ST-003', name: lang === 'zh' ? '中欧绿色能源转型' : 'Green Energy Focus', risk: RiskLevel.R3, min: 30000, return: '11.2%', 
      tags: lang === 'zh' ? ['ESG核心', '新兴产业'] : ['ESG Core', 'New Energy'], holders: 856, totalAum: '¥1.5亿',
      composition: [
        { name: lang === 'zh' ? '权益' : 'Equity', value: 60 },
        { name: lang === 'zh' ? '固收' : 'Fixed Income', value: 30 },
        { name: lang === 'zh' ? '现金' : 'Cash', value: 10 },
      ],
      trend: [15, 10, 25, 20, 35, 30, 42, 38, 45, 48]
    },
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('nav_marketplace')}</h1>
          <p className="text-slate-500 text-sm mt-2 flex items-center gap-2 font-bold">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             {lang === 'zh' ? '基于您的风险等级 R3，已为您锁定均衡型策略库。' : 'Based on your R3 profile, Balanced strategies are unlocked.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {strategies.map((st) => (
          <div key={st.code} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-2xl hover:shadow-blue-900/10 transition-all group relative">
            <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center"><Compass className="w-7 h-7" /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{st.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{st.code}</span>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">{st.risk}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang === 'zh' ? '预期目标收益' : 'Target Yield'}</p>
                <p className="text-4xl font-black text-blue-600 tracking-tighter">{st.return}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 h-64">
              <div className="bg-slate-50/50 rounded-[2.5rem] p-6 flex items-center border border-slate-100">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={st.composition} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                        {st.composition.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-3 pl-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{lang === 'zh' ? '资产构成' : 'Allocation'}</p>
                   {st.composition.map((c, i) => (
                     <div key={i} className="flex items-center justify-between text-xs font-bold">
                       <span className="text-slate-500">{c.name}</span>
                       <span className="text-slate-800 font-black">{c.value}%</span>
                     </div>
                   ))}
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 relative shadow-inner">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> {lang === 'zh' ? '历史业绩模拟' : 'Historical Simulation'}</p>
                 <div className="h-40">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={st.trend.map((v, i) => ({v, i}))}>
                         <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.05} />
                      </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-10 border-t border-slate-50">
              <div className="flex gap-12">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shadow-sm"><Users className="w-5 h-5" /></div>
                   <div><p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">{lang === 'zh' ? '已签人数' : 'Subscribers'}</p><p className="text-base font-black text-slate-800">{st.holders}</p></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shadow-sm"><Wallet className="w-5 h-5" /></div>
                   <div><p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">{lang === 'zh' ? '管理规模' : 'Total AUM'}</p><p className="text-base font-black text-slate-800">{st.totalAum}</p></div>
                </div>
              </div>
              <button onClick={() => onStartSigning(st)} className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl uppercase tracking-widest">
                {t('btn_sign_sub')} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
