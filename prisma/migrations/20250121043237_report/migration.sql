/*
  Warnings:

  - You are about to drop the `reported_road` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "reported_road";

-- CreateTable
CREATE TABLE "report" (
    "id" SERIAL NOT NULL,
    "imageUrls" TEXT[],
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "reportStatus" "ReportStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);
