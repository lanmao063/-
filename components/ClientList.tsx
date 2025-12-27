
import React, { useState } from 'react';
import { Customer } from '../types';
import { MoreVertical, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

const mockClients: Customer[] = [
  { id: 'C001', name: '李忠', email: 'li.zhong@example.com', phone: '+86 138 0000 1111', riskPreference: 'BALANCED', accountBalance: 1250000, registrationDate: '2023-10-12', status: 'ACTIVE' },
  { id: 'C002', name: '陈莎拉', email: 'schen88@example.com', phone: '+86 139 2222 3333', riskPreference: 'AGGRESSIVE', accountBalance: 4500000, registrationDate: '2023-11-05', status: 'ACTIVE' },
  { id: 'C003', name: '王大卫', email: 'david.w@example.com', phone: '+86 137 5555 6666', riskPreference: 'CONSERVATIVE', accountBalance: 850000, registrationDate: '2024-01-20', status: 'PENDING' },
  { id: 'C004', name: '张艾琳', email: 'elena.z@example.com', phone: '+86 135 1111 2222', riskPreference: 'BALANCED', accountBalance: 2100000, registrationDate: '2023-09-15', status: 'ACTIVE' },
  { id: 'C005', name: '何罗伯特', email: 'rho.finance@example.com', phone: '+86 133 4444 5555', riskPreference: 'AGGRESSIVE', accountBalance: 120000, registrationDate: '2024-02-10', status: 'INACTIVE' },
];

const ClientList: React.FC = () => {
  const [filter, setFilter] = useState('ALL');

  const riskLabels = {
    CONSERVATIVE: '保守型',
    BALANCED: '稳健型',
    AGGRESSIVE: '激进型'
  };

  const statusLabels = {
    ACTIVE: '存续中',
    PENDING: '开户中',
    INACTIVE: '已销户'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">客户资产管理</h1>
          <p className="text-slate-500 text-sm">查看客户画像、风险偏好及持仓资产状态。</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md">
          邀请新客户开户
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['ALL', 'ACTIVE', 'PENDING', 'INACTIVE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f === 'ALL' ? '全部客户' : statusLabels[f as keyof typeof statusLabels]}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">客户基本信息</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">风险等级</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">总资产 AUM</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">状态</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockClients.filter(c => filter === 'ALL' || c.status === filter).map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {client.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{client.name}</div>
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
                    ¥{client.accountBalance.toLocaleString()}
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
                    <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg" title="联系客户"><Mail className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg" title="查看组合"><ExternalLink className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
