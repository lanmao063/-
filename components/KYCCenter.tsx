
import React, { useState, useContext } from 'react';
import { ShieldCheck, FileText, ChevronRight, Plus, Users, Clock, History } from 'lucide-react';
// Changed from LanguageContext to AppContext
import { AppContext } from '../App';

const KYCCenter: React.FC = () => {
  // Use AppContext instead of LanguageContext
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const templates = [
    { id: 'QT-2024-V2', version: '2.4.0', questions: 12, algorithm: '加权得分法', date: '2024-03-01', status: 'ACTIVE' },
    { id: 'QT-2023-V1', version: '1.8.2', questions: 10, algorithm: '基础逻辑法', date: '2023-08-15', status: 'ARCHIVED' },
  ];

  const riskStats = [
    { level: 'R1', label: '保守型', count: 124, color: 'bg-emerald-500' },
    { level: 'R2', label: '稳健型', count: 452, color: 'bg-blue-500' },
    { level: 'R3', label: '平衡型', count: 582, color: 'bg-purple-500' },
    { level: 'R4', label: '成长型', count: 102, color: 'bg-amber-500' },
    { level: 'R5', label: '进取型', count: 24, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('nav_kyc')}</h1>
          <p className="text-slate-500 text-sm mt-1">{lang === 'zh' ? '管理风险测评问卷模板及全量客户测评记录。' : 'Manage KYC templates and client risk assessment records.'}</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('btn_create_template')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              {lang === 'zh' ? '测评问卷版本库' : 'Questionnaire Repository'}
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{templates.length} VERSIONS</span>
          </div>
          <div className="divide-y divide-slate-50">
            {templates.map((tmp) => (
              <div key={tmp.id} className="p-6 hover:bg-slate-50 transition-all cursor-pointer group flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${tmp.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <History className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{tmp.id}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black rounded text-slate-500 uppercase">v{tmp.version}</span>
                    {tmp.status === 'ACTIVE' && <span className="px-2 py-0.5 bg-green-50 text-[10px] font-black rounded text-green-600 uppercase tracking-tighter">CURRENT</span>}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tmp.date}</span>
                    <span>算法: {tmp.algorithm}</span>
                    <span>{tmp.questions} 道题目</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            {lang === 'zh' ? '1,284 位客户风险分布' : 'Client Risk Distribution'}
          </h3>
          <div className="space-y-6">
            {riskStats.map((stat) => (
              <div key={stat.level} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">{stat.label} ({stat.level})</span>
                  <span className="text-slate-900">{stat.count} 人</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color} rounded-full`} 
                    style={{ width: `${(stat.count / 1284) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2 text-slate-400 mb-2">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Compliance Audit</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed italic">
               所有客户均在测评有效期内，当前平均风险偏好：R2.8 稳健偏向。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCCenter;
