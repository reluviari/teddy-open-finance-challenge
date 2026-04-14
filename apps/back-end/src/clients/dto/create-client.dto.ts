import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'eduardo@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  @IsString()
  @IsOptional()
  phone?: string;
}
