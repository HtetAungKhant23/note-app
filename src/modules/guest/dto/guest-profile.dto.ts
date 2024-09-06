import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

enum GENDER {
  M = 'M',
  F = 'F',
}

export class GuestProfileDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: GENDER, example: GENDER.M })
  @IsOptional()
  gender?: GENDER;
}
