-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'EXPIRED';

-- DropForeignKey
ALTER TABLE "gear_items" DROP CONSTRAINT "gear_items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "gear_items" DROP CONSTRAINT "gear_items_providerId_fkey";

-- AlterTable
ALTER TABLE "gear_items" ALTER COLUMN "condition" SET DEFAULT 'EXCELLENT';

-- DropEnum
DROP TYPE "PaymentMethod";

-- AddForeignKey
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
