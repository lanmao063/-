
import React, { useContext } from 'react';
import { Lock, FileText, UserCheck, Download, ChevronRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { AppContext } from '../App';
import { AccountStatus } from '../types';

const AccountDetails: React.FC = () => {
  const ctx = useContext(AppContext);

  return (
    <div className="space-y-10 animate-in slide-in-from-right duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">财富账户管理</h1>
        <p className="text-slate-500 text-sm mt-2 font-bold">银行级隔离监控中 · 您当前的策略持仓概览</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-60" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl"><Lock className="w-12 h-12 text-blue-400" /></div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">财富账户：WA-0856</h3>
                   <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-xl border border-green-100 flex items-center gap-2"><UserCheck className="w-4 h-4" /> {AccountStatus.ISOLATED}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">当前持仓总额 (Asset Value)</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">¥{ctx?.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><FileText className="w-6 h-6 text-purple-500" /> 已签署协议与持仓明细</h3>
            </div>
            <div className="divide-y divide-slate-50">
               {ctx?.agreements.map((ag: any) => (
                 <div key={ag.id} className="p-10 hover:bg-slate-50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><TrendingUp className="w-8 h-8" /></div>
                       <div><p className="text-lg font-black text-slate-800 mb-1">{ag.strategyName}</p><p className="text-[11px] font-mono text-slate-400">{ag.id} | 签署于 {ag.signDate}</p></div>
                    </div>
                    <div className="flex items-center gap-10">
                       <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">申购金额</p><p className="text-xl font-black text-slate-800">¥{ag.amount?.toLocaleString() || 'N/A'}</p></div>
                       <Download className="w-6 h-6 text-slate-300 hover:text-blue-600 cursor-pointer" />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl h-fit relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck className="w-32 h-32" /></div>
           <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Personal Advisor</p>
           <h3 className="text-3xl font-black mb-10">Alex Li</h3>
           <button className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl hover:bg-blue-500 transition-all">发起实时咨询</button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
