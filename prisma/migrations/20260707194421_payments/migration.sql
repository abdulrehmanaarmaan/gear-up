/*
  Warnings:

  - You are about to drop the column `amount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentIntentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - Added the required column `currentPeriodEnd` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Made the column `stripeCustomerId` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeSubscriptionId` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "payments_transactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount",
DROP COLUMN "currency",
DROP COLUMN "method",
DROP COLUMN "paidAt",
DROP COLUMN "paymentIntentId",
DROP COLUMN "provider",
DROP COLUMN "transactionId",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "stripeCustomerId" SET NOT NULL,
ALTER COLUMN "stripeSubscriptionId" SET NOT NULL;
