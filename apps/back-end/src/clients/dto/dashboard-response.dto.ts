import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from './client-response.dto';

export class DashboardResponseDto {
  @ApiProperty()
  totalClients: number;

  @ApiProperty()
  totalSalary: number;

  @ApiProperty()
  totalCompanyValue: number;

  @ApiProperty({ type: [ClientResponseDto] })
  latestClients: ClientResponseDto[];

  @ApiProperty({ type: [Object], description: 'Monthly client count for chart' })
  chartData: { month: string; count: number }[];
}
