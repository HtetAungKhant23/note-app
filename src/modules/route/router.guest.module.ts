import { Module } from '@nestjs/common';
import { GuestController } from '../guest/guest.controller';
import { GuestService } from '../guest/guest.service';

@Module({
  controllers: [GuestController],
  providers: [GuestService],
  exports: [],
})
export class RoutesGuestModule {}
