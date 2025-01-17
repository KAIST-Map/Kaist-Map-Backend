/*
  Warnings:

  - You are about to drop the column `nodeId` on the `building` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "building" DROP CONSTRAINT "building_nodeId_fkey";

-- AlterTable
ALTER TABLE "building" DROP COLUMN "nodeId";

-- CreateTable
CREATE TABLE "building_node" (
    "id" SERIAL NOT NULL,
    "buildingId" INTEGER NOT NULL,
    "nodeId" INTEGER NOT NULL,

    CONSTRAINT "building_node_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "building_node" ADD CONSTRAINT "building_node_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building_node" ADD CONSTRAINT "building_node_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
