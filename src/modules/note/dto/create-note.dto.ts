import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  text: string;
}
