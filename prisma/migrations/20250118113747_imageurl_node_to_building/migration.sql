/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `node` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "building" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "node" DROP COLUMN "imageUrl";
