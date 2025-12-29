
import React, { useContext, useState } from 'react';
import { FileBarChart, Download, Calendar, Eye, ShieldCheck, Database, X, ShieldAlert, Activity, FileText } from 'lucide-react';
import { AppContext } from '../App';

const ReportCenter: React.FC = () => {
  const ctx = useContext(AppContext);
  const { lang, t } = ctx!;
  const [activeTab, setActiveTab] = useState('DISCLOSURE');

  const disclosureReports = [
    { id: 'DR-2024-Q1', date: '2024-03-20', title: '2024年一季度策略运行报告 (A1 科技成长)', type: 'INFO' },
    { id: 'DR-2024-NOTICE', date: '2024-03-15', title: '关于 B2 策略底层债券持仓变动的披露说明', type: 'NOTICE' },
    { id: 'DR-ANNUAL', date: '2023-12-31', title: '2023 年度适当性管理执行情况报告', type: 'COMPLIANCE' },
    { id: 'DR-ESG-2023', date: '2023-11-10', title: 'ESG 责任先锋 B1 策略年度社会责任披露', type: 'INFO' },
  ];

  const settlementReports = [
    { id: 'SR-20240320-D', date: '2024-03-20', title: '2024-03-20 日中分时段对账对付汇总单', type: 'SETTLE' },
    { id: 'SR-FEE-MAR', date: '2024-03-18', title: '3月份第一阶段费金划转与管理费计提明细', type: 'FEE' },
    { id: 'SR-CASH-FLOW', date: '2024-03-15', title: '全量财富账户现金头寸变动与隔离账户核验表', type: 'CASH' },
    { id: 'SR-VAL-20240310', date: '2024-03-10', title: '中旬策略资产估值核对与份额重算报告', type: 'SETTLE' },
  ];

  const displayedReports = activeTab === 'DISCLOSURE' ? disclosureReports : settlementReports;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('nav_reports')}</h1>
          <p className="text-slate-500 text-sm mt-2 font-bold">{t('report_subtitle')}</p>
        </div>
        
        <div className="flex bg-slate-200/50 p-1.5 rounded-[2rem] border border-slate-100 shadow-inner">
          <button 
            onClick={() => setActiveTab('DISCLOSURE')}
            className={`flex items-center gap-2 px-8 py-4 text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${
              activeTab === 'DISCLOSURE' ? 'bg-white text-purple-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> 信息披露报告
          </button>
          <button 
            onClick={() => setActiveTab('SETTLEMENT')}
            className={`flex items-center gap-2 px-8 py-4 text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${
              activeTab === 'SETTLEMENT' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database className="w-4 h-4" /> 日中结算报告
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        <div className="divide-y divide-slate-50">
          {displayedReports.length > 0 ? displayedReports.map((report) => (
            <div key={report.id} className="p-10 hover:bg-slate-50/80 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-all ${
                  activeTab === 'DISCLOSURE' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {activeTab === 'DISCLOSURE' ? <ShieldAlert className="w-8 h-8" /> : <Activity className="w-8 h-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md tracking-widest">{report.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{report.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-4 text-slate-300 hover:text-blue-600 transition-colors">
                    <Download className="w-5 h-5" />
                 </button>
                 <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest active:scale-95">
                    <Eye className="w-4 h-4" /> {activeTab === 'DISCLOSURE' ? '查阅披露' : '查看结算'}
                 </button>
              </div>
            </div>
          )) : (
            <div className="p-32 text-center">
              <FileText className="w-16 h-16 text-slate-100 mx-auto mb-6" />
              <p className="text-slate-300 font-black uppercase tracking-widest">暂无对应报告记录</p>
            </div>
          )}
        </div>
        
        <div className="mt-auto p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-8">
           <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> 已通过 PulseChain 全网共识存证与多级合规审计
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
