-- AlterTable
ALTER TABLE "Alarm" ADD COLUMN     "alarmType" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "targetId" INTEGER;
