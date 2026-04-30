export interface ReportSummary {
  total_revenue: number;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
  recovery_rate: number;
  revenue_change: number;
  recovery_change: number;
}

export interface PerformanceData {
  recoveryRate: number;
  recoveredAmount: number;
  avoidedChurn: number;
  averageDaysToPay: number;
  chart: Array<{
    name: string;
    total: number;
    paid: number;
  }>;
}

export interface TopCustomer {
  id: string;
  name: string;
  total_paid: number;
  charge_count: number;
  overdueCount: number;
  totalOverdueAmount: number;
}

export interface ForecastData {
  date: string;
  expected: number;
}
