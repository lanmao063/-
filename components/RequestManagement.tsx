
import React, { useState, useContext } from 'react';
import { ReviewRequest, RequestStatus, RequestType } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Bot, 
  Info,
  ArrowRight,
  History,
  ClipboardCheck,
  UserCheck,
  Calendar,
  Eye,
  MessageSquare,
  Sliders
} from 'lucide-react';
import { AppContext } from '../App';

const RequestManagement: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const allRequests: ReviewRequest[] = [
    { id: 'AI-20240316-001', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '陈莎拉' : 'Sarah Chen', customerId: 'C002', amount: 0, date: '2024-03-16', status: RequestStatus.AUDITING, portfolioName: lang === 'zh' ? '激进成长旗舰 A1' : 'Aggressive Alpha A1', suitabilityPassed: true },
    { id: 'AI-20240316-002', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '张艾琳' : 'Elena Zhang', customerId: 'C004', amount: 0, date: '2024-03-16', status: RequestStatus.AUDITING, portfolioName: lang === 'zh' ? '中欧ESG领先组合' : 'ESG Leaders Portfolio', suitabilityPassed: true },
    { id: 'TX-20240316-003', type: RequestType.TRANSFER_OUT, customerName: lang === 'zh' ? '李忠' : 'Li Zhong', customerId: 'C001', amount: 80000, date: '2024-03-16', status: RequestStatus.AUDITING, suitabilityPassed: true },
    { id: 'AI-20240316-004', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '王大卫' : 'David Wang', customerId: 'C003', amount: 0, date: '2024-03-16', status: RequestStatus.VALIDATING, portfolioName: lang === 'zh' ? '稳健分红组合 B2' : 'Steady Dividend B2', suitabilityPassed: true },
    { id: 'AI-20240316-005', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '陈莎拉' : 'Sarah Chen', customerId: 'C002', amount: 0, date: '2024-03-16', status: RequestStatus.AUDITING, portfolioName: lang === 'zh' ? '纳斯达克100联动' : 'Nasdaq-100 Strategy', suitabilityPassed: true },
    
    { id: 'AI-20240310-099', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '张艾琳' : 'Elena Zhang', customerId: 'C004', amount: 0, date: '2024-03-10', status: RequestStatus.SUCCESS, suitabilityPassed: true },
    { id: 'AI-20240309-098', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '李忠' : 'Li Zhong', customerId: 'C001', amount: 0, date: '2024-03-09', status: RequestStatus.FAILED, suitabilityPassed: true },
  ];

  const activeRequests = allRequests.filter(r => r.status === RequestStatus.AUDITING || r.status === RequestStatus.VALIDATING);
  const historyRequests = allRequests.filter(r => r.status === RequestStatus.SUCCESS || r.status === RequestStatus.FAILED);
  const displayedRequests = viewMode === 'ACTIVE' ? activeRequests : historyRequests;

  const getRequestTypeInfo = (type: RequestType) => {
    switch (type) {
      case RequestType.TRANSFER_IN: return { label: lang === 'zh' ? '资金转入' : 'Deposit', color: 'text-blue-600', bg: 'bg-blue-50', isAI: false, isNotice: false };
      case RequestType.TRANSFER_OUT: return { label: lang === 'zh' ? '资金转出通知' : 'Withdrawal Alert', color: 'text-amber-600', bg: 'bg-amber-50', isAI: false, isNotice: true };
      case RequestType.REBALANCING: return { label: lang === 'zh' ? '算法调仓流水' : 'Algo Rebalance Log', color: 'text-purple-600', bg: 'bg-purple-50', isAI: true, isNotice: false };
      default: return { label: lang === 'zh' ? '业务流水' : 'Generic Flow', color: 'text-slate-600', bg: 'bg-slate-50', isAI: false, isNotice: false };
    }
  };

  const getAIReason = (id: string) => {
    if (id.includes('001')) return lang === 'zh' ? '科技股持仓触及止盈阈值，算法已回补避险资产。' : 'Tech exposure hit profit-take limit. Algo reallocated to hedging assets.';
    if (id.includes('002')) return lang === 'zh' ? '识别到 ESG 评级调级，算法已移除不合规标的并增持清洁能源。' : 'ESG rating shift detected. Algo swapped non-compliant assets for green energy.';
    if (id.includes('004')) return lang === 'zh' ? '国债收益率预期变动，组合已增加长久期债权配置。' : 'Bond yield outlook shifted. Portfolio duration increased via long-term bonds.';
    return lang === 'zh' ? '检测到市场波动性上升，系统已完成防御性仓位切换。' : 'Market volatility rising. Defensive rotation completed.';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{lang === 'zh' ? '合规复核中心' : 'Audit Center'}</h1>
          
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            <button 
              onClick={() => { setViewMode('ACTIVE'); setSelectedRequest(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                viewMode === 'ACTIVE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('tab_active')} ({activeRequests.length})
            </button>
            <button 
              onClick={() => { setViewMode('HISTORY'); setSelectedRequest(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                viewMode === 'HISTORY' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('tab_history')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="divide-y divide-slate-100 overflow-y-auto scrollbar-hide">
            {displayedRequests.length > 0 ? displayedRequests.map((req) => {
              const info = getRequestTypeInfo(req.type);
              return (
                <div 
                  key={req.id} 
                  onClick={() => setSelectedRequest(req)}
                  className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-5 ${
                    selectedRequest?.id === req.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${info.bg} ${info.color} shadow-sm`}>
                    {info.isAI ? <Bot className="w-6 h-6" /> : (info.isNotice ? <Eye className="w-6 h-6" /> : <ClipboardCheck className="w-6 h-6" />)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800">{info.label}</span>
                      {info.isAI && <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-purple-600 text-white px-2 py-0.5 rounded">AUTO</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">
                      {info.isAI ? req.date : `${req.customerName} | ${req.date}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-800">
                      {req.amount > 0 ? `¥${req.amount.toLocaleString()}` : (lang === 'zh' ? '因子调仓' : 'Factor Rebal')}
                    </div>
                    <div className={`flex items-center justify-end gap-1.5 mt-1 text-[9px] font-black uppercase tracking-widest ${
                      req.status === RequestStatus.SUCCESS ? 'text-green-500' : 
                      req.status === RequestStatus.FAILED ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {req.status === RequestStatus.SUCCESS ? (lang === 'zh' ? '已归档' : 'Archived') : 
                       req.status === RequestStatus.FAILED ? (lang === 'zh' ? '驳回' : 'Rejected') : (lang === 'zh' ? '待审' : 'Pending')}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-20 text-center">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">{lang === 'zh' ? '暂无复核流水' : 'No Audit Records'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedRequest ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 sticky top-8 animate-in slide-in-from-right duration-300">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center justify-between">
              {viewMode === 'ACTIVE' ? (lang === 'zh' ? '合规明细审核' : 'Compliance Detail') : (lang === 'zh' ? '归档档案' : 'Archived Log')}
              {selectedRequest.type === RequestType.REBALANCING && <Sparkles className="w-5 h-5 text-purple-500" />}
            </h3>
            
            <div className="space-y-8">
              {selectedRequest.type === RequestType.REBALANCING ? (
                <div className="space-y-6">
                  <div className={`p-6 rounded-3xl border ${viewMode === 'ACTIVE' ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-[10px] font-black text-purple-900 mb-3 uppercase tracking-widest">{lang === 'zh' ? '引擎执行说明' : 'Engine Log'}</p>
                    <p className="text-xs text-slate-600 leading-relaxed italic font-medium">"{getAIReason(selectedRequest.id)}"</p>
                  </div>
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                    <div className="flex items-center gap-2 text-blue-700 mb-3">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'zh' ? '合规核验指导' : 'Audit Guidelines'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('msg_ai_rebalance_notice')}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-slate-400 uppercase tracking-widest">{lang === 'zh' ? '所属策略' : 'Strategy'}</span>
                      <span className="text-slate-800">{selectedRequest.portfolioName}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-[2rem] shadow-sm">
                  <div className="flex items-center gap-2 text-amber-700 mb-3">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'zh' ? '告知明细' : 'Alert Details'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('msg_transfer_out_notice')}</p>
                  <div className="mt-6 text-2xl font-black text-slate-900 tracking-tighter">¥{selectedRequest.amount.toLocaleString()}</div>
                </div>
              )}

              {viewMode === 'ACTIVE' && (
                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 rounded-2xl border border-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                      {t('btn_manual_fix')}
                    </button>
                    <button className="py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                      {t('btn_verify_ok')}
                    </button>
                  </div>
                </div>
              )}

              {viewMode === 'HISTORY' && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                   <div className="p-4 bg-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{lang === 'zh' ? '复核意见' : 'Audit Remarks'}</p>
                    <p className="text-xs text-slate-600 font-bold">
                      {selectedRequest.status === RequestStatus.SUCCESS 
                        ? (lang === 'zh' ? '合规核验通过，流水已入账。' : 'Compliance verified, log archived.') 
                        : (lang === 'zh' ? '复核警示：经理已进行手动对冲干预。' : 'Warning: Manager performed manual hedging.')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 p-12 text-center">
             <Bot className="w-16 h-16 mb-4 opacity-10" />
             <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{lang === 'zh' ? '请选择待复核项' : 'Select a Record'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestManagement;
