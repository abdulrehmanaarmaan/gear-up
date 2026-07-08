/*
  Warnings:

  - The `provider` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[transactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `rental_orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rentalOrderId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `rental_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_rentalOrderId_fkey";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "method" SET DEFAULT 'CARD',
DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT DEFAULT 'STRIPE';

-- AlterTable
ALTER TABLE "rental_orders" ADD COLUMN     "paymentId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PaymentProvider";

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "rental_orders_paymentId_key" ON "rental_orders"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_rentalOrderId_key" ON "reviews"("rentalOrderId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "rental_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
