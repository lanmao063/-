
import React, { useState, useContext, useMemo } from 'react';
import { Customer } from '../types';
import { MoreVertical, Mail, Phone, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { AppContext } from '../App';

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
  const firstnames = ['伟', '娜', '刚', '秀英', '强', '明', '平', '芳', '波', '辉', '红', '军', '勇', '健', '英', '华', '梅', '亮', '琴', '林'];
  const risks: ('CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE')[] = ['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'];

  for (let i = 11; i <= 100; i++) {
    const sIdx = Math.floor(Math.random() * surnames.length);
    const fIdx = Math.floor(Math.random() * firstnames.length);
    baseClients.push({
      id: `C${String(i).padStart(3, '0')}`,
      name: surnames[sIdx] + firstnames[fIdx],
      nameEn: `Client ${i}`,
      email: `client.${i}@wealthpulse.com`,
      phone: `+86 13${Math.floor(Math.random()*10)} ${Math.floor(Math.random()*9000+1000)} ${Math.floor(Math.random()*9000+1000)}`,
      riskPreference: risks[Math.floor(Math.random()*3)],
      accountBalance: Math.floor(Math.random() * 8000000) + 100000,
      registrationDate: '2024-01-01',
      status: 'ACTIVE'
    });
  }
  return baseClients;
};

const mockClients = generateMoreMockClients();
const ITEMS_PER_PAGE = 10;

const ClientList: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

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

  const filteredClients = useMemo(() => {
    return mockClients.filter(c => {
      const matchesFilter = filter === 'ALL' || c.status === filter;
      const matchesSearch = c.name.includes(searchTerm) || c.id.includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const currentClients = filteredClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('clients_title')}</h1>
          <p className="text-slate-500 text-sm font-medium">{t('clients_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="查找投资者..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 outline-none w-64 font-medium"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg uppercase tracking-widest">
            {t('btn_invite')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            {['ALL', 'ACTIVE', 'PENDING'].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f === 'ALL' ? t('filter_all') : statusLabels[f as keyof typeof statusLabels]}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
            {lang === 'zh' ? `总计 ${filteredClients.length} 位在管投资者` : `TOTAL ${filteredClients.length} INVESTORS`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('th_info')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('th_risk')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('th_aum')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('th_status')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('th_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        {client.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{client.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{client.id} | {client.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className={`w-4 h-4 ${
                        client.riskPreference === 'AGGRESSIVE' ? 'text-orange-500' : 
                        client.riskPreference === 'BALANCED' ? 'text-blue-500' : 'text-green-500'
                      }`} />
                      <span className="text-xs font-bold text-slate-700">{riskLabels[client.riskPreference]}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-800">¥{client.accountBalance.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      client.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border border-green-100' :
                      client.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {statusLabels[client.status]}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white shadow-sm transition-all"><Mail className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white shadow-sm transition-all"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-white shadow-sm transition-all"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all bg-white rounded-xl shadow-sm border border-slate-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all bg-white rounded-xl shadow-sm border border-slate-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
