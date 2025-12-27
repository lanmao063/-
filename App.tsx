
import React, { useState, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ClipboardCheck, 
  Settings, 
  Bell, 
  Search,
  PieChart,
  Languages
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import RequestManagement from './components/RequestManagement';
import PortfolioGallery from './components/PortfolioGallery';

// 语言上下文
type Language = 'zh' | 'en';
interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

// Fixed compilation error by adding View type definition
type View = 'dashboard' | 'clients' | 'portfolios' | 'requests' | 'settings';

const translations: Record<Language, Record<string, string>> = {
  zh: {
    nav_dashboard: '工作控制台',
    nav_clients: '客户管理',
    nav_portfolios: '基金策略组合管理',
    nav_requests: '审批任务中心',
    nav_settings: '系统设置',
    search_placeholder: '搜索客户、审批单或组合...',
    sys_status: '系统状态',
    sys_ok: '运行正常',
    user_role: '高级投资顾问',
    user_name: 'Alex Li',
    tab_active: '待处理任务',
    tab_history: '历史归档',
    msg_transfer_out_notice: '注：根据客户托管协议，资金转出属于告知项，系统已自动处理，请点击确认知晓。',
    msg_ai_rebalance_notice: '注：系统已根据 AI 模型算法完成自动调仓，请投资经理对执行结果进行合规性复核。',
    btn_acknowledge: '确认知晓',
    btn_manual_fix: '手动修正/干预',
    btn_verify_ok: '核对无误/归档',
    // 客户管理
    clients_title: '客户资产管理',
    clients_subtitle: '查看客户画像、风险偏好及持仓资产状态。',
    btn_invite: '邀请新客户开户',
    filter_all: '全部客户',
    th_info: '客户基本信息',
    th_risk: '风险等级',
    th_aum: '总资产 AUM',
    th_status: '状态',
    th_action: '管理操作',
    risk_agg: '激进型',
    risk_bal: '稳健型',
    risk_con: '保守型',
    status_active: '存续中',
    status_pending: '开户中',
    status_inactive: '已销户',
    // 组合库
    port_title: '基金策略组合管理',
    port_subtitle: '监控已上架组合的实盘表现及客户申赎情况。',
    btn_create_port: 'AI 协同构建组合',
    port_code: '编码',
    port_aum_label: '实盘规模',
    port_sub_label: '当前持仓客户',
    btn_view_subs: '查看持有客户',
    port_target_ratio: '目标资产配置比',
    port_vol: '风险波动',
    port_exp_return: '预期年化',
    port_liq: '流动性',
    port_high: '极高',
    port_low: '极低',
    btn_back: '返回列表',
    // 选项栏
    tab_allocation: '基金占比',
    tab_holders: '持仓用户',
    tab_trend: '业绩趋势',
    // 时间范围
    range_24h: '24h',
    range_3d: '3d',
    range_1w: '1w',
    range_1m: '1m',
    range_6m: '6m',
    // 订阅列表
    sub_title: '持仓客户明细',
    sub_th_invested: '申购总额',
    sub_th_pl: '累计盈亏',
    sub_th_date: '申购日期',
    // AI 流程
    ai_step_1: '主观观点录入',
    ai_step_2: '因子选基规则',
    ai_step_3: '历史回溯评测',
    ai_step_4: '方案上架',
    ai_prompt_ph: '请输入您对当前市场的观点，例如：看好半导体行业反弹，同时希望增加黄金避险，降低地产股比例...',
    ai_btn_analyze: 'AI 生成配比建议',
    ai_factors_title: '多因子选基引擎',
    ai_factor_sharpe: '夏普比率 (Sharpe)',
    ai_factor_alpha: '超额收益 (Alpha)',
    ai_factor_vol: '波动率控制',
    ai_factor_size: '基金规模优先',
    ai_btn_pick: 'AI 挑选特定标的',
    ai_backtest_title: '历史回溯测试 (近3年)',
    ai_verdict_pass: '评测通过：建议上架',
    ai_verdict_fail: '评测未通过：风险波动过载',
    ai_publish_ready: '方案已准备就绪，可以发布至客户终端。',
    btn_publish: '立即上架发布'
  },
  en: {
    nav_dashboard: 'Dashboard',
    nav_clients: 'Clients',
    nav_portfolios: 'Fund Strategy Management',
    nav_requests: 'Audit Center',
    nav_settings: 'Settings',
    search_placeholder: 'Search clients, requests or portfolios...',
    sys_status: 'System Status',
    sys_ok: 'Running Smoothly',
    user_role: 'Senior Advisor',
    user_name: 'Alex Li',
    tab_active: 'Pending',
    tab_history: 'Archives',
    msg_transfer_out_notice: 'Note: Per custody agreement, fund withdrawals are notification-only. System has processed this; please acknowledge.',
    msg_ai_rebalance_notice: 'Note: System has auto-executed rebalancing via AI. Manager review required for compliance verification.',
    btn_acknowledge: 'Acknowledge',
    btn_manual_fix: 'Manual Adjustment',
    btn_verify_ok: 'Verify & Archive',
    // Clients
    clients_title: 'Client Asset Management',
    clients_subtitle: 'Monitor client profiles, risk appetite, and portfolio status.',
    btn_invite: 'Invite New Client',
    filter_all: 'All Clients',
    th_info: 'Client Information',
    th_risk: 'Risk Level',
    th_aum: 'Total AUM',
    th_status: 'Status',
    th_action: 'Actions',
    risk_agg: 'Aggressive',
    risk_bal: 'Balanced',
    risk_con: 'Conservative',
    status_active: 'Active',
    status_pending: 'Pending',
    status_inactive: 'Closed',
    // Portfolios
    port_title: 'Fund Strategy Management',
    port_subtitle: 'Monitor performance and client subscriptions of active portfolios.',
    btn_create_port: 'AI Co-pilot Creation',
    port_code: 'Code',
    port_aum_label: 'AUM (Real Money)',
    port_sub_label: 'Active Holders',
    btn_view_subs: 'View Holders',
    port_target_ratio: 'Target Allocation',
    port_vol: 'Volatility',
    port_exp_return: 'Exp. Return',
    port_liq: 'Liquidity',
    port_high: 'Very High',
    port_low: 'Very Low',
    btn_back: 'Back to List',
    // Tabs
    tab_allocation: 'Allocation',
    tab_holders: 'Holders',
    tab_trend: 'Trend',
    // Ranges
    range_24h: '24h',
    range_3d: '3d',
    range_1w: '1w',
    range_1m: '1m',
    range_6m: '6m',
    // Subs
    sub_title: 'Portfolio Holders',
    sub_th_invested: 'Principal',
    sub_th_pl: 'Total P/L',
    sub_th_date: 'Inception',
    // AI Flow
    ai_step_1: 'Market View',
    ai_step_2: 'Factor Rules',
    ai_step_3: 'Backtest Analysis',
    ai_step_4: 'Publishing',
    ai_prompt_ph: 'Enter your market view, e.g., bullish on AI tech, hedge with gold, reduce exposure to real estate...',
    ai_btn_analyze: 'AI Suggest Allocation',
    ai_factors_title: 'Multi-Factor Selection',
    ai_factor_sharpe: 'Sharpe Ratio',
    ai_factor_alpha: 'Alpha (Alpha)',
    ai_factor_vol: 'Volatility Ctrl',
    ai_factor_size: 'Fund Size Pref',
    ai_btn_pick: 'AI Pick Target Funds',
    ai_backtest_title: 'Historical Backtest (3Y)',
    ai_verdict_pass: 'Verdict: PASS (Ready to Publish)',
    ai_verdict_fail: 'Verdict: FAIL (High Risk Drift)',
    ai_publish_ready: 'Portfolio is ready to be published to client terminals.',
    btn_publish: 'Publish Now'
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (s) => s
});

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [lang, setLang] = useState<Language>('zh');

  const t = (key: string) => translations[lang][key] || key;

  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: 'clients', label: t('nav_clients'), icon: Users },
    { id: 'portfolios', label: t('nav_portfolios'), icon: Briefcase },
    { id: 'requests', label: t('nav_requests'), icon: ClipboardCheck },
    { id: 'settings', label: t('nav_settings'), icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={setActiveView} />;
      case 'clients': return <ClientList />;
      case 'requests': return <RequestManagement />;
      case 'portfolios': return <PortfolioGallery />;
      default: return <div className="p-8 text-slate-500">Coming Soon...</div>;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-2 text-blue-400 mb-8">
              <PieChart className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-white">WealthPulse</span>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as View)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeView === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">{t('user_name')}</p>
                <p className="text-xs text-slate-500 truncate">{t('user_role')}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('search_placeholder')}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                <Languages className="w-3.5 h-3.5 text-blue-500" />
                {lang === 'zh' ? 'English' : '中文'}
              </button>

              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-sm font-medium text-slate-600">
                {t('sys_status')}: <span className="text-green-500 font-bold">{t('sys_ok')}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
