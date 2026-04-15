import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Eduardo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 3500 })
  @IsNumber()
  @Min(0)
  salary: number;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  @Min(0)
  companyValue: number;

}
