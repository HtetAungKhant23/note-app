import { GENDER } from '@prisma/client';

export class GuestEntity {
  id: string;

  name: string;

  phone: string;

  gender: GENDER;

  stratDate: Date | undefined;

  dueDate: Date | undefined;

  day: number;

  constructor(
    id: string,
    name: string,
    phone: string,
    gender: GENDER,
    startDate: Date | undefined,
    dueDate: Date | undefined,
    day: number,
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.gender = gender;
    this.stratDate = startDate;
    this.dueDate = dueDate;
    this.day = day;
  }
}
