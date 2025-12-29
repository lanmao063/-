
import React, { useContext } from 'react';
import { Lock, ShieldCheck, UserCheck, Search, MoreVertical, FileSignature, Database } from 'lucide-react';
// Changed from LanguageContext to AppContext
import { AppContext } from '../App';

const AccountIsolation: React.FC = () => {
  // Use AppContext instead of LanguageContext
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const accounts = [
    { id: 'WA-0856', name: '李强', balance: '¥1,250,000', status: 'ISOLATED', signDate: '2024-03-12', strategy: '全球成长' },
    { id: 'WA-0857', name: '王芳', balance: '¥4,500,000', status: 'ISOLATED', signDate: '2024-03-14', strategy: '稳健红利' },
    { id: 'WA-0858', name: '张伟', balance: '¥850,000', status: 'PENDING', signDate: '2024-03-16', strategy: '科技领先' },
    { id: 'WA-0859', name: '刘洋', balance: '¥2,100,000', status: 'ISOLATED', signDate: '2024-03-15', strategy: 'ESG责任' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('nav_isolation')}</h1>
          <p className="text-slate-500 text-sm mt-1">{lang === 'zh' ? '监控投顾协议绑定的财富账户及其资产隔离合规状态。' : 'Monitor wealth accounts & asset isolation compliance status.'}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all">
            {lang === 'zh' ? '导出合规报告' : 'Export Compliance'}
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
            <Database className="w-4 h-4" />
            {lang === 'zh' ? '全量隔离校验' : 'Verify All'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
             <Lock className="w-5 h-5 text-emerald-600" />
             <span className="text-sm font-bold text-slate-800">{lang === 'zh' ? '活跃账户实时列表' : 'Active Wealth Accounts'}</span>
          </div>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
             <input type="text" className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-blue-100 w-48 transition-all" placeholder="Search accounts..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">财富账户编号</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">所属投资者</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">资产规模</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">协议签署日期</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">隔离状态</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-400 font-bold">{acc.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">{acc.name[0]}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{acc.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">策略: {acc.strategy}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">{acc.balance}</td>
                  <td className="px-8 py-6 text-xs text-slate-500 font-medium">{acc.signDate}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      acc.status === 'ISOLATED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {acc.status === 'ISOLATED' ? '资产已隔离' : '隔离处理中'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><FileSignature className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-900"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/50 flex flex-col items-center justify-center border-t border-slate-100">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Security Verification Layer</p>
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">SSL 256-bit Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Bank-Grade Isolation</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AccountIsolation;
