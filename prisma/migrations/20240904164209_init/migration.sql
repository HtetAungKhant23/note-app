-- CreateEnum
CREATE TYPE "BOOKING_STATUS" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('M', 'F');

-- CreateTable
CREATE TABLE "guests" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "phone" STRING NOT NULL,
    "gender" "GENDER" NOT NULL DEFAULT 'M',
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookingPeriods" (
    "id" STRING NOT NULL,
    "guestId" STRING NOT NULL,
    "remark" STRING,
    "start_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "period" INT4 NOT NULL DEFAULT 1,
    "seater" INT4 NOT NULL DEFAULT 1,
    "price" INT4 NOT NULL,
    "status" "BOOKING_STATUS" NOT NULL DEFAULT 'UNPAID',
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookingPeriods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guests_phone_key" ON "guests"("phone");

-- AddForeignKey
ALTER TABLE "bookingPeriods" ADD CONSTRAINT "bookingPeriods_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
