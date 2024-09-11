import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BookingPeriodDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  period: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  seater: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
