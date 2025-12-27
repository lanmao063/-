
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Trash2, 
  Plus, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';

interface AssetAllocation {
  id: string;
  name: string;
  value: number;
}

interface Props {
  onCancel: () => void;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const PortfolioCreateForm: React.FC<Props> = ({ onCancel }) => {
  const [name, setName] = useState('');
  const [risk, setRisk] = useState('BALANCED');
  const [description, setDescription] = useState('');
  const [assets, setAssets] = useState<AssetAllocation[]>([
    { id: '1', name: '大盘成长股', value: 50 },
    { id: '2', name: '现金/货币工具', value: 50 },
  ]);

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.value, 0);
  const isValid = totalAllocation === 100 && name.trim().length > 0;

  const addAsset = () => {
    const newId = (assets.length + 1).toString();
    setAssets([...assets, { id: newId, name: '新增资产类别', value: 0 }]);
  };

  const updateAsset = (id: string, field: keyof AssetAllocation, val: string | number) => {
    setAssets(assets.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const removeAsset = (id: string) => {
    if (assets.length > 1) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom duration-500">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-2xl font-bold text-slate-800">构建新的战略组合方案</h2>
        <p className="text-slate-500 text-sm mt-1">定义该投资模板的目标资产配置比及其风险偏好模型。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* 左侧表单 */}
        <div className="p-8 border-r border-slate-100 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">基础配置信息</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">组合方案名称</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：科技先锋高收益型"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">目标风险偏好等级</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'CONSERVATIVE', label: '保守型' },
                    { id: 'BALANCED', label: '稳健型' },
                    { id: 'AGGRESSIVE', label: '激进型' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRisk(r.id)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        risk === r.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">投资策略及哲学说明</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 text-sm"
                  placeholder="描述该组合的投资逻辑、核心标的选择准则及预期目标..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">资产配置权重 (%)</h3>
              <button 
                onClick={addAsset}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-3 h-3" /> 添加资产类别
              </button>
            </div>
            
            <div className="space-y-3">
              {assets.map((asset, idx) => (
                <div key={asset.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <input 
                    type="text" 
                    value={asset.name}
                    onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-medium"
                    placeholder="资产名称"
                  />
                  <div className="relative w-24">
                    <input 
                      type="number" 
                      value={asset.value}
                      onChange={(e) => updateAsset(asset.id, 'value', parseInt(e.target.value) || 0)}
                      className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
                  </div>
                  <button 
                    onClick={() => removeAsset(asset.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className={`mt-6 p-4 rounded-xl flex items-center justify-between border ${
              totalAllocation === 100 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
              : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              <div className="flex items-center gap-2">
                {totalAllocation === 100 ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="text-xs font-black uppercase tracking-widest">总分配权重校验</span>
              </div>
              <span className="text-lg font-black">{totalAllocation}%</span>
            </div>
          </div>
        </div>

        {/* 右侧预览区 */}
        <div className="p-8 bg-slate-50/50 flex flex-col items-center justify-center">
          <div className="w-full max-w-xs aspect-square relative mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assets}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {assets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">权重合计数</span>
              <span className={`text-4xl font-black ${totalAllocation === 100 ? 'text-slate-900' : 'text-red-500'}`}>
                {totalAllocation}%
              </span>
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-800">合规性及完整性检查</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full ${name.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  方案名称已定义
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full ${totalAllocation === 100 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  资产分配比例平衡 (100%)
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full ${assets.every(a => a.value > 0) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  无空缺权重的资产项
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 text-sm font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                放弃修改
              </button>
              <button 
                disabled={!isValid}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-lg ${
                  isValid 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/10' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                保存并生效组合
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCreateForm;
