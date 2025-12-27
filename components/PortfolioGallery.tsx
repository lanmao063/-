
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase, Activity, Target, Plus, ChevronLeft } from 'lucide-react';
import PortfolioCreateForm from './PortfolioCreateForm';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const mockPortfolios = [
  { 
    id: 'P01', 
    name: '全球科技成长组合 A1', 
    risk: '激进型', 
    aum: 42500000, 
    assets: [
      { name: '科技股龙头', value: 60 },
      { name: '新兴市场', value: 20 },
      { name: '私募股权', value: 15 },
      { name: '现金预留', value: 5 },
    ]
  },
  { 
    id: 'P02', 
    name: '稳健养老配置组合 B2', 
    risk: '保守型', 
    aum: 85200000, 
    assets: [
      { name: '政府国债', value: 50 },
      { name: '蓝筹分红股', value: 30 },
      { name: '企业信用债', value: 15 },
      { name: '流动资金', value: 5 },
    ]
  },
];

const PortfolioGallery: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (showCreateForm) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button 
          onClick={() => setShowCreateForm(false)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          返回组合列表
        </button>
        <PortfolioCreateForm onCancel={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">标准投资组合库</h1>
          <p className="text-slate-500 text-sm">管理资产分配模板及各类风险偏好下的标准持仓结构。</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Plus className="w-4 h-4" />
          创建新组合方案
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {mockPortfolios.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden hover:border-blue-300 transition-colors group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">编码: {p.id}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      p.risk === '激进型' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>{p.risk}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">托管资产总规模</p>
                <p className="text-lg font-black text-slate-800">¥{(p.aum / 10000).toFixed(0)}万</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={p.assets}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {p.assets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">目标资产配置比</h4>
                {p.assets.map((asset, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-medium text-slate-700">{asset.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{asset.value}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${asset.value}%`, backgroundColor: COLORS[i % COLORS.length] }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <Activity className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">风险波动</p>
                <p className="text-xs font-bold text-slate-800">{p.risk === '激进型' ? '极高' : '极低'}</p>
              </div>
              <div>
                <Target className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">预期年化</p>
                <p className="text-xs font-bold text-slate-800">{p.risk === '激进型' ? '12.5%' : '4.2%'}</p>
              </div>
              <div>
                <Activity className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">流动性</p>
                <p className="text-xs font-bold text-slate-800">T + 2</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGallery;
