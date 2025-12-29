
import React, { useState, createContext, useContext } from 'react';
import { 
  LayoutDashboard, Compass, ShieldCheck, Lock, Bell, Search, Settings,
  PieChart, User, Briefcase, LogOut, ShieldAlert, FileText,
  ArrowRight, Wallet, CreditCard, Smartphone, Building, Users, ClipboardCheck, Activity
} from 'lucide-react';
import { UserRole, RiskLevel, AgreementStatus } from './types';

// 投资者视图
import InvestorDashboard from './components/InvestorDashboard';
import Marketplace from './components/Marketplace';
import RiskAssessment from './components/RiskAssessment';
import AccountDetails from './components/AccountDetails';

// 经理视图
import ManagerDashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import RequestManagement from './components/RequestManagement';
import PortfolioGallery from './components/PortfolioGallery';
import SettingsView from './components/SettingsView';

type Language = 'zh' | 'en';
type View = 'dashboard' | 'marketplace' | 'kyc' | 'account' | 'signing' | 'amount' | 'method' | 'payment' | 
             'clients' | 'requests' | 'portfolios' | 'settings';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  balance: number;
  setBalance: (v: number) => void;
  agreements: any[];
  addAgreement: (a: any) => void;
  t: (key: string) => string;
  setActiveView: (v: View) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const translations: any = {
  zh: {
    nav_dashboard_manager: '业务监控概览', 
    nav_dashboard_investor: '资产总览',
    nav_marketplace: '策略广场', 
    nav_kyc: '风险测评',
    nav_account: '财富账户', 
    nav_clients: '投资者名册',
    nav_requests: '算法交易合规',
    nav_portfolios: '投顾方案库',
    nav_settings: '系统配置',
    
    clients_title: '投资者名册',
    clients_subtitle: '存量投资者的基本信息、风险评级及资产在管情况（10/页）。',
    btn_invite: '邀请新投资者',
    th_info: '基本信息',
    th_risk: '偏好等级',
    th_aum: '在管资产 (AUM)',
    th_status: '账户状态',
    th_action: '操作',
    filter_all: '全量客户',
    risk_con: '保守型',
    risk_bal: '平衡型',
    risk_agg: '进取型',
    status_active: '运行中',
    status_pending: '开户中',
    status_inactive: '已销户',
    
    tab_active: '待处理复核',
    tab_history: '历史稽核',
    btn_acknowledge: '确认知悉',
    btn_manual_fix: '介入调平',
    btn_verify_ok: '通过并入账',
    msg_ai_rebalance_notice: '算法已执行权重微调，请复核偏离度。',
    msg_transfer_out_notice: '大额赎回申请，请确保流动性覆盖。',

    port_title: '投顾方案仓库',
    port_subtitle: '上架策略的实时业绩表现及持有人分布。',
    btn_create_port: '创建新方案',
    btn_back: '返回列表',
    port_aum_label: '总规模 (AUM)',
    port_vol: '波动特征',
    port_high: '高弹性',
    port_low: '低波',
    port_exp_return: '预期目标',
    port_sub_label: '持有人',
    tab_allocation: '资产穿透',
    tab_holders: '持有人名册',
    tab_trend: '收益曲线',
    btn_view_subs: '调看详细名单',
    range_24h: '24H', range_3d: '3D', range_1w: '1W', range_1m: '1M', range_6m: '6M',
    sub_title: '持有者详情',

    ai_step_1: '主观观点',
    ai_step_2: '因子配置',
    ai_step_3: '持仓拟定',
    ai_step_4: '仿真回测',
    ai_prompt_ph: '例如：看好半导体反弹，配置50%半导体，30%国债对冲...',
    ai_btn_analyze: '智能分析',
    ai_btn_pick: '算法选基',
    ai_btn_backtest: '启动回测',
    ai_factors_title: '因子倾向',
    ai_factor_sharpe: '夏普比率', ai_factor_alpha: '超额收益', ai_factor_vol: '波动控制', ai_factor_size: '规模偏向',
    ai_verdict_pass: '回测通过', ai_verdict_fail: '指标超标',
    ai_publish_ready: '方案已通过仿真，风险指标稳健。',
    btn_publish: '发布策略',
    
    user_role_investor: '财富尊享用户',
    user_role_manager: '资深基金经理',
    login_investor: '投资者登录',
    login_manager: '管理后台登录',
    holding_amount: '持仓总额',
    btn_back_prev: '返回',
    btn_confirm_pay: '确认并支付',
    btn_cancel: '取消',
    btn_sign_sub: '签署并申购',
    pay_bank: '银行卡直扣',
    pay_wallet: '数字钱包',
    pay_wire: '大额支付单',
    pay_safe_msg: '加密隔离清算环境中...',
    agreement_title: '服务协议签署',
    amount_title: '申购金额',
    amount_min: '单笔起投',
    method_title: '选择支付方式'
  },
  en: {
    nav_dashboard_manager: 'Business Insights', 
    nav_dashboard_investor: 'My Assets',
    nav_marketplace: 'Strategy Hub', 
    nav_kyc: 'Risk Profiling',
    nav_account: 'Wealth Account', 
    nav_clients: 'Investor Registry',
    nav_requests: 'Algo Compliance',
    nav_portfolios: 'Portfolio Center',
    nav_settings: 'System Config',
    
    clients_title: 'Investor Registry',
    clients_subtitle: 'Manage active investors, risk profiles and AUM (10 per page).',
    btn_invite: 'Invite Investor',
    th_info: 'Investor Info',
    th_risk: 'Risk Profile',
    th_aum: 'AUM',
    th_status: 'Status',
    th_action: 'Action',
    filter_all: 'All Clients',
    risk_con: 'Conservative',
    risk_bal: 'Balanced',
    risk_agg: 'Aggressive',
    status_active: 'Active',
    status_pending: 'Pending',
    status_inactive: 'Closed',
    
    tab_active: 'Active Audits',
    tab_history: 'History Logs',
    btn_acknowledge: 'Acknowledge',
    btn_manual_fix: 'Manual Fix',
    btn_verify_ok: 'Approve & Settle',
    msg_ai_rebalance_notice: 'Algorithm adjusted weights; please verify the deviation.',
    msg_transfer_out_notice: 'Large withdrawal request; ensure liquidity coverage.',

    port_title: 'Portfolio Strategies',
    port_subtitle: 'Real-time performance and holder distribution of active strategies.',
    btn_create_port: 'Create Strategy',
    btn_back: 'Back to List',
    port_aum_label: 'Total AUM',
    port_vol: 'Volatility',
    port_high: 'High Alpha',
    port_low: 'Low Vol',
    port_exp_return: 'Target Return',
    port_sub_label: 'Holders',
    tab_allocation: 'Allocation',
    tab_holders: 'Holders',
    tab_trend: 'Returns Curve',
    btn_view_subs: 'View Subscribers',
    range_24h: '24H', range_3d: '3D', range_1w: '1W', range_1m: '1M', range_6m: '6M',
    sub_title: 'Holder Details',

    ai_step_1: 'View Input',
    ai_step_2: 'Factor Config',
    ai_step_3: 'Holdings Draft',
    ai_step_4: 'Sim Backtest',
    ai_prompt_ph: 'e.g., Bullish on Tech rebound, allocate 50% to Tech, hedge with 30% Bonds...',
    ai_btn_analyze: 'AI Analysis',
    ai_btn_pick: 'Select Funds',
    ai_btn_backtest: 'Run Backtest',
    ai_factors_title: 'Factor Bias',
    ai_factor_sharpe: 'Sharpe Ratio', ai_factor_alpha: 'Alpha Seeking', ai_factor_vol: 'Risk Control', ai_factor_size: 'Market Cap',
    ai_verdict_pass: 'Backtest Passed', ai_verdict_fail: 'Limit Breached',
    ai_publish_ready: 'Sim test successful; risk metrics are stable.',
    btn_publish: 'Publish Strategy',
    
    user_role_investor: 'Wealth Client',
    user_role_manager: 'Fund Manager',
    login_investor: 'Investor Login',
    login_manager: 'Management Login',
    holding_amount: 'Total Holdings',
    btn_back_prev: 'Back',
    btn_confirm_pay: 'Confirm & Pay',
    btn_cancel: 'Cancel',
    btn_sign_sub: 'Sign & Subscribe',
    pay_bank: 'Bank Transfer',
    pay_wallet: 'Digital Wallet',
    pay_wire: 'Large Wire',
    pay_safe_msg: 'Encrypted clearing environment...',
    agreement_title: 'Agreement Signing',
    amount_title: 'Subscription Amount',
    amount_min: 'Min Investment',
    method_title: 'Payment Method'
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
  ]);
  
  const [buyingStrategy, setBuyingStrategy] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState<number>(0);

  const t = (key: string) => translations[lang][key] || key;
  const addAgreement = (a: any) => setAgreements(prev => [a, ...prev]);

  if (role === UserRole.GUEST) {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
          {[
            { id: UserRole.MANAGER, title: lang === 'zh' ? '我是基金经理' : 'I am a Manager', desc: lang === 'zh' ? '全流程管理方案、投资者名册及合规复核' : 'Full-cycle management of portfolios and investors.', icon: Briefcase, color: 'bg-blue-600', shadow: 'shadow-blue-100' },
            { id: UserRole.INVESTOR, title: lang === 'zh' ? '我是投资者' : 'I am an Investor', desc: lang === 'zh' ? '一站式浏览方案、在线签约及资产监控' : 'Browse strategies and monitor your wealth assets.', icon: User, color: 'bg-slate-900', shadow: 'shadow-slate-200' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setRole(item.id as UserRole)} 
              className={`bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl ${item.shadow} hover:scale-[1.02] transition-all group`}
            >
              <div className={`${item.color} w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl mx-auto`}>
                <item.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed px-6 font-medium">{item.desc}</p>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                {lang === 'zh' ? '进入系统' : 'Enter Terminal'} <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-96 space-y-8 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
          <div className="text-center">
             <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <PieChart className="w-8 h-8 text-blue-600" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t(`login_${role.toLowerCase()}`)}</h1>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder={lang === 'zh' ? "账号 / 编号" : "Account ID"} className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
            <input type="password" placeholder={lang === 'zh' ? "密码" : "Password"} className="w-full px-6 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
            <button onClick={() => setIsLoggedIn(true)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest">
              {lang === 'zh' ? '登录' : 'Sign In'}
            </button>
            <button onClick={() => setRole(UserRole.GUEST)} className="w-full py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">{t('btn_back_prev')}</button>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (role === UserRole.INVESTOR) {
      switch (activeView) {
        case 'dashboard': return <InvestorDashboard onNavigate={setActiveView} />;
        case 'marketplace': return <Marketplace onStartSigning={(strat: any) => { setBuyingStrategy(strat); setActiveView('signing'); }} />;
        case 'kyc': return <RiskAssessment onComplete={() => setActiveView('marketplace')} />;
        case 'account': return <AccountDetails />;
        case 'signing': return <SigningProcess strategy={buyingStrategy} onFinish={() => setActiveView('amount')} onCancel={() => setActiveView('marketplace')} />;
        case 'amount': return <AmountProcess strategy={buyingStrategy} onFinish={(amt) => { setInvestAmount(amt); setActiveView('method'); }} onCancel={() => setActiveView('marketplace')} />;
        case 'method': return <MethodProcess amount={investAmount} onFinish={() => setActiveView('payment')} onCancel={() => setActiveView('marketplace')} />;
        case 'payment': return <PaymentProcess strategy={buyingStrategy} amount={investAmount} onFinish={() => setActiveView('account')} onCancel={() => setActiveView('marketplace')} />;
        default: return <InvestorDashboard onNavigate={setActiveView} />;
      }
    }
    if (role === UserRole.MANAGER) {
      switch (activeView) {
        case 'dashboard': return <ManagerDashboard onNavigate={setActiveView} />;
        case 'clients': return <ClientList />;
        case 'requests': return <RequestManagement />;
        case 'portfolios': return <PortfolioGallery />;
        case 'settings': return <SettingsView />;
        default: return <ManagerDashboard onNavigate={setActiveView} />;
      }
    }
    return null;
  };

  const navItems = role === UserRole.INVESTOR ? [
    { id: 'dashboard', label: t('nav_dashboard_investor'), icon: LayoutDashboard },
    { id: 'marketplace', label: t('nav_marketplace'), icon: Compass },
    { id: 'kyc', label: t('nav_kyc'), icon: ShieldCheck },
    { id: 'account', label: t('nav_account'), icon: Lock },
  ] : [
    { id: 'dashboard', label: t('nav_dashboard_manager'), icon: LayoutDashboard },
    { id: 'clients', label: t('nav_clients'), icon: Users },
    { id: 'requests', label: t('nav_requests'), icon: ClipboardCheck },
    { id: 'portfolios', label: t('nav_portfolios'), icon: FileText },
    { id: 'settings', label: t('nav_settings'), icon: Settings },
  ];

  return (
    <AppContext.Provider value={{ lang, setLang, role, setRole, isLoggedIn, setIsLoggedIn, balance, setBalance, agreements, addAgreement, t, setActiveView }}>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-['Inter']">
        <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2 text-blue-400 mb-8 px-2">
              <PieChart className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-white italic">WealthPulse</span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveView(item.id as View)} 
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5" /> {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border-2 border-blue-500 uppercase">
                {role === UserRole.INVESTOR ? 'SC' : 'AL'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">{role === UserRole.INVESTOR ? 'Sarah Chen' : 'Alex Li'}</p>
                <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{t(`user_role_${role.toLowerCase()}`)}</p>
              </div>
              <button onClick={() => { setIsLoggedIn(false); setRole(UserRole.GUEST); setActiveView('dashboard'); }} className="text-slate-500 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder={lang === 'zh' ? "快速查找..." : "Search..."} className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 transition-all outline-none font-medium" />
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="text-xs font-black text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors uppercase tracking-widest font-black"> {lang === 'zh' ? 'EN' : 'CN'} </button>
              <div className="relative cursor-pointer"><Bell className="w-6 h-6 text-slate-400" /><span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
            {renderView()}
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
};

const SigningProcess: React.FC<{strategy: any, onFinish: () => void, onCancel: () => void}> = ({strategy, onFinish, onCancel}) => {
  const ctx = useContext(AppContext);
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-12">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600" /> {ctx?.t('agreement_title')} - {strategy?.name}</h2>
        <div className="h-96 overflow-y-auto bg-slate-50 p-8 rounded-3xl text-xs text-slate-500 leading-relaxed border border-slate-100 scrollbar-hide mb-8 shadow-inner font-medium">
          <p className="font-black text-slate-800 mb-4 text-sm underline decoration-blue-200 decoration-4">{ctx?.lang === 'zh' ? '第一条 协议宗旨' : 'Article 1: Purpose'}</p>
          <p className="mb-4">{ctx?.lang === 'zh' ? '本协议旨在明确投顾机构与投资者之间的委托管理关系。投资者确认已充分了解策略风险，并同意资产进行托管监控...' : 'This agreement defines the discretionary management relationship between the advisor and the investor. The investor confirms full understanding of risks...'}</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer group mb-10 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 transition-all hover:bg-blue-50">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-6 h-6 rounded-lg accent-blue-600 cursor-pointer" />
          <span className="text-sm font-bold text-slate-700">{ctx?.lang === 'zh' ? '我已阅读并完全同意上述协议内容' : 'I have read and fully agree to the terms above'}</span>
        </label>
        <div className="grid grid-cols-2 gap-6">
          <button onClick={onCancel} className="py-5 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest font-black">{ctx?.t('btn_cancel')}</button>
          <button onClick={onFinish} disabled={!agreed} className="py-5 rounded-2xl bg-slate-900 text-white font-black hover:bg-blue-600 disabled:opacity-20 transition-all shadow-lg text-xs uppercase tracking-widest">{ctx?.lang === 'zh' ? '进入申购' : 'Proceed'}</button>
        </div>
      </div>
    </div>
  );
};

const AmountProcess: React.FC<{strategy: any, onFinish: (amt: number) => void, onCancel: () => void}> = ({strategy, onFinish, onCancel}) => {
  const ctx = useContext(AppContext);
  const [val, setVal] = useState<string>(String(strategy?.min || 50000));
  return (
    <div className="max-w-md mx-auto animate-in zoom-in duration-300">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><Wallet className="w-10 h-10" /></div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">{ctx?.t('amount_title')}</h2>
        <p className="text-slate-500 text-sm mb-10 font-bold">{strategy?.name}</p>
        <div className="relative mb-6">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">¥</span>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-full pl-12 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-3xl font-black outline-none focus:border-blue-500 transition-all text-slate-800" />
        </div>
        <p className="text-xs font-bold text-slate-400 mb-10 uppercase tracking-widest">{ctx?.t('amount_min')}：¥{(strategy?.min || 0).toLocaleString()}</p>
        <button onClick={() => onFinish(Number(val))} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 uppercase tracking-widest">{ctx?.lang === 'zh' ? '确认金额' : 'Confirm Amount'}</button>
      </div>
    </div>
  );
};

const MethodProcess: React.FC<{amount: number, onFinish: (m: string) => void, onCancel: () => void}> = ({amount, onFinish, onCancel}) => {
  const ctx = useContext(AppContext);
  const [selected, setSelected] = useState('bank');
  const methods = [
    { id: 'bank', name: ctx?.t('pay_bank'), icon: Building, desc: ctx?.lang === 'zh' ? '招商银行 (尾号 8888)' : 'CMB Card (***8888)' },
    { id: 'alipay', name: ctx?.t('pay_wallet'), icon: Smartphone, desc: ctx?.lang === 'zh' ? '支持快捷协议转账' : 'Digital wallet transfer' },
    { id: 'credit', name: ctx?.t('pay_wire'), icon: CreditCard, desc: ctx?.lang === 'zh' ? '支持电汇凭证上传' : 'Upload wire transfer proof' },
  ];
  return (
    <div className="max-w-md mx-auto animate-in zoom-in duration-300">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">{ctx?.t('method_title')}</h2>
        <p className="text-slate-400 text-sm mb-10 text-center font-bold">{ctx?.lang === 'zh' ? '需支付' : 'Total Payable'}：¥{amount.toLocaleString()}</p>
        <div className="space-y-4 mb-10">
          {methods.map(m => (
            <button key={m.id} onClick={() => setSelected(m.id)} className={`w-full p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${selected === m.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected === m.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}><m.icon className="w-6 h-6" /></div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800">{m.name}</p>
                <p className="text-[10px] text-slate-500 font-bold">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => onFinish(selected)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all uppercase tracking-widest">{ctx?.t('btn_confirm_pay')}</button>
      </div>
    </div>
  );
};

const PaymentProcess: React.FC<{strategy: any, amount: number, onFinish: () => void, onCancel: () => void}> = ({strategy, amount, onFinish, onCancel}) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const ctx = useContext(AppContext);
  const handleInput = (val: string, idx: number) => {
    const newPin = [...pin];
    newPin[idx] = val.slice(-1);
    setPin(newPin);
    if (val && idx < 5) (document.getElementById(`pin-${idx + 1}`) as HTMLInputElement)?.focus();
    if (newPin.every(p => p !== '')) {
      setTimeout(() => {
        ctx?.setBalance(ctx.balance + amount); 
        ctx?.addAgreement({ id: `AG-${Date.now()}`, strategyName: strategy?.name, signDate: new Date().toISOString().split('T')[0], status: AgreementStatus.SIGNED, amount });
        onFinish();
        alert(ctx?.lang === 'zh' ? '交易成功！资产已更新。' : 'Transaction successful! Assets updated.');
      }, 800);
    }
  };
  return (
    <div className="max-w-md mx-auto animate-in zoom-in duration-300">
      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl"><Lock className="w-8 h-8" /></div>
        <h2 className="text-2xl font-black mb-10">{ctx?.lang === 'zh' ? '请输入支付密码' : 'Enter Payment PIN'}</h2>
        <div className="flex justify-between mb-12">
          {pin.map((p, i) => (
            <input key={i} id={`pin-${i}`} type="password" value={p} onChange={e => handleInput(e.target.value, i)} className="w-12 h-16 bg-white/10 border border-white/20 rounded-xl text-center text-2xl font-black outline-none focus:border-blue-500 transition-all" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest"><ShieldAlert className="w-4 h-4 text-emerald-500" /> {ctx?.t('pay_safe_msg')}</div>
      </div>
    </div>
  );
};

export default App;
