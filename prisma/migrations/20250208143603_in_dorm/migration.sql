-- CreateEnum
CREATE TYPE "Dormitory" AS ENUM ('MALE', 'FEMALE', 'NOT_DORMITORY');

-- AlterTable
ALTER TABLE "edge" ADD COLUMN     "inDormitory" "Dormitory" NOT NULL DEFAULT 'NOT_DORMITORY';
