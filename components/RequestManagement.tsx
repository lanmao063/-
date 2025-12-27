
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
import { LanguageContext } from '../App';

const RequestManagement: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const { lang, t } = useContext(LanguageContext);

  // 扩充模拟数据
  const allRequests: ReviewRequest[] = [
    // 待办任务
    { id: 'AI-20240316-001', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '陈莎拉' : 'Sarah Chen', customerId: 'C002', amount: 0, date: '2024-03-16', status: RequestStatus.AUDITING, portfolioName: lang === 'zh' ? '激进成长型 A1' : 'Aggressive Growth A1', suitabilityPassed: true },
    { id: 'AI-20240316-002', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '张艾琳' : 'Elena Zhang', customerId: 'C004', amount: 0, date: '2024-03-16', status: RequestStatus.AUDITING, portfolioName: lang === 'zh' ? '中欧ESG领先组合' : 'Central Europe ESG', suitabilityPassed: true },
    { id: 'TX-20240316-003', type: RequestType.TRANSFER_OUT, customerName: lang === 'zh' ? '李忠' : 'Li Zhong', customerId: 'C001', amount: 80000, date: '2024-03-16', status: RequestStatus.AUDITING, suitabilityPassed: true },
    { id: 'AI-20240316-004', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '王大卫' : 'David Wang', customerId: 'C003', amount: 0, date: '2024-03-16', status: RequestStatus.VALIDATING, portfolioName: lang === 'zh' ? '固收增强组合 C3' : 'Fixed Income C3', suitabilityPassed: true },
    { id: 'AI-20240316-005', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '陈莎拉' : 'Sarah Chen', customerId: 'C002', amount: 0, date: '2024-03-16', status: RequestStatus.AUDITING, portfolioName: lang === 'zh' ? '纳斯达克100联动' : 'Nasdaq-100 Linked', suitabilityPassed: true },
    
    // 历史记录
    { id: 'AI-20240310-099', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '张艾琳' : 'Elena Zhang', customerId: 'C004', amount: 0, date: '2024-03-10', status: RequestStatus.SUCCESS, suitabilityPassed: true },
    { id: 'AI-20240309-098', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '李忠' : 'Li Zhong', customerId: 'C001', amount: 0, date: '2024-03-09', status: RequestStatus.FAILED, suitabilityPassed: true },
    { id: 'TX-20240308-088', type: RequestType.TRANSFER_OUT, customerName: lang === 'zh' ? '何罗伯特' : 'Robert He', customerId: 'C005', amount: 120000, date: '2024-03-08', status: RequestStatus.SUCCESS, suitabilityPassed: true },
    { id: 'AI-20240307-097', type: RequestType.REBALANCING, customerName: lang === 'zh' ? '王大卫' : 'David Wang', customerId: 'C003', amount: 0, date: '2024-03-07', status: RequestStatus.SUCCESS, suitabilityPassed: true },
  ];

  const activeRequests = allRequests.filter(r => r.status === RequestStatus.AUDITING || r.status === RequestStatus.VALIDATING);
  const historyRequests = allRequests.filter(r => r.status === RequestStatus.SUCCESS || r.status === RequestStatus.FAILED);

  const displayedRequests = viewMode === 'ACTIVE' ? activeRequests : historyRequests;

  const getRequestTypeInfo = (type: RequestType) => {
    switch (type) {
      case RequestType.TRANSFER_IN: return { label: lang === 'zh' ? '资金转入' : 'Transfer In', color: 'text-blue-600', bg: 'bg-blue-50', isAI: false, isNotice: false };
      case RequestType.TRANSFER_OUT: return { label: lang === 'zh' ? '资金转出通知' : 'Withdrawal Notice', color: 'text-amber-600', bg: 'bg-amber-50', isAI: false, isNotice: true };
      case RequestType.REBALANCING: return { label: lang === 'zh' ? 'AI 自动调仓流水' : 'AI Auto-Rebalance Log', color: 'text-purple-600', bg: 'bg-purple-50', isAI: true, isNotice: false };
      default: return { label: lang === 'zh' ? '业务流水' : 'Flow', color: 'text-slate-600', bg: 'bg-slate-50', isAI: false, isNotice: false };
    }
  };

  const getAIReason = (id: string) => {
    if (id.includes('001')) return lang === 'zh' ? '科技股持仓已触及 70% 止盈线，系统已回调至 60%。' : 'Tech exposure hit 70% take-profit. System auto-reverted to 60%.';
    if (id.includes('002')) return lang === 'zh' ? '识别到 ESG 评级调级，系统已移除不合规标的并增持绿色能源。' : 'ESG rating downgraded. System removed non-compliant assets.';
    if (id.includes('004')) return lang === 'zh' ? '国债收益率预期变动，系统已增加长久期债权配置。' : 'Bond yield expectations shifted. System increased long-duration bonds.';
    return lang === 'zh' ? '检测到市场波动性上升，系统已完成对冲性仓位调整。' : 'Market volatility rising. Hedging adjustment completed.';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-slate-800">{lang === 'zh' ? '任务中心' : 'Task Center'}</h1>
          
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            <button 
              onClick={() => { setViewMode('ACTIVE'); setSelectedRequest(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'ACTIVE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              {t('tab_active')} ({activeRequests.length})
            </button>
            <button 
              onClick={() => { setViewMode('HISTORY'); setSelectedRequest(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'HISTORY' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              {t('tab_history')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="divide-y divide-slate-100 overflow-y-auto">
            {displayedRequests.length > 0 ? displayedRequests.map((req) => {
              const info = getRequestTypeInfo(req.type);
              return (
                <div 
                  key={req.id} 
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-4 ${
                    selectedRequest?.id === req.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${info.bg} ${info.color}`}>
                    {info.isAI ? <Bot className="w-5 h-5" /> : (info.isNotice ? <Eye className="w-5 h-5" /> : <ClipboardCheck className="w-5 h-5" />)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{info.label}</span>
                      {info.isAI && <span className="text-[9px] font-black uppercase tracking-widest bg-purple-600 text-white px-1.5 py-0.5 rounded">AUTO-EXECUTED</span>}
                      {info.isNotice && <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white px-1.5 py-0.5 rounded">NOTICE</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {info.isAI ? req.date : `${req.customerName} | ${req.date}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">
                      {req.amount > 0 ? `¥${req.amount.toLocaleString()}` : (lang === 'zh' ? '算法调仓' : 'Algo Rebal')}
                    </div>
                    <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-bold uppercase ${
                      req.status === RequestStatus.SUCCESS ? 'text-green-500' : 
                      req.status === RequestStatus.FAILED ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {req.status === RequestStatus.SUCCESS ? (lang === 'zh' ? '已核对' : 'Verified') : 
                       req.status === RequestStatus.FAILED ? (lang === 'zh' ? '异常' : 'Anomalous') : (lang === 'zh' ? '待复核' : 'To Review')}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400">
                <p className="text-sm font-medium">{lang === 'zh' ? '暂无数据' : 'No data'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 详情与操作侧栏 */}
      <div className="lg:col-span-1">
        {selectedRequest ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 sticky top-8 animate-in slide-in-from-right duration-300">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
              {viewMode === 'ACTIVE' ? (lang === 'zh' ? '合规复核' : 'Compliance Audit') : (lang === 'zh' ? '档案详情' : 'Archive')}
              {selectedRequest.type === RequestType.REBALANCING && <Sparkles className="w-5 h-5 text-purple-500" />}
            </h3>
            
            <div className="space-y-6">
              {/* 业务内容 */}
              {selectedRequest.type === RequestType.REBALANCING ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${viewMode === 'ACTIVE' ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-[10px] font-bold text-purple-900 mb-2 uppercase tracking-widest">{lang === 'zh' ? '系统执行明细' : 'Execution Details'}</p>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{getAIReason(selectedRequest.id)}"</p>
                  </div>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-bold">{lang === 'zh' ? '系统自动处理说明' : 'System Auto-Process Notice'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{t('msg_ai_rebalance_notice')}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">{lang === 'zh' ? '对应组合' : 'Target Portfolio'}</span>
                      <span className="text-slate-800">{selectedRequest.portfolioName}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold">{lang === 'zh' ? '告知明细' : 'Notice Details'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t('msg_transfer_out_notice')}</p>
                  <div className="mt-3 text-sm font-black text-slate-800">¥{selectedRequest.amount.toLocaleString()}</div>
                </div>
              )}

              {/* 操作按钮 */}
              {viewMode === 'ACTIVE' && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  {selectedRequest.type === RequestType.TRANSFER_OUT ? (
                    /* 资金转出仅显示 Acknowledge */
                    <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('btn_acknowledge')}
                    </button>
                  ) : (
                    /* 调仓建议显示 Manual Fix / Verify OK */
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <input type="text" placeholder={lang === 'zh' ? '备注复核意见...' : 'Add audit notes...'} className="flex-1 bg-transparent text-xs outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="py-2.5 rounded-xl border border-slate-200 text-blue-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <Sliders className="w-4 h-4" />
                          {t('btn_manual_fix')}
                        </button>
                        <button className="py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          {t('btn_verify_ok')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 历史视图摘要 */}
              {viewMode === 'HISTORY' && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang === 'zh' ? '复核归档时间' : 'Archived At'}</span>
                    <span className="text-xs font-medium text-slate-600">{selectedRequest.date} 15:45</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">{lang === 'zh' ? '复核摘要' : 'Audit Summary'}</p>
                    <p className="text-xs text-slate-600">
                      {selectedRequest.status === RequestStatus.SUCCESS 
                        ? (lang === 'zh' ? '调仓执行结果已确认，符合风险管理要求。' : 'Execution result verified, meets risk management reqs.') 
                        : (lang === 'zh' ? '复核标记：经理于 [15:50] 进行了手动对冲修正。' : 'Flagged: Manager manual hedge at 15:50.')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
             <Bot className="w-12 h-12 mb-4 opacity-10" />
             <p className="text-sm font-bold text-slate-600">{lang === 'zh' ? '请选择待复核项目' : 'Select an Item'}</p>
             <p className="text-[10px] mt-2">{lang === 'zh' ? '点击左侧列表查看系统已自动完成的调仓明细' : 'Click list items to see auto-executed rebalance details'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestManagement;
