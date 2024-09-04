import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GuestService {
  constructor(private readonly dbService: PrismaService) {}

  async fetchGuest() {
    return this.dbService.guest.findMany({
      where: {
        isDeleted: false,
      },
    });
  }
}
