import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResponse } from '@app/core/interfaces/response.interface';
import { GuestService } from './guest.service';

@ApiTags('Guest')
@Controller({
  version: '1',
})
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get()
  @ApiOperation({ description: 'Fetch all guest' })
  async fetchGuest(): Promise<IResponse> {
    const guests = await this.guestService.fetchGuest();
    return {
      _data: guests,
      _metadata: {
        message: 'Guests fetched successfully.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
