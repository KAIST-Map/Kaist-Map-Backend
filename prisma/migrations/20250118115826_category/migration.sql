/*
  Warnings:

  - Added the required column `categoryId` to the `building_node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "building_node" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "building_node" ADD CONSTRAINT "building_node_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
