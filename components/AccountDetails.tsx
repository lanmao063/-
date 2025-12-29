
import React, { useContext, useState, useMemo } from 'react';
import { Lock, FileText, Download, TrendingUp, ShieldCheck, PowerOff, RefreshCw, X, Info, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { AppContext } from '../App';
import { RequestType, RequestStatus } from '../types';

const AccountDetails: React.FC = () => {
  const ctx = useContext(AppContext);
  const { lang, t, agreements, setAgreements, balance, setBalance, setRequests } = ctx!;
  
  const [terminatingId, setTerminatingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPortfolioValue = useMemo(() => {
    return agreements.reduce((sum, ag) => sum + (ag.amount || 0), 0);
  }, [agreements]);

  const cashBalance = useMemo(() => {
    return balance - totalPortfolioValue;
  }, [balance, totalPortfolioValue]);

  const handleInitiateTermination = (id: string) => {
    setTerminatingId(id);
  };

  const handleConfirmTermination = () => {
    if (!terminatingId) return;
    
    setIsProcessing(true);
    
    // 模拟清仓结转流程
    setTimeout(() => {
      const target = agreements.find(ag => ag.id === terminatingId);
      if (target) {
        const performanceFee = target.amount * 0.001; 
        
        // 核心改动：投资者端立即结转资产 (不经过经理审核)
        setBalance(prev => prev - performanceFee);
        setAgreements(agreements.filter(ag => ag.id !== terminatingId));

        // 核心改动：自动产生一条“清算通知”发送至经理侧的合规监控中心
        const newRequest = {
          id: `TERM-${new Date().getTime()}`,
          type: RequestType.TERMINATION,
          customerName: 'Sarah Chen', // 模拟当前登录名
          customerId: 'WA-0856',
          amount: target.amount,
          date: new Date().toISOString().split('T')[0],
          status: RequestStatus.SUCCESS, // 设置为 SUCCESS 表示已结转/已归档
          portfolioName: target.strategyName,
          suitabilityPassed: true
        };
        setRequests(prev => [newRequest, ...prev]);

        setIsProcessing(false);
        setTerminatingId(null);
        
        const refundAmount = target.amount - performanceFee;
        alert(lang === 'zh' 
          ? `解约清算成功！资金已即时回笼。\n\n已归还现金：¥${target.amount.toLocaleString()}\n结算计提费用：-¥${performanceFee.toFixed(2)}\n最终到账金额：¥${refundAmount.toLocaleString()}\n\n* 合规流水已同步至经理端监控中心。` 
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
           {agreements.length > 0 ? agreements.map((ag: any) => (
             <div key={ag.id} className="p-10 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner"><TrendingUp className="w-8 h-8" /></div>
                   <div><p className="text-lg font-black text-slate-800 mb-1">{ag.strategyName}</p><p className="text-[11px] font-mono text-slate-400 tracking-tight uppercase">{ag.id} • {ag.signDate}</p></div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{lang === 'zh' ? '估值' : 'Value'}</p><p className="text-xl font-black text-slate-800">¥{ag.amount?.toLocaleString()}</p></div>
                   <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                     <button title={t('btn_terminate')} onClick={() => handleInitiateTermination(ag.id)} className="w-12 h-12 bg-red-50 text-red-500 border border-red-100 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><PowerOff className="w-5 h-5" /></button>
                     <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all"><Download className="w-5 h-5" /></div>
                   </div>
                </div>
             </div>
           )) : <div className="p-24 text-center text-slate-400 font-black uppercase tracking-widest">目前无持仓组合，资金已回笼至现金。</div>}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
