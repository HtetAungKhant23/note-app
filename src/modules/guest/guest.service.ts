import { PrismaService } from '@app/shared/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BOOKING_STATUS } from '@prisma/client';
import * as dayjs from 'dayjs';
import { CreateGuestDto } from './dto/create-guest.dto';
import { GuestProfileDto } from './dto/guest-profile.dto';
import { BookingPeriodDto } from './dto/booking.dto';
import { GuestEntity } from './entity/guest.entity';
import { BookingEntity } from './entity/booking.entity';

@Injectable()
export class GuestService {
  constructor(private readonly dbService: PrismaService) {}

  async fetchGuest() {
    const guests = await this.dbService.guest.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        gender: true,
        bookingPeriod: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return guests.map((guest) => {
      return new GuestEntity(
        guest.id,
        guest.name,
        guest.phone,
        guest.gender,
        guest.bookingPeriod[0]?.startDate,
        guest.bookingPeriod[0]?.dueDate,
        0,
        0,
        0,
      );
    });
  }

  async fetchGuestProfileDetail(guestId: string) {
    const guest = await this.findGuest(guestId);
    if (!guest) {
      throw new BadRequestException({
        message: 'Guest not found.',
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }
    const { spendAmount, totalMonth } = guest.bookingPeriod.reduce(
      (totals, booking) => {
        totals.spendAmount += booking.price;
        totals.totalMonth += booking.period;
        return totals;
      },
      { spendAmount: 0, totalMonth: 0 },
    );
    return new GuestEntity(
      guest.id,
      guest.name,
      guest.phone,
      guest.gender,
      guest.bookingPeriod[0]?.startDate,
      guest.bookingPeriod[guest.bookingPeriod.length - 1]?.dueDate,
      0,
      spendAmount,
      totalMonth,
    );
  }

  async fetchGuestBookings(guestId: string) {
    const guest = await this.findGuest(guestId);
    if (!guest) {
      throw new BadRequestException({
        message: 'Guest not found.',
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }
    return guest.bookingPeriod.map((booking) => {
      return new BookingEntity(
        booking.remark || '',
        booking.startDate,
        booking.dueDate,
        booking.period,
        booking.seater,
        booking.price,
        booking.status,
      );
    });
  }

  async guestToExtendInOneWeek() {
    const guests = await this.dbService.guest.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        gender: true,
        bookingPeriod: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    const guestRes = [];
    const today = dayjs().startOf('date');
    for (let i = 0; i < guests.length; i += 1) {
      const guest = guests[i];
      const currentbookingPeriod = guest?.bookingPeriod[0];
      const dayDiff = dayjs(currentbookingPeriod?.dueDate).diff(today, 'day');
      if (dayDiff <= 7) {
        guestRes.push(
          new GuestEntity(
            guest?.id || '',
            guest?.name || '',
            guest?.phone || '',
            guest?.gender || 'M',
            currentbookingPeriod?.startDate,
            currentbookingPeriod?.dueDate,
            dayDiff,
            0,
            0,
          ),
        );
      }
    }
    return guestRes;
  }

  async createGuest(dto: CreateGuestDto) {
    const existGuest = await this.findGuestWithPhone(dto.phone);
    if (existGuest) {
      throw new BadRequestException({
        message: `Guest already exist with this phone number. (${dto.phone})`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
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

  async extendBookingPeriod(id: string, dto: BookingPeriodDto) {
    const guest = await this.findGuest(id);
    if (!guest) {
      throw new BadRequestException({
        message: 'Guest not found.',
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    const startDate = guest.bookingPeriod[guest.bookingPeriod.length - 1]?.dueDate || dayjs().set('hours', 9).toDate();

    return this.dbService.bookingPeriod.create({
      data: {
        guestId: guest.id,
        remark: dto?.remark || '',
        startDate,
        dueDate: dayjs(startDate).add(dto.period, 'months').set('hours', 9).toDate(),
        period: dto.period,
        seater: dto.seater,
        price: dto.price,
        status: BOOKING_STATUS.PAID,
      },
    });
  }

  async updateGuestProfile(id: string, dto: GuestProfileDto) {
    const guest = await this.findGuest(id);
    if (!guest) {
      throw new BadRequestException({
        message: 'Guest not found.',
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    if (dto?.phone && dto?.phone !== guest.phone) {
      const existPhone = await this.findGuestWithPhone(dto.phone);
      if (existPhone) {
        throw new BadRequestException({
          message: 'Cannot update profile: Phone number already exist.',
          code: ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
        });
      }
    }

    return this.dbService.guest.update({
      where: {
        id: guest.id,
      },
      data: {
        name: dto?.name,
        phone: dto?.phone,
        gender: dto?.gender,
      },
    });
  }

  async deleteGuest(id: string): Promise<void> {
    const guest = await this.findGuest(id);
    if (!guest) {
      throw new BadRequestException({
        message: 'Guest not found.',
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }
    await this.dbService.guest.update({
      where: {
        id: guest.id,
      },
      data: {
        isDeleted: true,
        phone: `deleted-${guest.phone}`,
      },
    });
  }

  private async findGuest(id: string) {
    return this.dbService.guest.findUnique({
      where: { id, isDeleted: false },
      include: {
        bookingPeriod: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  private async findGuestWithPhone(phone: string) {
    return this.dbService.guest.findUnique({ where: { phone, isDeleted: false } });
  }
}
