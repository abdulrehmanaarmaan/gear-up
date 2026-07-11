/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "gear_items" DROP CONSTRAINT "gear_items_categoryId_fkey";

-- DropTable
DROP TABLE "categories";

-- CreateTable
CREATE TABLE "gear_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gear_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gear_categories_name_key" ON "gear_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "gear_categories_slug_key" ON "gear_categories"("slug");

-- AddForeignKey
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "gear_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
