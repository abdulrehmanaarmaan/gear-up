/*
  Warnings:

  - The values [EXPIRED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currentPeriodEnd` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rentalOrderId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentIntentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BANK', 'MOBILE_BANKING');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
ALTER TABLE "public"."payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_customerId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_rentalOrderId_fkey";

-- DropIndex
DROP INDEX "payments_customerId_key";

-- DropIndex
DROP INDEX "payments_stripeCustomerId_key";

-- DropIndex
DROP INDEX "payments_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'BDT',
ADD COLUMN     "method" "PaymentMethod",
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "provider" "PaymentProvider" NOT NULL,
ALTER COLUMN "stripeCustomerId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_rentalOrderId_key" ON "payments"("rentalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentIntentId_key" ON "payments"("paymentIntentId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "rental_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
