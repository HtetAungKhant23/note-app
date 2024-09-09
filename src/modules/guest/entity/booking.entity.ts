import { BOOKING_STATUS } from '@prisma/client';

export class BookingEntity {
  remark: string;

  startDate: Date;

  dueDate: Date;

  period: number;

  seater: number;

  price: number;

  status: BOOKING_STATUS;

  constructor(remark: string, startDate: Date, dueDate: Date, period: number, seater: number, price: number, status: BOOKING_STATUS) {
    this.remark = remark;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.period = period;
    this.seater = seater;
    this.price = price;
    this.status = status;
  }
}
