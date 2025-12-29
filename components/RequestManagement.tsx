
import React, { useState, useContext, useMemo } from 'react';
import { RequestStatus, RequestType, ReviewRequest } from '../types';
import { Bot, Info, CheckCircle2, XCircle, Clock, Database, AlertTriangle, UserX, Cpu, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { AppContext } from '../App';

const RequestManagement: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t, requests, setRequests, setActiveView } = ctx;

  const displayedRequests = useMemo(() => {
    if (viewMode === 'ACTIVE') {
      return requests.filter(r => r.status === RequestStatus.AUDITING || r.status === RequestStatus.VALIDATING);
    }
    return requests.filter(r => r.status === RequestStatus.SUCCESS || r.status === RequestStatus.FAILED);
  }, [requests, viewMode]);

  const selectedRequest = useMemo(() => requests.find(r => r.id === selectedId), [requests, selectedId]);

  const getRequestTypeInfo = (type: RequestType) => {
    switch (type) {
      case RequestType.REBALANCING: return { label: '策略调仓复核', color: 'text-blue-600', bg: 'bg-blue-50', icon: Cpu, isAI: true };
      case RequestType.TERMINATION: return { label: '清仓/解约通知', color: 'text-red-600', bg: 'bg-red-50', icon: UserX, isAI: false };
      case RequestType.KYC_EXPIRED: return { label: '适当性失效预警', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, isAI: true };
      case RequestType.DRIFT_ALERT: return { label: '偏离度合规预警', color: 'text-purple-600', bg: 'bg-purple-50', icon: Database, isAI: true };
      default: return { label: '通用监控流水', color: 'text-slate-600', bg: 'bg-slate-50', icon: Info, isAI: false };
    }
  };

  const handleGoToReview = (portfolioName?: string) => {
    // 模拟跳转并携带上下文
    localStorage.setItem('auto_open_diagnose', portfolioName || '');
    setActiveView('portfolios');
  };

  const handleProcess = (id: string, success: boolean) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: success ? RequestStatus.SUCCESS : RequestStatus.FAILED } : r));
    setSelectedId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('nav_requests')}</h1>
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
            {['ACTIVE', 'HISTORY'].map((mode) => (
              <button key={mode} onClick={() => { setViewMode(mode as any); setSelectedId(null); }} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {mode === 'ACTIVE' ? `实时任务中心` : `合规历史档案`}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="divide-y divide-slate-100 overflow-y-auto scrollbar-hide">
            {displayedRequests.length > 0 ? displayedRequests.map((req) => {
              const info = getRequestTypeInfo(req.type);
              const Icon = info.icon;
              return (
                <div key={req.id} onClick={() => setSelectedId(req.id)} className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-5 ${selectedId === req.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''}`}>
                  <div className={`p-4 rounded-2xl ${info.bg} ${info.color} shadow-inner`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800">{info.label}</span>
                      {info.isAI && (
                        <span className="text-[8px] font-black uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-md tracking-widest flex items-center gap-1 shadow-sm">
                          <Zap className="w-2.5 h-2.5 fill-current" /> AI 策略计算
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{req.portfolioName || '全局流水'} | {req.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center justify-end gap-1.5 text-[9px] font-black uppercase tracking-widest ${req.status === RequestStatus.SUCCESS ? 'text-green-600' : req.status === RequestStatus.FAILED ? 'text-red-500' : 'text-slate-400'}`}>
                      {req.status === RequestStatus.SUCCESS ? <><CheckCircle2 className="w-3 h-3"/> 已执行</> : req.status === RequestStatus.FAILED ? <><XCircle className="w-3 h-3"/> 已驳回</> : '待复核'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono uppercase">{req.id}</div>
                  </div>
                </div>
              );
            }) : <div className="p-24 text-center text-slate-300 font-black uppercase tracking-widest opacity-20">档案库暂无记录</div>}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedRequest ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 sticky top-8 animate-in slide-in-from-right duration-300">
            <h3 className="text-lg font-black text-slate-800 mb-8 border-b border-slate-50 pb-4">
               监控详情: {getRequestTypeInfo(selectedRequest.type).label}
            </h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">监控属性</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700"><span>目标策略</span><span>{selectedRequest.portfolioName}</span></div>
                  <div className="flex justify-between text-xs font-bold text-slate-700"><span>计算引擎</span><span className="text-blue-600 font-black">Gemini LLM v3.1 PRO</span></div>
                  <div className="flex justify-between text-xs font-bold text-slate-700"><span>工单代码</span><span className="font-mono">{selectedRequest.id}</span></div>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl relative overflow-hidden">
                 <div className="absolute -right-4 -top-4 opacity-5"><Bot className="w-20 h-20" /></div>
                 <div className="flex items-center gap-2 text-blue-700 mb-3"><Bot className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">分析简报</span></div>
                 <p className="text-xs text-slate-600 font-bold leading-relaxed italic">"{selectedRequest.description}"</p>
              </div>

              {viewMode === 'ACTIVE' ? (
                <div className="pt-8 border-t border-slate-100 space-y-4">
                  {selectedRequest.type === RequestType.REBALANCING ? (
                    <button 
                      onClick={() => handleGoToReview(selectedRequest.portfolioName)}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      前往复核 <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => handleProcess(selectedRequest.id, false)} className="py-4 rounded-2xl border border-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">驳回修正</button>
                      <button onClick={() => handleProcess(selectedRequest.id, true)} className="py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> 复核通过
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><ShieldCheck className="w-4 h-4 text-green-500" /> 处理方法：{selectedRequest.status === RequestStatus.SUCCESS ? '已由经理复核并执行' : '经理驳回建议并要求修正'}</div>
                  <div className="p-4 bg-slate-900 text-white rounded-2xl text-[10px] font-mono leading-relaxed break-all">
                    System Trace: {Math.random().toString(36).substring(2, 15).toUpperCase()} <br/>
                    Status: {selectedRequest.status === RequestStatus.SUCCESS ? 'COMMITTED_TO_SETTLEMENT' : 'REJECTED_BY_MANAGER'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : <div className="h-96 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 font-black uppercase tracking-widest text-center px-10"><Info className="w-12 h-12 mb-4 opacity-10" /> 请在左侧选择合规流水以查看分析报告</div>}
      </div>
    </div>
  );
};

export default RequestManagement;
