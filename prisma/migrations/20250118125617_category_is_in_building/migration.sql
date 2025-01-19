/*
  Warnings:

  - You are about to drop the column `categoryId` on the `node` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `building` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "node" DROP CONSTRAINT "node_categoryId_fkey";

-- AlterTable
ALTER TABLE "building" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "node" DROP COLUMN "categoryId";

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
