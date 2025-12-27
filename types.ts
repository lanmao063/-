

export enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  VALIDATING = 'VALIDATING',
  AUDITING = 'AUDITING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum RequestType {
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  REBALANCING = 'REBALANCING',
  TERMINATION = 'TERMINATION'
}

export interface Customer {
  id: string;
  name: string;
  // Added nameEn to fix compilation errors in components
  nameEn: string;
  email: string;
  phone: string;
  riskPreference: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  accountBalance: number;
  registrationDate: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export interface Asset {
  id: string;
  type: string;
  marketValue: number;
  amount: number;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  createdDate: string;
  assets: Asset[];
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