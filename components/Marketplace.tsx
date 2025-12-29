
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Compass, ShieldCheck, Target, ChevronRight, Users, Wallet, TrendingUp, Zap, Loader2, CheckCircle2, ShieldAlert, X, CreditCard, Lock, Smartphone } from 'lucide-react';
import { AppContext } from '../App';
import { RiskLevel } from '../types';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const Marketplace: React.FC<{onStartSigning: (strat: any) => void}> = ({onStartSigning}) => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t, setBalance, addAgreement } = ctx;

  const [buyingStrategy, setBuyingStrategy] = useState<any>(null);
  const [buyStep, setBuyStep] = useState(0); // 0: input, 1: payment, 2: password, 3: processing, 4: success
  const [buyAmount, setBuyAmount] = useState(100000);
  const [paymentMethod, setPaymentMethod] = useState('balance'); // balance, card, alipay, credit
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [processStatus, setProcessStatus] = useState('');

  // 核心改动：进入支付密码环节时自动聚焦第一个输入框
  useEffect(() => {
    if (buyStep === 2) {
      // 延迟 100ms 确保 DOM 已渲染且动画开始执行
      const timer = setTimeout(() => {
        pinRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [buyStep]);

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

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const isPinComplete = pin.every(digit => digit !== '');

  const handleExecuteTransaction = async () => {
    setBuyStep(3);
    const stages = [
      { msg: '正在校验合规签署状态...', delay: 800 },
      { msg: '正在获取最新标的配比...', delay: 600 },
      { msg: '正在拆分主/子申购单...', delay: 1000 },
      { msg: '风控系统：执行合规校验与额度拦截...', delay: 1200 },
      { msg: '核心交易：原子化事务提交中...', delay: 800 },
    ];

    for (const stage of stages) {
      setProcessStatus(stage.msg);
      await new Promise(resolve => setTimeout(resolve, stage.delay));
    }

    const newAg = {
      id: `AG-${Date.now()}`,
      strategyName: buyingStrategy.name,
      signDate: new Date().toISOString().split('T')[0],
      status: '已签署',
      amount: buyAmount
    };
    addAgreement(newAg);
    setBuyStep(4);
  };

  const closeBuyModal = () => {
    setBuyingStrategy(null);
    setBuyStep(0);
    setPin(['', '', '', '', '', '']);
  };

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
              <button onClick={() => {setBuyingStrategy(st); setBuyStep(0);}} className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl uppercase tracking-widest">
                {t('btn_one_click_buy')} <Zap className="w-5 h-5 text-blue-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {buyingStrategy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center"><Zap className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black text-slate-800">{t('btn_one_click_buy')}</h3>
                </div>
                <button onClick={closeBuyModal} className="p-2 hover:bg-white rounded-full transition-all"><X className="w-6 h-6 text-slate-400" /></button>
             </div>
             
             <div className="p-10">
               {buyStep === 0 && (
                 <div className="space-y-8 animate-in fade-in duration-300">
                   <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">拟购入策略</p>
                     <p className="text-lg font-black text-blue-900">{buyingStrategy.name}</p>
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">申购金额 (CNY)</label>
                     <input 
                      type="number" 
                      value={buyAmount} 
                      onChange={(e) => setBuyAmount(Number(e.target.value))}
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-2xl font-black text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all"
                     />
                     <div className="flex justify-between px-2 text-[10px] font-bold text-slate-400">
                        <span>起购: ¥{buyingStrategy.min.toLocaleString()}</span>
                        <span>预计费率: 0.12%</span>
                     </div>
                   </div>
                   <button onClick={() => setBuyStep(1)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all">确认申购金额</button>
                 </div>
               )}

               {buyStep === 1 && (
                 <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div className="text-center">
                      <h4 className="text-lg font-black text-slate-800">选择支付方式</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">支付金额：¥{buyAmount.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'balance', label: '财富账户', sub: 'Wealth Balance', icon: Wallet, color: 'bg-slate-900' },
                        { id: 'alipay', label: '支付宝', sub: 'Alipay', icon: Smartphone, color: 'bg-[#1677FF]' },
                        { id: 'card', label: '银行卡', sub: 'Debit Card', icon: CreditCard, color: 'bg-slate-100 text-slate-900' },
                        { id: 'credit', label: '信用卡', sub: 'Credit Card', icon: CreditCard, color: 'bg-red-50 text-red-600' }
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setPaymentMethod(item.id)}
                          className={`p-5 border-2 rounded-3xl flex flex-col gap-3 transition-all relative overflow-hidden ${paymentMethod === item.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-slate-800">{item.label}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{item.sub}</p>
                          </div>
                          {paymentMethod === item.id && <div className="absolute top-2 right-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /></div>}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setBuyStep(0)} className="flex-1 py-5 border border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">返回修改</button>
                      <button onClick={() => setBuyStep(2)} className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all">确认支付方式</button>
                    </div>
                 </div>
               )}

               {buyStep === 2 && (
                 <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8" /></div>
                      <h4 className="text-lg font-black text-slate-800">支付授权</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">请输入 6 位 PIN 码以确认支付</p>
                    </div>
                    
                    <div className="flex justify-center gap-3">
                      {pin.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => pinRefs.current[i] = el}
                          type="password"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handlePinChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          className="w-12 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-black text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all shadow-sm"
                        />
                      ))}
                    </div>

                    <div className="space-y-4">
                      <button 
                        onClick={handleExecuteTransaction}
                        disabled={!isPinComplete}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-5 h-5" /> 确认授权买入
                      </button>
                      <button onClick={() => setBuyStep(1)} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">更换支付方式</button>
                    </div>
                 </div>
               )}

               {buyStep === 3 && (
                 <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center"><ShieldCheck className="w-10 h-10 text-blue-100" /></div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 mb-2">正在通过核心交易网关...</h4>
                      <p className="text-sm text-slate-400 font-bold italic animate-pulse">"{processStatus}"</p>
                    </div>
                 </div>
               )}

               {buyStep === 4 && (
                 <div className="py-8 text-center space-y-8 animate-in zoom-in duration-300">
                   <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-14 h-14" /></div>
                   <div>
                     <h4 className="text-3xl font-black text-slate-900 mb-2">支付并申购已受理</h4>
                     <p className="text-sm text-slate-500 font-medium px-10">主申购单 (ST-{Date.now()}) 已通过 {paymentMethod.toUpperCase()} 流水授权，成功拆分为 {buyingStrategy.composition.length} 个子基金申购单。</p>
                   </div>
                   <button onClick={closeBuyModal} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 shadow-xl transition-all">查看我的账户</button>
                 </div>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
