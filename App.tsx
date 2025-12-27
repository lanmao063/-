
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

const translations: Record<Language, Record<string, string>> = {
  zh: {
    nav_dashboard: '工作控制台',
    nav_clients: '客户管理',
    nav_portfolios: '组合模板库',
    nav_requests: '审批任务中心',
    nav_settings: '系统设置',
    search_placeholder: '搜索客户、审批单或组合...',
    sys_status: '系统状态',
    sys_ok: '运行正常',
    user_role: '高级投资顾问',
    user_name: '张经理',
    tab_active: '待办任务',
    tab_history: '历史任务',
    msg_transfer_out_notice: '注：根据客户托管协议，资金转出属于告知项，系统已自动处理，请点击确认知晓。',
    btn_acknowledge: '确认知晓'
  },
  en: {
    nav_dashboard: 'Dashboard',
    nav_clients: 'Clients',
    nav_portfolios: 'Portfolios',
    nav_requests: 'Audit Center',
    nav_settings: 'Settings',
    search_placeholder: 'Search clients, requests or portfolios...',
    sys_status: 'System Status',
    sys_ok: 'Running Smoothly',
    user_role: 'Senior Advisor',
    user_name: 'Manager Zhang',
    tab_active: 'Active Tasks',
    tab_history: 'Audit History',
    msg_transfer_out_notice: 'Note: Per custody agreement, fund withdrawals are notification-only. System has processed this; please acknowledge.',
    btn_acknowledge: 'Acknowledge'
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (s) => s
});

type View = 'dashboard' | 'clients' | 'portfolios' | 'requests' | 'settings';

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
        {/* 侧边栏 */}
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
                {lang === 'zh' ? '张' : 'Z'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">{t('user_name')}</p>
                <p className="text-xs text-slate-500 truncate">{t('user_role')}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* 页眉 */}
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
              {/* 语言切换按钮 */}
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

          {/* 视图内容 */}
          <div className="flex-1 overflow-y-auto p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
