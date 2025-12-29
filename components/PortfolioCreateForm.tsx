
import React, { useState, useContext, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Sliders, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Info,
  Loader2,
  Trash2,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Globe
} from 'lucide-react';
import { AppContext } from '../App';

interface FundItem {
  code: string;
  name: string;
  weight: number;
  score: number;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

interface Props {
  onCancel: () => void;
  onPublish: (portfolio: any) => void;
}

const PortfolioCreateForm: React.FC<Props> = ({ onCancel, onPublish }) => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;
  const [step, setStep] = useState(1);
  const [marketView, setMarketView] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [ratios, setRatios] = useState<{name: string, value: number}[]>([]);
  const [factors, setFactors] = useState({ sharpe: 70, alpha: 60, vol: 40, size: 50 });
  const [selectedFunds, setSelectedFunds] = useState<FundItem[]>([]);
  const [backtestData, setBacktestData] = useState<any[]>([]);
  const [verdict, setVerdict] = useState<{status: 'PASS' | 'FAIL', text: string} | null>(null);

  const handleAIAnalyzeView = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setRatios([
        { name: lang === 'zh' ? '高成长科技股' : 'High Growth Tech', value: 50 },
        { name: lang === 'zh' ? '大宗商品/黄金' : 'Commodities/Gold', value: 20 },
        { name: lang === 'zh' ? '红利价值' : 'Dividend Value', value: 20 },
        { name: lang === 'zh' ? '现金储备' : 'Cash Reserves', value: 10 },
      ]);
      setIsAnalyzing(false);
      setStep(2);
    }, 2000);
  };

  const handleAIFundPick = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setSelectedFunds([
        { code: '001594', name: lang === 'zh' ? '天弘中证电子ETF' : 'TH Electronic ETF', weight: 30, score: 92 },
        { code: '512480', name: lang === 'zh' ? '广发中证半导体ETF' : 'GF Semi ETF', weight: 20, score: 88 },
        { code: '161005', name: lang === 'zh' ? '富国天惠成长' : 'FG Growth Alpha', weight: 20, score: 95 },
        { code: '000011', name: lang === 'zh' ? '华夏红利混合' : 'HX Dividend Mix', weight: 20, score: 84 },
        { code: '000000', name: lang === 'zh' ? '货币储备' : 'Cash Reserve', weight: 10, score: 100 },
      ]);
      setIsAnalyzing(false);
      setStep(3);
    }, 1500);
  };

  const handleRunBacktest = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const data = [];
      let baseVal = 1.0;
      let benchmarkVal = 1.0;
      for (let i = 0; i < 36; i++) {
        baseVal *= (1 + (Math.random() * 0.08 - 0.02));
        benchmarkVal *= (1 + (Math.random() * 0.05 - 0.02));
        data.push({ 
          month: `M${i+1}`, 
          portfolio: parseFloat(baseVal.toFixed(4)), 
          benchmark: parseFloat(benchmarkVal.toFixed(4)) 
        });
      }
      setBacktestData(data);
      setVerdict({
        status: 'PASS',
        text: lang === 'zh' 
          ? '该组合在近3年回溯中展现了良好的 Alpha 捕获能力，年化收益 18.2%，最大回撤控制在 12% 以内。符合该等级客户的风险承受能力。' 
          : 'Strategy outperformed with strong Alpha (18.2% CAGR, 12% MaxDD). Well-aligned with target risk profile.'
      });
      setIsAnalyzing(false);
      setStep(4);
    }, 2000);
  };

  const finalPublish = () => {
    const newPort = {
      id: 'NEW',
      name: lang === 'zh' ? 'AI 洞察策略组合' : 'AI Insight Portfolio',
      risk: t('risk_agg'),
      aum: 0,
      subs: 0,
      assets: ratios
    };
    onPublish(newPort);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 px-12 relative">
      <div className="absolute top-1/2 left-24 right-24 h-0.5 bg-slate-100 -z-10"></div>
      {[1, 2, 3, 4].map(s => (
        <div key={s} className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 
            step > s ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-400'
          }`}>
            {step > s ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${step === s ? 'text-blue-600' : 'text-slate-400'}`}>
            {t(`ai_step_${s}`)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-[700px] flex flex-col">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30">
        {renderStepIndicator()}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-500 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {lang === 'zh' ? '开启您的 AI 协同投研之旅' : 'AI Co-pilot Research Terminal'}
              </h2>
              <p className="text-slate-500 font-medium">
                {lang === 'zh' ? '输入您的主观直觉，我们将负责量化回测与标的匹配。' : 'Describe your market view; we handle quantification and fund selection.'}
              </p>
            </div>
            <textarea 
              value={marketView}
              onChange={(e) => setMarketView(e.target.value)}
              className="w-full h-48 p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all outline-none text-slate-700 leading-relaxed font-medium shadow-inner"
              placeholder={t('ai_prompt_ph')}
            />
            <button 
              onClick={handleAIAnalyzeView}
              disabled={!marketView || isAnalyzing}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 uppercase tracking-widest"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {t('ai_btn_analyze')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
            <div className="space-y-8">
              <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-3xl">
                <h3 className="flex items-center gap-2 text-blue-900 font-black text-sm mb-6 uppercase tracking-widest">
                  <Bot className="w-5 h-5" />
                  {lang === 'zh' ? 'AI 策略建议配比' : 'AI Recommended Allocation'}
                </h3>
                <div className="space-y-5">
                  {ratios.map((r, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-black text-slate-700">
                        <span>{r.name}</span>
                        <span>{r.value}%</span>
                      </div>
                      <div className="h-2.5 bg-white rounded-full overflow-hidden border border-blue-100">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${r.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Sliders className="w-4 h-4 text-purple-500" />
                  {t('ai_factors_title')}
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  {Object.entries(factors).map(([key, val]) => (
                    <div key={key} className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {t(`ai_factor_${key}`)}
                      </label>
                      <input 
                        type="range" 
                        value={val} 
                        onChange={(e) => setFactors({...factors, [key]: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                      />
                      <div className="text-right text-xs font-black text-slate-600">{val}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAIFundPick}
                disabled={isAnalyzing}
                className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 uppercase tracking-widest"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                {t('ai_btn_pick')}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-12 bg-slate-50/20 rounded-r-3xl">
               <div className="w-full h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ratios} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={6} dataKey="value" stroke="none">
                      {ratios.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <Globe className="w-12 h-12 text-blue-100" />
                </div>
               </div>
               <div className="mt-8 p-8 bg-slate-900 text-white rounded-3xl w-full shadow-2xl border border-white/10">
                 <p className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">{lang === 'zh' ? '智能引擎诊断报告' : 'AI Diagnostic Report'}</p>
                 <p className="text-sm italic leading-relaxed text-slate-300 font-medium">
                   {lang === 'zh' 
                    ? '根据您的主观观点，系统识别出“进攻性反弹”语义。我们已自动调高弹性资产权重，并锁定了因子评分最高的标的池。'
                    : 'System detected "Aggressive Rebound" sentiment. We have increased alpha-seeking weights and locked high-factor candidates.'}
                 </p>
               </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{lang === 'zh' ? '拟定持仓明细' : 'Draft Portfolio Detail'}</h3>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-xl border border-green-100">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{lang === 'zh' ? '权重已配平 100%' : 'Balanced 100%'}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'zh' ? '代码' : 'Code'}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'zh' ? '基金名称' : 'Fund Name'}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">{lang === 'zh' ? 'AI 评分' : 'AI Score'}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{lang === 'zh' ? '拟分配权重' : 'Weight'}</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedFunds.map((fund, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6 text-xs font-mono text-slate-400 font-bold">{fund.code}</td>
                      <td className="px-8 py-6 text-sm font-black text-slate-800">{fund.name}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-sm ${
                          fund.score > 90 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {fund.score}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input 
                            type="number" 
                            value={fund.weight} 
                            onChange={(e) => {
                              const newFunds = [...selectedFunds];
                              newFunds[i].weight = parseInt(e.target.value) || 0;
                              setSelectedFunds(newFunds);
                            }}
                            className="w-20 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-black text-right outline-none focus:ring-4 focus:ring-blue-100" 
                          />
                          <span className="text-xs font-black text-slate-400">%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-slate-300 hover:text-red-500 transition-all transform hover:scale-110"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setStep(2)}
                className="px-8 py-4 rounded-2xl border border-slate-200 text-slate-500 font-black text-sm hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                {lang === 'zh' ? '返回配置因子' : 'Back to Factors'}
              </button>
              <button 
                onClick={handleRunBacktest}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-2xl flex items-center gap-3 hover:bg-slate-800 transition-all uppercase tracking-widest"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                {t('ai_btn_backtest')}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-6">
                  <div className="h-[400px] bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">{lang === 'zh' ? '3年历史数据回溯结果' : '3Y Historical Backtest'}</h4>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang === 'zh' ? '当前组合' : 'Portfolio'}</span></div>
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-slate-300 rounded-full shadow-sm" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang === 'zh' ? '业绩基准' : 'Benchmark'}</span></div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={backtestData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" hide />
                        <YAxis domain={['auto', 'auto']} hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={4} fillOpacity={0.15} fill="#3b82f6" />
                        <Area type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2.5} fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className={`p-8 rounded-3xl border shadow-xl ${
                    verdict?.status === 'PASS' ? 'bg-emerald-50 border-emerald-100 shadow-emerald-900/5' : 'bg-red-50 border-red-100 shadow-red-900/5'
                  }`}>
                    <div className="flex items-center gap-3 mb-6">
                      {verdict?.status === 'PASS' ? <ShieldCheck className="w-8 h-8 text-emerald-600" /> : <AlertTriangle className="w-8 h-8 text-red-600" />}
                      <h4 className={`text-lg font-black ${verdict?.status === 'PASS' ? 'text-emerald-900' : 'text-red-900'}`}>
                        {verdict?.status === 'PASS' ? t('ai_verdict_pass') : t('ai_verdict_fail')}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium italic opacity-80">
                      "{verdict?.text}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{lang === 'zh' ? '年化收益' : 'Annual Return'}</p>
                      <p className="text-2xl font-black text-blue-600">18.2%</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{lang === 'zh' ? '夏普比率' : 'Sharpe Ratio'}</p>
                      <p className="text-2xl font-black text-blue-600">2.41</p>
                    </div>
                  </div>
               </div>
             </div>

             <div className="p-10 bg-blue-600 text-white rounded-3xl flex items-center justify-between shadow-2xl shadow-blue-200 border-4 border-white">
               <div className="flex items-center gap-6">
                 <div className="p-4 bg-white/20 rounded-2xl shadow-inner"><CheckCircle className="w-10 h-10" /></div>
                 <div>
                   <h4 className="text-xl font-black tracking-tight mb-1">{lang === 'zh' ? '方案上架发布就绪' : 'Launch Ready'}</h4>
                   <p className="text-blue-100 text-sm font-medium">{t('ai_publish_ready')}</p>
                 </div>
               </div>
               <button 
                onClick={finalPublish}
                className="px-10 py-5 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl transform active:scale-95 uppercase tracking-widest"
               >
                 {t('btn_publish')}
                 <ChevronRight className="w-6 h-6" />
               </button>
             </div>
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-white shrink-0">
          <button onClick={onCancel} className="text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-[0.2em] transition-colors">
            {lang === 'zh' ? '放弃当前设计' : 'Discard Design'}
          </button>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
            <Bot className="w-3.5 h-3.5" /> WealthPulse Engine v3.1
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioCreateForm;
