export interface ReportSummary {
  totalPaid: number;
  totalOverdue: number;
  totalPending: number;
  countPaid: number;
  countOverdue: number;
  countPending: number;
}

export interface PerformanceData {
  recoveryRate: number;
  recoveredAmount: number;
  avoidedChurn: number;
  averageDaysToPay: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  overdueCount: number;
  totalOverdueAmount: number;
}

export interface ForecastData {
  name: string;
  valor: number;
}
