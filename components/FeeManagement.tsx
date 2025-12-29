
import React, { useState, useContext } from 'react';
import { Plus, Trash2, Edit3, Percent, CheckCircle } from 'lucide-react';
import { AppContext } from '../App';

const FeeManagement: React.FC = () => {
  const ctx = useContext(AppContext);
  const { lang, t } = ctx!;
  
  const templates = [
    { id: 'F001', name: '标准 A 类策略管理费', type: 'MANAGEMENT', rate: 0.8 },
    { id: 'F002', name: '进取型阶梯业绩报酬', type: 'PERFORMANCE', rate: 20.0 },
    { id: 'F003', name: '第三方财富隔离托管费', type: 'CUSTODIAN', rate: 0.05 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('nav_fees')}</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">{t('fee_subtitle')}</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-3xl text-sm font-black hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl uppercase tracking-widest">
          <Plus className="w-5 h-5" /> {t('btn_create_fee')}
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('th_tpl_id')}</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('th_tpl_name')}</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('th_tpl_type')}</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('th_tpl_rate')}</th>
              <th className="px-10 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {templates.map((tpl) => (
              <tr key={tpl.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6 font-mono text-xs text-slate-400 font-bold">{tpl.id}</td>
                <td className="px-10 py-6 font-black text-slate-800">{tpl.name}</td>
                <td className="px-10 py-6">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-lg border border-blue-100">
                    {tpl.type === 'MANAGEMENT' ? '固定管理费' : tpl.type === 'PERFORMANCE' ? '超额业绩报酬' : '托管费'}
                  </span>
                </td>
                <td className="px-10 py-6 text-right font-black text-slate-900">{tpl.rate}%</td>
                <td className="px-10 py-6 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit3 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex items-center justify-between shadow-2xl relative">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl"><CheckCircle className="w-8 h-8" /></div>
          <div>
            <h4 className="text-xl font-black mb-1">计费对账引擎运行中</h4>
            <p className="text-blue-200 text-sm font-medium">系统将严格按照上述模版在清算点执行自动计提与费金划转。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeManagement;
