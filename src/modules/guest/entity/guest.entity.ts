import { GENDER } from '@prisma/client';

export class GuestEntity {
  id: string;

  name: string;

  phone: string;

  gender: GENDER;

  stratDate: Date | undefined;

  endDate: Date | undefined;

  constructor(id: string, name: string, phone: string, gender: GENDER, startDate: Date | undefined, endDate: Date | undefined) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.gender = gender;
    this.stratDate = startDate;
    this.endDate = endDate;
  }
}
