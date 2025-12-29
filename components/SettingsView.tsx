
import React, { useContext } from 'react';
import { User, Bell, Shield, Smartphone, Globe, Cloud, ChevronRight, Lock } from 'lucide-react';
import { AppContext } from '../App';

const SettingsView: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const sections = [
    {
      title: lang === 'zh' ? '个人与资料' : 'Profile & Account',
      items: [
        { icon: User, label: lang === 'zh' ? '基金经理名片' : 'Advisor Profile', desc: '修改头像、执业编号与联系方式' },
        { icon: Lock, label: lang === 'zh' ? '安全与密码' : 'Security & Password', desc: '两步验证、指纹登录及密码修改' },
      ]
    },
    {
      title: lang === 'zh' ? '工作台偏好' : 'Workbench Preferences',
      items: [
        { icon: Bell, label: lang === 'zh' ? '通知阈值设置' : 'Notification Thresholds', desc: '管理 AUM 预警及算法流水推送' },
        { icon: Globe, label: lang === 'zh' ? '语言与时区' : 'Language & Region', desc: '切换中英文及全球资产同步时钟' },
        { icon: Cloud, label: lang === 'zh' ? '数据导出配置' : 'Export Configurations', desc: '设置自动报告生成的格式与频率' },
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('nav_settings')}</h1>
        <p className="text-slate-500 text-sm mt-1 font-bold">管理您的 WealthPulse 个性化配置与系统合规偏好。</p>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">{section.title}</h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-50">
                {section.items.map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-100 rounded-[2.5rem] border border-slate-200 text-center">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Version Control</p>
         <p className="text-xs font-black text-slate-600">WealthPulse Enterprise Edition v3.1.2 Build 20240318</p>
      </div>
    </div>
  );
};

export default SettingsView;
