/*
  Warnings:

  - You are about to drop the column `categoryId` on the `building` table. All the data in the column will be lost.
  - The `imageUrl` column on the `building` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "building" DROP CONSTRAINT "building_categoryId_fkey";

-- AlterTable
ALTER TABLE "building" DROP COLUMN "categoryId",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- CreateTable
CREATE TABLE "building_category" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "buildingId" INTEGER NOT NULL,

    CONSTRAINT "building_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "building_category" ADD CONSTRAINT "building_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building_category" ADD CONSTRAINT "building_category_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
