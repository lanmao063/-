
import React, { useState, useContext, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, Bot, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Info, Zap, Loader2
} from 'lucide-react';
import { AppContext } from '../App';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Props {
  portfolio: any;
  onCancel: () => void;
  onConfirm: (newFunds: any[]) => void;
}

const ManualRebalance: React.FC<Props> = ({ portfolio, onCancel, onConfirm }) => {
  const ctx = useContext(AppContext);
  const { lang } = ctx!;
  
  const [currentFunds, setCurrentFunds] = useState(portfolio.funds.map((f: any) => ({ ...f, currentVal: f.val })));
  const [isProcessing, setIsProcessing] = useState(false);

  const totalWeight = useMemo(() => {
    return currentFunds.reduce((sum: number, f: any) => sum + (parseFloat(f.currentVal) || 0), 0);
  }, [currentFunds]);

  const isBalanced = Math.abs(totalWeight - 100) < 0.01;

  // 模拟 AI 动态分析结果
  const dynamicAIStats = useMemo(() => {
    // 根据配比偏离原始值的程度生成波动的 AI 参数
    const diffSum = currentFunds.reduce((sum: number, f: any) => sum + Math.abs(f.currentVal - f.val), 0);
    const returnLift = (1.2 + diffSum * 0.05).toFixed(1);
    const volReduction = (0.5 + diffSum * 0.02).toFixed(1);
    const sharpeLift = (0.24 + diffSum * 0.01).toFixed(2);
    
    return {
      returnLift,
      volReduction,
      sharpeLift
    };
  }, [currentFunds]);

  const handleWeightChange = (index: number, val: string | number) => {
    const next = [...currentFunds];
    // 处理空输入
    if (val === '') {
      next[index].currentVal = '';
    } else {
      let num = parseFloat(val as string);
      if (num > 100) num = 100;
      if (num < 0) num = 0;
      next[index].currentVal = num;
    }
    setCurrentFunds(next);
  };

  const aiInsight = useMemo(() => {
    if (!isBalanced) return lang === 'zh' ? "当前权重尚未配平至 100%，请继续调整。" : "Weights not yet balanced to 100%.";
    return lang === 'zh' 
      ? `经 AI 实时分析，当前调仓策略相比原方案预期收益提升 ${dynamicAIStats.returnLift}%，波动率下降 ${dynamicAIStats.volReduction}%。` 
      : `AI real-time analysis: Expected return +${dynamicAIStats.returnLift}%, Volatility -${dynamicAIStats.volReduction}% vs original.`;
  }, [isBalanced, lang, dynamicAIStats]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right duration-500 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">手动干预调仓：{portfolio.name}</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Portfolio: {portfolio.id} | AUM: ¥{(portfolio.aum / 10000).toFixed(0)}万</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${isBalanced ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200 animate-pulse'}`}>
          当前总权重: {totalWeight.toFixed(1)}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">基金名称</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">调仓滑动条</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">变动后配比 & 额度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentFunds.map((fund: any, i: number) => {
                  const currentNum = parseFloat(fund.currentVal) || 0;
                  const weightDiff = currentNum - fund.val;
                  const amountDiff = (portfolio.aum * weightDiff / 100);
                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-10 py-8">
                        <p className="text-sm font-black text-slate-800">{fund.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">原始配比: {fund.val}%</p>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-3">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="0.1"
                            value={fund.currentVal === '' ? 0 : fund.currentVal} 
                            onChange={(e) => handleWeightChange(i, e.target.value)}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-[10px] font-black text-slate-300">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="space-y-1">
                          <div className="flex items-center justify-end gap-2">
                            <input 
                              type="number"
                              value={fund.currentVal}
                              onChange={(e) => handleWeightChange(i, e.target.value)}
                              className="w-24 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-right font-black text-slate-900 focus:bg-white focus:border-blue-400 outline-none transition-all"
                            />
                            <span className="text-xs font-black text-slate-400">%</span>
                          </div>
                          <div className={`text-[11px] font-bold ${weightDiff > 0 ? 'text-emerald-500' : weightDiff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                            {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)}% ({weightDiff > 0 ? '+' : ''}{(amountDiff/10000).toFixed(1)}w)
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button 
            onClick={() => { 
              setIsProcessing(true); 
              setTimeout(() => { 
                setIsProcessing(false); 
                // 将结果同步回策略库对应的基金列表
                const finalFunds = currentFunds.map((f: any) => ({ ...f, val: parseFloat(f.currentVal) || 0 }));
                onConfirm(finalFunds); 
              }, 2000); 
            }}
            disabled={!isBalanced || isProcessing}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
            应用并提交人工调仓结果
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-10"><Bot className="w-32 h-32" /></div>
             <div className="flex items-center gap-2 text-blue-400 mb-6">
               <Sparkles className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">AI 大模型辅助分析</span>
             </div>
             
             <div className="space-y-6">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-xs italic leading-relaxed text-slate-300 font-medium">"{aiInsight}"</p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">实时模拟收益分布 (1Y)</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[{v:10}, {v:15}, {v:12}, {v:18}, {v:22}, {v:25}].map(d => ({ v: d.v * (1 + (totalWeight-100)/500) }))}>
                        <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase mb-1">夏普比率提升</p>
                    <p className="text-lg font-black text-emerald-400">+{dynamicAIStats.sharpeLift}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase mb-1">波动率变动</p>
                    <p className="text-lg font-black text-blue-400">-{dynamicAIStats.volReduction}%</p>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-start gap-4 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h5 className="text-sm font-black text-amber-900">合规提示 (Suitability)</h5>
              <p className="text-xs text-amber-700 font-medium leading-relaxed mt-1 italic">
                调仓后组合风险暴露需仍维持在 {portfolio.risk} 范围内。若偏离过大，系统将自动触发二级合规复核流程。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualRebalance;
