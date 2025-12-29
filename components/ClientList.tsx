
import React, { useState, useContext, useMemo } from 'react';
import { Customer } from '../types';
import { MoreVertical, Mail, Phone, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { AppContext } from '../App';

const generateMoreMockClients = (): Customer[] => {
  const baseClients: Customer[] = [
    { id: 'C001', name: '李强', nameEn: 'Li Qiang', email: 'li.qiang@example.com', phone: '+86 138 0000 1111', riskPreference: 'BALANCED', accountBalance: 1250000, registrationDate: '2023-10-12', status: 'ACTIVE' },
    { id: 'C002', name: '王芳', nameEn: 'Wang Fang', email: 'wang.f@example.com', phone: '+86 139 2222 3333', riskPreference: 'AGGRESSIVE', accountBalance: 4500000, registrationDate: '2023-11-05', status: 'ACTIVE' },
    { id: 'C003', name: '张伟', nameEn: 'Zhang Wei', email: 'zhang.w@example.com', phone: '+86 137 5555 6666', riskPreference: 'CONSERVATIVE', accountBalance: 850000, registrationDate: '2024-01-20', status: 'PENDING' },
    { id: 'C004', name: '刘洋', nameEn: 'Liu Yang', email: 'liu.y@example.com', phone: '+86 135 1111 2222', riskPreference: 'BALANCED', accountBalance: 2100000, registrationDate: '2023-09-15', status: 'ACTIVE' },
  ];
  return baseClients;
};

const ITEMS_PER_PAGE = 10;

const ClientList: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { lang, t } = ctx;

  const riskLabels = { CONSERVATIVE: '保守型 (R1)', BALANCED: '平衡型 (R3)', AGGRESSIVE: '进取型 (R5)' };
  const statusLabels = { ACTIVE: '存续中', PENDING: '待准入', INACTIVE: '已清仓' };

  const filteredClients = useMemo(() => {
    return generateMoreMockClients().filter(c => {
      const matchesFilter = filter === 'ALL' || c.status === filter;
      const matchesSearch = c.name.includes(searchTerm) || c.id.includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('nav_clients')}</h1>
          <p className="text-slate-500 text-sm font-medium">{t('clients_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="查找投资者..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 font-medium"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-blue-600 transition-all uppercase tracking-widest">
            {t('btn_invite')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
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
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">{client.name[0]}</div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{lang === 'zh' ? client.name : client.nameEn}</div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{client.id} | {client.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-slate-700">{riskLabels[client.riskPreference]}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-800">¥{client.accountBalance.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">{statusLabels[client.status as keyof typeof statusLabels]}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><ExternalLink className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
