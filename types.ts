
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
  NORMAL = '未开启隔离'
}

export enum AgreementStatus {
  SIGNED = '已签署',
  PENDING = '待签署',
  EXPIRED = '已过期'
}

export interface PortfolioStrategy {
  code: string;
  name: string;
  riskLevel: RiskLevel;
  minInvestment: number;
  expectedReturn: string;
  tags: string[];
}

export interface AdvisoryAgreement {
  id: string;
  signDate: string;
  strategyName: string;
  status: AgreementStatus;
}

export interface Holding {
  name: string;
  value: number;
  color: string;
}

// Added missing Customer interface for ClientList.tsx
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

// Added missing enums and interfaces for RequestManagement.tsx
export enum RequestStatus {
  AUDITING = 'AUDITING',
  VALIDATING = 'VALIDATING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum RequestType {
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  REBALANCING = 'REBALANCING'
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
}
