
import React, { useContext, useState } from 'react';
import { ShieldCheck, CheckCircle, ArrowRight, HelpCircle, History, AlertCircle } from 'lucide-react';
import { AppContext } from '../App';

const RiskAssessment: React.FC<{onComplete: () => void}> = ({onComplete}) => {
  const ctx = useContext(AppContext);
  const [step, setStep] = useState<number>(0); 
  const [currentQ, setCurrentQ] = useState(0);

  const questions = [
    { text: '您进行投资的主要目的是？', options: ['资产保值', '稳健增长', '追求高额回报'] },
    { text: '您的投资期限通常为？', options: ['1年以内', '1-3年', '3年以上'] },
    { text: '您的家庭年收入中，可用于金融投资的比例是？', options: ['10%以下', '10%-30%', '30%以上'] },
    { text: '您过去三年的投资经验主要集中在？', options: ['银行理财/货币基金', '股票/偏股基金', '期权/衍生品'] },
    { text: '如果资产在短期内下跌 20%，您的第一反应是？', options: ['立即全部卖出', '持续观望', '低位加仓'] },
    { text: '您对投资组合的流动性要求是？', options: ['随时可以变现', '半年到一年可锁定', '三年以上不影响生活'] },
    { text: '您的最高学历是？', options: ['高中及以下', '本科/大专', '硕士及以上'] }
  ];

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {step === 0 && (
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><ShieldCheck className="w-12 h-12" /></div>
          <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">合规风险承受能力测评 (V2.4)</h1>
          <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed text-sm">基于最新证券投资者适当性管理要求，我们需要为您进行多维度的客观评估。</p>
          <button onClick={() => setStep(1)} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto">
            开始专业测评 <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 text-left">
            <AlertCircle className="w-10 h-10 text-slate-300 shrink-0" />
            <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">提示：测评结果有效期为12个月。如有财务状况重大变化，请务必及时更新。我们将在广场中根据结果锁定不适配的激进型策略。</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
           <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">{currentQ + 1}</div>
               <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Question {currentQ + 1} of 7</span>
             </div>
             <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / 7) * 100}%` }} />
             </div>
           </div>
           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center">
             <h2 className="text-3xl font-black text-slate-800 mb-12 leading-tight max-w-2xl">{questions[currentQ].text}</h2>
             <div className="space-y-4">
               {questions[currentQ].options.map((opt, i) => (
                 <button key={i} onClick={handleNext} className="w-full p-8 text-left border-2 border-slate-50 rounded-[2rem] bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/10 transition-all group flex items-center justify-between">
                   <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600">{opt}</span>
                   <div className="w-8 h-8 border-4 border-slate-200 rounded-full group-hover:border-blue-500 transition-all" />
                 </button>
               ))}
             </div>
           </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl animate-in zoom-in duration-500 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px]" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl"><CheckCircle className="w-12 h-12" /></div>
            <p className="text-[12px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">Assessment Complete</p>
            <h1 className="text-5xl font-black mb-4 tracking-tighter">测评结果：R3 平衡型</h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto mb-16 leading-relaxed">您的资产配置权限已激活。系统为您解锁了包含“中欧绿色能源”在内的 18 个均衡型策略方案。</p>
            <button 
              onClick={onComplete} 
              className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-900 hover:bg-blue-500 transition-all transform active:scale-95"
            >
              即刻前往策略广场
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
