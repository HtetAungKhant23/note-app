import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BookingPeriodDto } from './booking.dto';

enum GENDER {
  M = 'M',
  F = 'F',
}

export class CreateGuestDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ enum: GENDER, example: GENDER.M })
  @IsNotEmpty()
  gender: GENDER;

  @ApiProperty({ type: BookingPeriodDto })
  booking: BookingPeriodDto;
}
