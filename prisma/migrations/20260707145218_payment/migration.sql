/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_customerId_key" ON "payments"("customerId");
