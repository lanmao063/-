
import React, { useState, useContext } from 'react';
import { FlaskConical, Zap, Sliders, TrendingUp, Sparkles, Bot, ArrowRight, Save, Globe } from 'lucide-react';
// Changed from LanguageContext to AppContext
import { AppContext } from '../App';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const StrategyLab: React.FC = () => {
  // Use AppContext instead of LanguageContext
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;
  const [blInput, setBlInput] = useState('看多港股互联网，预期收益 15%；看淡避险资产。');
  const [isCalculating, setIsCalculating] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('nav_lab')}</h1>
          <p className="text-slate-500 text-sm mt-1">{lang === 'zh' ? '基于 Black-Litterman 模型与多因子选基规则构建智能投顾策略。' : 'Build robo-advisory strategies via BL Model & Multi-Factor selection.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-slate-800">{lang === 'zh' ? 'Black-Litterman 模型主观观点录入' : 'BL Model - Subjective View Input'}</h3>
            </div>
            <textarea 
              value={blInput}
              onChange={(e) => setBlInput(e.target.value)}
              className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all"
              placeholder="请输入您的市场观点..."
            />
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => { setIsCalculating(true); setTimeout(() => setIsCalculating(false), 2000); }}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {isCalculating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                {t('btn_run_bl')}
              </button>
              <button className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                {lang === 'zh' ? '保存草案' : 'Save Draft'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-emerald-500" />
               {lang === 'zh' ? '仿真测试评价 (3年回测)' : 'Simulation & Backtest (3Y)'}
             </h3>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { x: '12m', y: 1.0 }, { x: '24m', y: 1.15 }, { x: '36m', y: 1.28 }
                 ]}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="x" axisLine={false} tickLine={false} />
                   <YAxis hide />
                   <Tooltip />
                   <Area type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} fillOpacity={0.1} fill="#3b82f6" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-6 flex justify-between items-center bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
               <div>
                 <p className="text-xs font-bold text-emerald-800">{lang === 'zh' ? '回测结果：达标' : 'Backtest Verdict: PASS'}</p>
                 <p className="text-[10px] text-emerald-600 font-medium">夏普比率 2.15 | 年化超额收益 8.4%</p>
               </div>
               <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                 {lang === 'zh' ? '策略上架发布' : 'Publish Strategy'}
                 <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <Sliders className="w-5 h-5 text-purple-500" />
              {lang === 'zh' ? '多因子选基因子设置' : 'Multi-Factor Selection'}
            </h3>
            <div className="space-y-6">
              {['夏普比率', 'Alpha贡献', '波动控制', '规模优先'].map((factor) => (
                <div key={factor} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{factor}</span>
                    <span>75%</span>
                  </div>
                  <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
             <div className="flex items-center gap-2 mb-4">
               <Globe className="w-5 h-5 text-blue-400" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Asset View</span>
             </div>
             <h4 className="text-lg font-bold mb-4">{lang === 'zh' ? '当前配置矩阵' : 'Asset Matrix'}</h4>
             <div className="space-y-4">
               {[
                 { label: '港股互联网 (EQ)', val: 35 },
                 { label: '美股科技 (EQ)', val: 25 },
                 { label: '信用债 (FI)', val: 30 },
                 { label: '黄金/现金 (ALT)', val: 10 },
               ].map((item) => (
                 <div key={item.label} className="flex items-center justify-between text-xs">
                   <span className="text-slate-400">{item.label}</span>
                   <span className="font-black text-blue-400">{item.val}%</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyLab;
