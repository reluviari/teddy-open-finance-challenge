import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  companyValue: number;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ClientListResponseDto {
  @ApiProperty({ type: [ClientResponseDto] })
  data: ClientResponseDto[];

  @ApiProperty()
  total: number;
}
