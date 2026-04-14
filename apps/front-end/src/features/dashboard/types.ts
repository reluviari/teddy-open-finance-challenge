import { ClientResponse } from '@/features/clients/types';

export interface DashboardResponse {
  totalClients: number;
  totalSalary: number;
  totalCompanyValue: number;
  latestClients: ClientResponse[];
  chartData: { month: string; count: number }[];
}
