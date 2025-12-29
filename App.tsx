
import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
  LayoutDashboard, Compass, ShieldCheck, Lock, Bell, Search, Settings,
  PieChart, User, Briefcase, LogOut, ShieldAlert, FileText,
  ArrowRight, Wallet, CreditCard, Smartphone, Building, Users, ClipboardCheck, Activity,
  Percent, FileBarChart, PowerOff, RefreshCw
} from 'lucide-react';
import { UserRole, RiskLevel, AgreementStatus, ReviewRequest, RequestType, RequestStatus } from './types';

// 视图组件
import InvestorDashboard from './components/InvestorDashboard';
import Marketplace from './components/Marketplace';
import RiskAssessment from './components/RiskAssessment';
import AccountDetails from './components/AccountDetails';
import ManagerDashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import RequestManagement from './components/RequestManagement';
import PortfolioGallery from './components/PortfolioGallery';
import SettingsView from './components/SettingsView';
import FeeManagement from './components/FeeManagement';
import ReportCenter from './components/ReportCenter';

type Language = 'zh' | 'en';
type View = 'dashboard' | 'marketplace' | 'kyc' | 'account' | 'signing' | 'amount' | 'method' | 'payment' | 
             'clients' | 'requests' | 'portfolios' | 'settings' | 'fees' | 'reports';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  balance: number; 
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  agreements: any[];
  setAgreements: React.Dispatch<React.SetStateAction<any[]>>;
  addAgreement: (a: any) => void;
  requests: ReviewRequest[];
  setRequests: React.Dispatch<React.SetStateAction<ReviewRequest[]>>;
  t: (key: string) => string;
  setActiveView: (v: View) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const translations: any = {
  zh: {
    nav_dashboard_manager: '业务运行概览', 
    nav_dashboard_investor: '资产总览',
    nav_marketplace: '策略广场', 
    nav_kyc: '风险适当性管理',
    nav_account: '财富账户', 
    nav_clients: '投资者名册',
    clients_subtitle: '全量在管投资者适当性、资产规模及服务状态追踪。',
    nav_requests: '合规监控中心', 
    nav_portfolios: '投顾策略库',
    portfolios_subtitle: '标准化策略组合及其底层资产配置、持有分布管理。',
    nav_settings: '系统偏好设置',
    nav_fees: '计费模版配置',
    fee_subtitle: '管理并配置各级策略的管理费、业绩报酬及托管计费模型。',
    nav_reports: '报告查看',
    report_subtitle: '查看策略运行报告、重大事项披露及账户日中结算流水。',
    
    th_info: '基本信息', th_risk: '风险偏好', th_aum: '管理规模', th_status: '服务状态', th_action: '操作管理',
    th_tpl_id: '模板 ID', th_tpl_name: '收费项名称', th_tpl_type: '计费类型', th_tpl_rate: '费率/比例',
    
    btn_create_port: '发布新策略组合',
    btn_create_fee: '新增计费模版',
    btn_invite: '邀请新投资者',
    btn_terminate: '知悉并清算',
    btn_view_subs: '查看持有分布',
    btn_publish: '发布至策略广场',
    
    tab_allocation: '资产穿透',
    tab_holders: '持有者分布',
    tab_trend: '业绩基准',

    // AI 策略创建流程翻译
    ai_step_1: '宏观观点',
    ai_step_2: '因子配置',
    ai_step_3: '标的筛选',
    ai_step_4: '回溯结果',
    ai_prompt_ph: '请输入您对当前市场的宏观观点或投资直觉（例如：看好 AI 大模型带动的半导体周期，预期下半年利率下行，建议配置高弹性科技股并增加长久期债券，同时对冲大宗商品波动...）',
    ai_btn_analyze: '启动 AI 语义建模分析',
    ai_btn_pick: '匹配因子得分最高标的',
    ai_btn_backtest: '执行历史数据回溯',
    ai_factors_title: 'AI 因子驱动引擎配置',
    ai_factor_sharpe: '夏普比率偏好',
    ai_factor_alpha: '超额收益能力',
    ai_factor_vol: '波动回撤控制',
    ai_factor_size: '成分股流动性',
    ai_verdict_pass: '风险收益比核验通过',
    ai_verdict_fail: '合规策略验证不通过',
    ai_publish_ready: '历史数据回溯测试已达标，策略方案进入发布阶段。',
    risk_agg: '进取型',
    
    user_role_investor: '财富尊享用户', user_role_manager: '基金经理终端',
    login_investor: '投资者终端登录', login_manager: '基金经理终端登录',
    btn_back_prev: '返回选择'
  },
  en: {
    nav_dashboard_manager: 'Insights Hub', 
    nav_dashboard_investor: 'Portfolio',
    nav_marketplace: 'Marketplace', 
    nav_kyc: 'Suitability',
    nav_account: 'Account', 
    nav_clients: 'Clients',
    clients_subtitle: 'Investor profiles & AUM tracking.',
    nav_requests: 'Monitor',
    nav_portfolios: 'Strategies',
    portfolios_subtitle: 'Portfolio assets & allocations.',
    nav_settings: 'Settings',
    nav_fees: 'Fees',
    fee_subtitle: 'Fee configuration models.',
    nav_reports: 'Reports',
    report_subtitle: 'View strategy reports, disclosures, and intraday settlement logs.',
    
    th_info: 'Profile', th_risk: 'Risk', th_aum: 'AUM', th_status: 'Status', th_action: 'Action',
    th_tpl_id: 'ID', th_tpl_name: 'Item', th_tpl_type: 'Type', th_tpl_rate: 'Rate',

    btn_create_port: 'Deploy Strategy',
    btn_create_fee: 'Create Template',
    btn_invite: 'Invite',
    btn_terminate: 'Acknowledge',
    btn_view_subs: 'Holders',
    btn_publish: 'Publish to Hub',

    // AI Creation Flow EN
    ai_step_1: 'Macro View',
    ai_step_2: 'Factor Alloc',
    ai_step_3: 'Asset Pick',
    ai_step_4: 'Backtest',
    ai_prompt_ph: 'Describe your market view (e.g., Bullish on AI semi-cycle, expecting rate cuts in H2, focus on high-beta tech stocks and long-duration bonds, hedge against commodity volatility...)',
    ai_btn_analyze: 'Run AI Semantic Analysis',
    ai_btn_pick: 'Match High-Factor Assets',
    ai_btn_backtest: 'Run Historical Backtest',
    ai_factors_title: 'AI Factor Engine Config',
    ai_factor_sharpe: 'Sharpe Preference',
    ai_factor_alpha: 'Alpha Contribution',
    ai_factor_vol: 'Vol/Drawdown Control',
    ai_factor_size: 'Liquidity/Size Filter',
    ai_verdict_pass: 'Risk-Reward Ratio Verified',
    ai_verdict_fail: 'Compliance Check Failed',
    ai_publish_ready: 'Historical backtest complete. Strategy is ready for deployment.',
    risk_agg: 'Aggressive',
    
    user_role_investor: 'Investor', user_role_manager: 'Manager Terminal',
    login_investor: 'Investor Login', login_manager: 'Manager Login',
    btn_back_prev: 'Back'
  }
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [lang, setLang] = useState<Language>('zh');
  const [balance, setBalance] = useState(1250000);
  const [agreements, setAgreements] = useState([
    { id: 'AG-20231012-05', strategyName: '稳健养老配置 B2', signDate: '2023-10-12', status: AgreementStatus.SIGNED, amount: 200000 },
    { id: 'AG-20240115-08', strategyName: '科技成长旗舰 A1', signDate: '2024-01-15', status: AgreementStatus.SIGNED, amount: 500000 },
  ]);
  
  const [requests, setRequests] = useState<ReviewRequest[]>([
    { id: 'AI-RB-001', type: RequestType.REBALANCING, customerName: '模型引擎', customerId: 'SYS-A1', amount: 0, date: '2024-03-20', status: RequestStatus.AUDITING, portfolioName: '科技成长旗舰 A1', suitabilityPassed: true, description: 'Gemini AI 监测到 Nvidia 财报超预期，建议自动调增 3.5% 算力芯片权重，减持部分现金头寸。' },
    { id: 'AI-RB-002', type: RequestType.REBALANCING, customerName: '模型引擎', customerId: 'SYS-B2', amount: 0, date: '2024-03-20', status: RequestStatus.AUDITING, portfolioName: '稳健养老配置 B2', suitabilityPassed: true, description: '美联储利率指引转向鹰派，模型建议增加 8% 的 1-3 年期短债久期。' },
    { id: 'AI-RB-003', type: RequestType.REBALANCING, customerName: '模型引擎', customerId: 'SYS-C3', amount: 0, date: '2024-03-19', status: RequestStatus.AUDITING, portfolioName: '全利增强策略 C1', suitabilityPassed: true, description: '红利因子拥挤度已达阈值，建议减持 5% 的高息煤炭股，配置至防御性公用事业标的。' },
    { id: 'DRIFT-ACT-01', type: RequestType.DRIFT_ALERT, customerName: '模型引擎', customerId: 'SYS-A1', amount: 0, date: '2024-03-21', status: RequestStatus.AUDITING, portfolioName: '科技成长旗舰 A1', suitabilityPassed: true, description: '检测到持仓股票上涨导致权益比例偏离目标值 5.2%，建议执行自动配平还原比例。' },
    
    // 历史档案：偏离度合规预警案例
    { id: 'DRIFT-HIST-01', type: RequestType.DRIFT_ALERT, customerName: '模型引擎', customerId: 'SYS-B2', amount: 0, date: '2024-03-15', status: RequestStatus.SUCCESS, portfolioName: '稳健养老配置 B2', suitabilityPassed: true, description: '偏离度已通过 AI 自动配平归档：债券久期漂移修正完成。' },
    { id: 'DRIFT-HIST-02', type: RequestType.DRIFT_ALERT, customerName: '模型引擎', customerId: 'SYS-C1', amount: 0, date: '2024-03-10', status: RequestStatus.SUCCESS, portfolioName: '全利增强策略 C1', suitabilityPassed: true, description: '偏离度修正完成：现金头寸已自动补足。' },
    { id: 'DRIFT-HIST-03', type: RequestType.DRIFT_ALERT, customerName: '模型引擎', customerId: 'SYS-D4', amount: 0, date: '2024-03-05', status: RequestStatus.SUCCESS, portfolioName: '港股精选旗舰 A2', suitabilityPassed: true, description: '偏离度修正完成：自动调减超配行业权重。' },
    
    // 历史档案：策略调仓复核驳回修正案例
    { id: 'REB-REJ-01', type: RequestType.REBALANCING, customerName: '模型引擎', customerId: 'SYS-A1', amount: 0, date: '2024-03-12', status: RequestStatus.FAILED, portfolioName: '科技成长旗舰 A1', suitabilityPassed: true, description: '手动驳回：AI 建议增持标的处于停牌期，策略执行挂起，等待下一窗口。' },
    { id: 'REB-REJ-02', type: RequestType.REBALANCING, customerName: '模型引擎', customerId: 'SYS-B2', amount: 0, date: '2024-03-08', status: RequestStatus.FAILED, portfolioName: '稳健养老配置 B2', suitabilityPassed: true, description: '手动驳回：当前宏观流动性偏紧，暂缓久期拉长策略。' },
    { id: 'REB-REJ-03', type: RequestType.REBALANCING, customerName: '模型引擎', customerId: 'SYS-E5', amount: 0, date: '2024-03-02', status: RequestStatus.FAILED, portfolioName: 'ESG 责任先锋 B1', suitabilityPassed: true, description: '手动驳回：拟调入标的 ESG 评分出现负面舆情，修正准入清单。' },

    { id: 'HIST-AI-01', type: RequestType.REBALANCING, customerName: '模型引擎', customerId: 'SYS-A1', amount: 0, date: '2024-03-15', status: RequestStatus.SUCCESS, portfolioName: '科技成长旗舰 A1', suitabilityPassed: true, description: 'AI 自动配平完成。' },
  ]);

  const t = (key: string) => translations[lang][key] || key;
  const addAgreement = (a: any) => setAgreements(prev => [a, ...prev]);

  if (role === UserRole.GUEST) {
    return (
      <div className="h-screen bg-[#fcfdfe] flex items-center justify-center p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
          <button onClick={() => setRole(UserRole.MANAGER)} className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Briefcase className="w-32 h-32" /></div>
            <div className="bg-blue-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-xl mx-auto"><Briefcase className="w-12 h-12 text-white" /></div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">基金经理终端</h2>
            <p className="text-slate-400 font-medium mb-10">基金经理/投资顾问专属工作站</p>
            <div className="flex items-center justify-center gap-3 text-sm font-black text-blue-600 uppercase tracking-widest">进入终端系统 <ArrowRight className="w-5 h-5" /></div>
          </button>
          
          <button onClick={() => setRole(UserRole.INVESTOR)} className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-xl hover:scale-[1.02] transition-all group opacity-80 hover:opacity-100">
            <div className="bg-slate-900 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-xl mx-auto"><User className="w-12 h-12 text-white" /></div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">投资者终端</h2>
            <p className="text-slate-400 font-medium mb-10">个人财富管理与策略订阅</p>
            <div className="flex items-center justify-center gap-3 text-sm font-black text-slate-600 uppercase tracking-widest">进入用户端 <ArrowRight className="w-5 h-5" /></div>
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 bg-white p-14 rounded-[4rem] shadow-2xl border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8" /></div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t(`login_${role.toLowerCase()}`)}</h1>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">身份识别</label>
              <input type="text" placeholder="工号 / 手机号" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:border-blue-500 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">访问凭证</label>
              <input type="password" placeholder="请输入密码" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:border-blue-500 transition-colors" />
            </div>
            <button onClick={() => setIsLoggedIn(true)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest mt-4">安全进入系统</button>
            <button onClick={() => setRole(UserRole.GUEST)} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('btn_back_prev')}</button>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (role === UserRole.INVESTOR) {
      switch (activeView) {
        case 'dashboard': return <InvestorDashboard onNavigate={setActiveView} />;
        case 'marketplace': return <Marketplace onStartSigning={() => setActiveView('signing')} />;
        case 'kyc': return <RiskAssessment onComplete={() => setActiveView('marketplace')} />;
        case 'account': return <AccountDetails />;
        case 'reports': return <ReportCenter />;
        default: return <InvestorDashboard onNavigate={setActiveView} />;
      }
    }
    return (
      <AppContext.Consumer>
        { (val) => {
          switch (activeView) {
            case 'dashboard': return <ManagerDashboard onNavigate={setActiveView} />;
            case 'clients': return <ClientList />;
            case 'requests': return <RequestManagement />;
            case 'portfolios': return <PortfolioGallery />;
            case 'fees': return <FeeManagement />;
            case 'reports': return <ReportCenter />;
            case 'settings': return <SettingsView />;
            default: return <ManagerDashboard onNavigate={setActiveView} />;
          }
        }}
      </AppContext.Consumer>
    );
  };

  const navItems = role === UserRole.INVESTOR ? [
    { id: 'dashboard', label: t('nav_dashboard_investor'), icon: LayoutDashboard },
    { id: 'marketplace', label: t('nav_marketplace'), icon: Compass },
    { id: 'account', label: t('nav_account'), icon: Lock },
    { id: 'reports', label: t('nav_reports'), icon: FileBarChart },
    { id: 'kyc', label: t('nav_kyc'), icon: ShieldCheck },
  ] : [
    { id: 'dashboard', label: t('nav_dashboard_manager'), icon: LayoutDashboard },
    { id: 'clients', label: t('nav_clients'), icon: Users },
    { id: 'requests', label: t('nav_requests'), icon: ClipboardCheck },
    { id: 'portfolios', label: t('nav_portfolios'), icon: FileText },
    { id: 'fees', label: t('nav_fees'), icon: Percent },
    { id: 'reports', label: t('nav_reports'), icon: FileBarChart },
    { id: 'settings', label: t('nav_settings'), icon: Settings },
  ];

  return (
    <AppContext.Provider value={{ lang, setLang, role, setRole, isLoggedIn, setIsLoggedIn, balance, setBalance, agreements, setAgreements, addAgreement, requests, setRequests, t, setActiveView }}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2 text-blue-400 mb-10 px-2">
              <PieChart className="w-8 h-8" />
              <span className="text-xl font-black tracking-tighter text-white italic">WealthPulse</span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveView(item.id as View)} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-[13px] font-bold transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'hover:bg-white/5'}`}>
                  <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-slate-500'}`} /> {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 bg-black/20">
            <div className="flex items-center gap-3 px-3 py-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-black text-xs shadow-lg uppercase">{role === UserRole.INVESTOR ? 'SC' : 'AL'}</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black truncate text-white uppercase tracking-widest">{role === UserRole.INVESTOR ? 'Sarah Chen' : 'Alex Li'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Verified Advisor</p>
              </div>
              <button onClick={() => { setIsLoggedIn(false); setRole(UserRole.GUEST); }} className="text-slate-500 hover:text-white transition-colors p-1"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
            <div className="relative w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="全局检索策略、工单或代码..." className="w-full pl-12 pr-4 py-3 bg-slate-100/50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all" /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Online</span></div>
              <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="text-[10px] font-black text-slate-600 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-[0.2em]"> {lang === 'zh' ? 'EN' : '中文'} </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-12 bg-[#f8fafc]">{renderView()}</div>
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
