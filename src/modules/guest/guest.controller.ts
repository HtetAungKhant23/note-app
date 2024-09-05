import { BadRequestException, Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResponse } from '@app/core/interfaces/response.interface';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';

@ApiTags('Guest')
@Controller({
  version: '1',
})
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @ApiOperation({ description: 'Create guest' })
  @ApiBody({ type: CreateGuestDto })
  async createGuest(@Body() dto: CreateGuestDto): Promise<IResponse> {
    try {
      const newGuests = await this.guestService.createGuest(dto);
      return {
        _data: newGuests,
        _metadata: {
          message: 'Guests created successfully.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to create guest.',
      });
    }
  }

  @Get()
  @ApiOperation({ description: 'Fetch all guest' })
  async fetchGuest(): Promise<IResponse> {
    try {
      const guests = await this.guestService.fetchGuest();
      return {
        _data: guests,
        _metadata: {
          message: 'Guests fetched successfully.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch all guest.',
      });
    }
  }
}
