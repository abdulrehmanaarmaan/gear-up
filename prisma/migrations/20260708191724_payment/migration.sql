/*
  Warnings:

  - You are about to drop the column `paymentId` on the `rental_orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "rental_orders_paymentId_key";

-- AlterTable
ALTER TABLE "rental_orders" DROP COLUMN "paymentId";
