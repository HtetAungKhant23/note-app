import { PrismaService } from '@app/shared/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BOOKING_STATUS } from '@prisma/client';
import * as dayjs from 'dayjs';
import { CreateGuestDto } from './dto/create-guest.dto';

@Injectable()
export class GuestService {
  constructor(private readonly dbService: PrismaService) {}

  async fetchGuest() {
    return this.dbService.guest.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        bookingPeriod: true,
      },
    });
  }

  async createGuest(dto: CreateGuestDto) {
    const existGuest = await this.dbService.guest.findUnique({
      where: {
        phone: dto.phone,
        isDeleted: false,
      },
    });
    if (existGuest) {
      throw new BadRequestException({
        message: 'Department not found.',
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    return this.dbService.guest.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        gender: dto.gender,
        bookingPeriod: {
          create: {
            remark: dto?.booking?.remark || '',
            startDate: dayjs(dto.booking.startDate).set('hours', 9).toDate(),
            dueDate: dayjs(dto.booking.startDate).add(dto.booking.period, 'months').set('hours', 9).toDate(),
            period: dto.booking.period,
            seater: dto.booking.seater,
            price: dto.booking.price,
            status: BOOKING_STATUS.PAID,
          },
        },
      },
    });
  }
}
