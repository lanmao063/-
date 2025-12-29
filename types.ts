
export enum UserRole {
  GUEST = 'GUEST',
  MANAGER = 'MANAGER',
  INVESTOR = 'INVESTOR'
}

export enum RiskLevel {
  R1 = '保守型 (R1)',
  R2 = '稳健型 (R2)',
  R3 = '平衡型 (R3)',
  R4 = '成长型 (R4)',
  R5 = '进取型 (R5)'
}

export enum AccountStatus {
  ISOLATED = '资产已隔离',
  PENDING = '隔离处理中',
  LIQUIDATING = '清仓清算中',
  NORMAL = '未开启隔离'
}

export enum AgreementStatus {
  SIGNED = '已签署',
  PENDING = '待签署',
  TERMINATING = '申请解约中',
  TERMINATED = '已解约'
}

export interface FeeTemplate {
  id: string;
  name: string;
  type: 'MANAGEMENT' | 'PERFORMANCE' | 'CUSTODIAN';
  rate: number;
}

export interface Report {
  id: string;
  type: 'INVESTMENT' | 'DISCLOSURE';
  date: string;
  title: string;
  content?: string;
}

export interface Customer {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  riskPreference: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  accountBalance: number;
  registrationDate: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export enum RequestStatus {
  AUDITING = 'AUDITING',     // 待复核
  VALIDATING = 'VALIDATING', // 自动验证中
  SUCCESS = 'SUCCESS',       // 已完成/已归档
  FAILED = 'FAILED'          // 已驳回/异常
}

export enum RequestType {
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  REBALANCING = 'REBALANCING',
  TERMINATION = 'TERMINATION', // 清算通知
  KYC_EXPIRED = 'KYC_EXPIRED', // KYC 失效预警
  DRIFT_ALERT = 'DRIFT_ALERT'  // 组合偏离度预警
}

export interface ReviewRequest {
  id: string;
  type: RequestType;
  customerName: string;
  customerId: string;
  amount: number;
  date: string;
  status: RequestStatus;
  portfolioName?: string;
  suitabilityPassed: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  description?: string;
}
