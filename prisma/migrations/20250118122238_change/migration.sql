/*
  Warnings:

  - You are about to drop the `building_node` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "building_node" DROP CONSTRAINT "building_node_buildingId_fkey";

-- DropForeignKey
ALTER TABLE "building_node" DROP CONSTRAINT "building_node_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "building_node" DROP CONSTRAINT "building_node_nodeId_fkey";

-- AlterTable
ALTER TABLE "node" ADD COLUMN     "buildingId" INTEGER,
ADD COLUMN     "categoryId" INTEGER;

-- DropTable
DROP TABLE "building_node";

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
