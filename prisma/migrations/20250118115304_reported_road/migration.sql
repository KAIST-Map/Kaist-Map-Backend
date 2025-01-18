/*
  Warnings:

  - Added the required column `importance` to the `building` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "building" ADD COLUMN     "importance" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "reported_road" (
    "id" SERIAL NOT NULL,
    "latitude1" DOUBLE PRECISION NOT NULL,
    "longitude1" DOUBLE PRECISION NOT NULL,
    "latitude2" DOUBLE PRECISION NOT NULL,
    "longitude2" DOUBLE PRECISION NOT NULL,
    "imageUrls" TEXT[],
    "description" TEXT,
    "reportStatus" "ReportStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "reported_road_pkey" PRIMARY KEY ("id")
);
