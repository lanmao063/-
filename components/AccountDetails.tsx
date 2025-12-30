
import React, { useContext, useState, useMemo } from 'react';
import { Lock, FileText, Download, TrendingUp, ShieldCheck, PowerOff, RefreshCw, X, Info, ArrowRightLeft, AlertTriangle, ChevronDown, ChevronUp, ChevronRight, History, PieChart as PieIcon, Activity } from 'lucide-react';
import { AppContext } from '../App';
import { RequestType, RequestStatus } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// 模拟历史趋势数据
const generateAgreementTrend = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: `D-${6-i}`,
    val: 100 + Math.random() * 20 - 10
  }));
};

const AccountDetails: React.FC = () => {
  const ctx = useContext(AppContext);
  const { lang, t, agreements, setAgreements, balance, setBalance, setRequests, portfolios } = ctx!;
  
  const [terminatingId, setTerminatingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPortfolioValue = useMemo(() => {
    return agreements.reduce((sum, ag) => sum + (ag.amount || 0), 0);
  }, [agreements]);

  const cashBalance = useMemo(() => {
    return balance - totalPortfolioValue;
  }, [balance, totalPortfolioValue]);

  const handleInitiateTermination = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTerminatingId(id);
  };

  const handleConfirmTermination = () => {
    if (!terminatingId) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const target = agreements.find(ag => ag.id === terminatingId);
      if (target) {
        const performanceFee = target.amount * 0.001; 
        setBalance(prev => prev - performanceFee);
        setAgreements(agreements.filter(ag => ag.id !== terminatingId));

        const newRequest = {
          id: `TERM-${new Date().getTime()}`,
          type: RequestType.TERMINATION,
          customerName: 'Sarah Chen',
          customerId: 'WA-0856',
          amount: target.amount,
          date: new Date().toISOString().split('T')[0],
          status: RequestStatus.SUCCESS,
          portfolioName: target.strategyName,
          suitabilityPassed: true
        };
        setRequests(prev => [newRequest, ...prev]);

        setIsProcessing(false);
        setTerminatingId(null);
        
        const refundAmount = target.amount - performanceFee;
        alert(lang === 'zh' 
          ? `解约清算成功！资金已即时回笼。\n\n已归还现金：¥${target.amount.toLocaleString()}\n结算计提费用：-¥${performanceFee.toFixed(2)}\n最终到账金额：¥${refundAmount.toLocaleString()}` 
          : `Termination Settled! Funds recouped.\n\nRecouped: ¥${target.amount.toLocaleString()}\nFee: -¥${performanceFee.toFixed(2)}\nNet Received: ¥${refundAmount.toLocaleString()}`);
      } else {
        setIsProcessing(false);
        setTerminatingId(null);
      }
    }, 1200);
  };

  const terminatingInfo = useMemo(() => {
    if (!terminatingId) return null;
    const target = agreements.find(ag => ag.id === terminatingId);
    if (!target) return null;
    const fee = target.amount * 0.001;
    return { name: target.strategyName, val: target.amount, fee, net: target.amount - fee };
  }, [terminatingId, agreements]);

  return (
    <div className="space-y-10 animate-in slide-in-from-right duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{lang === 'zh' ? '财富账户管理' : 'Wealth Account'}</h1>
          <p className="text-slate-500 text-sm mt-2 font-bold">{lang === 'zh' ? '资产独立隔离 · 实时清算对账' : 'Independent isolation · Real-time settlement'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-125 transition-transform"><ShieldCheck className="w-32 h-32" /></div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{lang === 'zh' ? '资产总净值 (NAV)' : 'Total Net Value'}</p>
          <p className="text-3xl font-black tracking-tighter">¥{balance.toLocaleString()}</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-400 font-bold italic">
             {lang === 'zh' ? '包含持仓市值与可用现金' : 'Includes Portfolios & Cash'}
             <Info className="w-3 h-3 cursor-help hover:text-white" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{lang === 'zh' ? '当前持仓市值' : 'Portfolio Value'}</p>
          <p className="text-3xl font-black text-slate-800 tracking-tighter">¥{totalPortfolioValue.toLocaleString()}</p>
          <div className="mt-6 flex items-center gap-2">
            <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(totalPortfolioValue/balance)*100}%` }} /></div>
            <span className="text-[10px] font-black text-slate-400">{((totalPortfolioValue/balance)*100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{lang === 'zh' ? '可用现金余额' : 'Available Cash'}</p>
          <p className="text-3xl font-black text-slate-800 tracking-tighter">¥{cashBalance.toLocaleString()}</p>
          <div className="mt-6 flex items-center gap-4">
             <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">{lang === 'zh' ? '充值' : 'Deposit'}</button>
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:underline flex items-center gap-1">{lang === 'zh' ? '提现' : 'Withdraw'}</button>
          </div>
        </div>
      </div>

      {terminatingId && terminatingInfo && (
        <div className="p-10 bg-red-50 border-4 border-red-100 rounded-[3.5rem] animate-in zoom-in duration-300 shadow-2xl shadow-red-900/10 relative overflow-hidden">
           <button onClick={() => setTerminatingId(null)} className="absolute top-6 right-6 p-2 hover:bg-red-100 rounded-full transition-colors"><X className="w-6 h-6 text-red-400" /></button>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-red-500 text-white rounded-3xl flex items-center justify-center shadow-xl animate-pulse"><PowerOff className="w-10 h-10" /></div>
               <div>
                 <h4 className="text-2xl font-black text-red-900">提示</h4>
                 <p className="text-red-700 text-xs font-bold mt-2 max-w-lg leading-relaxed">{t('terminate_notice')}</p>
               </div>
             </div>
             <div className="bg-white/60 p-6 rounded-[2rem] border border-red-100 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-orange-500" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang === 'zh' ? '清算计提预估明细' : 'Estimated Settlement Fees'}</span></div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-medium text-slate-600"><span>组合现值</span><span className="font-bold">¥{terminatingInfo.val.toLocaleString()}</span></div>
                   <div className="flex justify-between text-xs font-medium text-red-600 italic"><span>预计计提 (0.1%)</span><span className="font-black">- ¥{terminatingInfo.fee.toFixed(2)}</span></div>
                   <div className="pt-2 border-t border-red-100 flex justify-between text-sm font-black text-slate-800"><span>回笼金额</span><span className="text-lg">¥{terminatingInfo.net.toLocaleString()}</span></div>
                </div>
                <button onClick={handleConfirmTermination} disabled={isProcessing} className="w-full mt-6 py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all">
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5" />} {lang === 'zh' ? '确认并即时清仓' : 'Confirm & Liquidate'}
                </button>
             </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><FileText className="w-6 h-6 text-purple-500" /> {lang === 'zh' ? '当前持仓详情' : 'Portfolio Holdings'}</h3>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Lock className="w-4 h-4" /> ACCOUNT: WA-0856</div>
        </div>
        <div className="divide-y divide-slate-50">
           {agreements.length > 0 ? agreements.map((ag: any) => {
             const isExpanded = expandedId === ag.id;
             const pInfo = portfolios.find(p => p.name === ag.strategyName);
             const trendData = useMemo(() => generateAgreementTrend(), [ag.id]);

             return (
               <div key={ag.id} className="transition-all hover:bg-slate-50/30">
                 <div 
                   onClick={() => setExpandedId(isExpanded ? null : ag.id)}
                   className="p-10 flex items-center justify-between cursor-pointer group"
                 >
                    <div className="flex items-center gap-8">
                       <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-inner ${isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                         <TrendingUp className="w-8 h-8" />
                       </div>
                       <div>
                         <p className="text-lg font-black text-slate-800 mb-1 flex items-center gap-2">
                           {ag.strategyName}
                           <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 uppercase tracking-tighter">
                             {pInfo?.risk || 'R3'}
                           </span>
                         </p>
                         <p className="text-[11px] font-mono text-slate-400 tracking-tight uppercase">{ag.id} • 签署于 {ag.signDate}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{lang === 'zh' ? '当前估值' : 'Value'}</p>
                         <p className="text-xl font-black text-slate-800">¥{ag.amount?.toLocaleString()}</p>
                       </div>
                       <div className="flex gap-3">
                         <button 
                            onClick={(e) => handleInitiateTermination(ag.id, e)} 
                            className="w-12 h-12 bg-red-50 text-red-500 border border-red-100 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                         >
                           <PowerOff className="w-5 h-5" />
                         </button>
                         <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm transition-all hover:border-blue-400">
                           {isExpanded ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                         </div>
                       </div>
                    </div>
                 </div>

                 {isExpanded && (
                   <div className="px-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-300">
                      {/* 趋势图 */}
                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col h-48">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" /> 7日净值趋势
                        </p>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                              <defs>
                                <linearGradient id={`grad-${ag.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} fill={`url(#grad-${ag.id})`} />
                              <Tooltip hideCursor />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* 资产明细 */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <PieIcon className="w-3.5 h-3.5" /> 资产配置分布
                        </p>
                        <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide">
                          {pInfo?.funds?.map((f: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-600 truncate mr-4">{f.name}</span>
                              <span className="font-black text-slate-900">{f.val}%</span>
                            </div>
                          )) || <p className="text-[10px] text-slate-300">数据同步中...</p>}
                        </div>
                      </div>

                      {/* 调仓履约记录 */}
                      <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <History className="w-3.5 h-3.5" /> 最近履约记录
                        </p>
                        <div className="space-y-4">
                           <div className="flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                              <div>
                                <p className="text-[11px] font-black">AI 智能配平完成</p>
                                <p className="text-[9px] text-slate-500">2024-03-20 • 偏离度修正</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                              <div>
                                <p className="text-[11px] font-black">月度常规调仓</p>
                                <p className="text-[9px] text-slate-500">2024-03-01 • 标的优选切换</p>
                              </div>
                           </div>
                        </div>
                        <button className="mt-auto pt-4 text-[10px] font-black text-blue-400 uppercase hover:text-white transition-colors text-left flex items-center gap-1">
                          查看完整审计流水 <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                   </div>
                 )}
               </div>
             );
           }) : <div className="p-24 text-center text-slate-400 font-black uppercase tracking-widest">目前无持仓组合，资金已回笼至现金。</div>}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
