
import React, { useState, useContext } from 'react';
import { Customer } from '../types';
import { MoreVertical, Mail, Phone, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { LanguageContext } from '../App';

// Helper to generate more mock data
const generateMoreMockClients = (): Customer[] => {
  const baseClients: Customer[] = [
    { id: 'C001', name: '李强', nameEn: 'Li Qiang', email: 'li.qiang@example.com', phone: '+86 138 0000 1111', riskPreference: 'BALANCED', accountBalance: 1250000, registrationDate: '2023-10-12', status: 'ACTIVE' },
    { id: 'C002', name: '王芳', nameEn: 'Wang Fang', email: 'wang.f@example.com', phone: '+86 139 2222 3333', riskPreference: 'AGGRESSIVE', accountBalance: 4500000, registrationDate: '2023-11-05', status: 'ACTIVE' },
    { id: 'C003', name: '张伟', nameEn: 'Zhang Wei', email: 'zhang.w@example.com', phone: '+86 137 5555 6666', riskPreference: 'CONSERVATIVE', accountBalance: 850000, registrationDate: '2024-01-20', status: 'PENDING' },
    { id: 'C004', name: '刘洋', nameEn: 'Liu Yang', email: 'liu.y@example.com', phone: '+86 135 1111 2222', riskPreference: 'BALANCED', accountBalance: 2100000, registrationDate: '2023-09-15', status: 'ACTIVE' },
    { id: 'C005', name: '陈静', nameEn: 'Chen Jing', email: 'chen.j@example.com', phone: '+86 133 4444 5555', riskPreference: 'AGGRESSIVE', accountBalance: 120000, registrationDate: '2024-02-10', status: 'INACTIVE' },
    { id: 'C006', name: '杨明', nameEn: 'Yang Ming', email: 'yang.m@example.com', phone: '+86 150 7777 8888', riskPreference: 'BALANCED', accountBalance: 3200000, registrationDate: '2023-08-01', status: 'ACTIVE' },
    { id: 'C007', name: '赵敏', nameEn: 'Zhao Min', email: 'zhao.m@example.com', phone: '+86 188 1234 5678', riskPreference: 'AGGRESSIVE', accountBalance: 8900000, registrationDate: '2023-12-12', status: 'ACTIVE' },
    { id: 'C008', name: '孙浩', nameEn: 'Sun Hao', email: 'sun.h@example.com', phone: '+86 131 9999 0000', riskPreference: 'CONSERVATIVE', accountBalance: 450000, registrationDate: '2024-03-05', status: 'ACTIVE' },
    { id: 'C009', name: '周磊', nameEn: 'Zhou Lei', email: 'zhou.l@example.com', phone: '+86 158 8888 8888', riskPreference: 'BALANCED', accountBalance: 520000, registrationDate: '2022-01-01', status: 'ACTIVE' },
    { id: 'C010', name: '吴晓丽', nameEn: 'Wu Xiaoli', email: 'wu.xl@example.com', phone: '+86 189 7777 5555', riskPreference: 'BALANCED', accountBalance: 1500000, registrationDate: '2022-06-15', status: 'ACTIVE' },
  ];

  const surnames = ['林', '徐', '高', '马', '郭', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许'];
  const surnamesEn = ['Lin', 'Xu', 'Gao', 'Ma', 'Guo', 'Liang', 'Song', 'Zheng', 'Xie', 'Han', 'Tang', 'Feng', 'Yu', 'Dong', 'Xiao', 'Cheng', 'Cao', 'Yuan', 'Deng', 'Xu'];
  const firstnames = ['伟', '娜', '刚', '秀英', '强', '明', '平', '芳', '波', '辉', '红', '军', '勇', '健', '英', '华', '梅', '亮', '琴', '林'];
  const firstnamesEn = ['Wei', 'Na', 'Gang', 'Xiuying', 'Qiang', 'Ming', 'Ping', 'Fang', 'Bo', 'Hui', 'Hong', 'Jun', 'Yong', 'Jian', 'Ying', 'Hua', 'Mei', 'Liang', 'Qin', 'Lin'];
  const risks: ('CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE')[] = ['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'];
  const statuses: ('ACTIVE' | 'PENDING' | 'INACTIVE')[] = ['ACTIVE', 'PENDING', 'INACTIVE'];

  // Create another 40 clients to make it feel dense
  for (let i = 11; i <= 50; i++) {
    const sIdx = Math.floor(Math.random() * surnames.length);
    const fIdx = Math.floor(Math.random() * firstnames.length);
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const status = statuses[Math.floor(Math.random() * 10) > 8 ? (Math.random() > 0.5 ? 1 : 2) : 0]; // Heavily bias ACTIVE

    baseClients.push({
      id: `C${String(i).padStart(3, '0')}`,
      name: surnames[sIdx] + firstnames[fIdx],
      nameEn: surnamesEn[sIdx] + ' ' + firstnamesEn[fIdx],
      email: `${surnamesEn[sIdx].toLowerCase()}.${i}@example.com`,
      phone: `+86 13${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 9000 + 1000)} ${Math.floor(Math.random() * 9000 + 1000)}`,
      riskPreference: risk,
      accountBalance: Math.floor(Math.random() * 5000000) + 50000,
      registrationDate: `2023-${Math.floor(Math.random() * 11) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      status: status
    });
  }

  return baseClients;
};

const mockClients = generateMoreMockClients();

const ClientList: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { lang, t } = useContext(LanguageContext);

  const riskLabels = {
    CONSERVATIVE: t('risk_con'),
    BALANCED: t('risk_bal'),
    AGGRESSIVE: t('risk_agg')
  };

  const statusLabels = {
    ACTIVE: t('status_active'),
    PENDING: t('status_pending'),
    INACTIVE: t('status_inactive')
  };

  const filteredClients = mockClients.filter(c => {
    const matchesFilter = filter === 'ALL' || c.status === filter;
    const matchesSearch = c.name.includes(searchTerm) || c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('clients_title')}</h1>
          <p className="text-slate-500 text-sm">{t('clients_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={lang === 'zh' ? "查找客户..." : "Search clients..."}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md whitespace-nowrap">
            {t('btn_invite')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['ALL', 'ACTIVE', 'PENDING', 'INACTIVE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f === 'ALL' ? t('filter_all') : statusLabels[f as keyof typeof statusLabels]}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {lang === 'zh' ? `显示 ${filteredClients.length} 条结果（总计 1,284）` : `Showing ${filteredClients.length} results (Total 1,284)`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('th_info')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('th_risk')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('th_aum')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('th_status')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t('th_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {lang === 'zh' ? client.name[0] : client.nameEn[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {lang === 'zh' ? client.name : client.nameEn}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{client.id} | {client.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className={`w-4 h-4 ${
                        client.riskPreference === 'AGGRESSIVE' ? 'text-orange-500' : 
                        client.riskPreference === 'BALANCED' ? 'text-blue-500' : 'text-green-500'
                      }`} />
                      <span className="text-xs font-bold text-slate-700">
                        {riskLabels[client.riskPreference]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-800">
                      {lang === 'zh' ? `¥${client.accountBalance.toLocaleString()}` : `$${(client.accountBalance / 7).toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      client.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border border-green-100' :
                      client.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {statusLabels[client.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Mail className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-4 bg-slate-50/50">
          <button className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-30" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-bold">1</span>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer transition-colors">2</span>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer transition-colors">3</span>
            <span className="text-slate-300">...</span>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer transition-colors">26</span>
          </div>
          <button className="p-2 text-slate-400 hover:text-blue-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
