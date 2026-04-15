import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from './client-response.dto';

export class ChartDataItemDto {
  @ApiProperty({ example: '2025-04' })
  month: string;

  @ApiProperty({ example: 5 })
  count: number;
}

export class DashboardResponseDto {
  @ApiProperty()
  totalClients: number;

  @ApiProperty()
  totalCompanyValue: number;

  @ApiProperty({ type: [ClientResponseDto] })
  latestClients: ClientResponseDto[];

  @ApiProperty({ type: [ChartDataItemDto], description: 'Monthly client count for chart' })
  chartData: ChartDataItemDto[];
}
