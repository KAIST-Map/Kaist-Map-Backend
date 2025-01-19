/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `building` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "building" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[];
