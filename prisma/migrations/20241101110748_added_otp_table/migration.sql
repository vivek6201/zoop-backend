/*
  Warnings:

  - Added the required column `userEmail` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "userEmail" TEXT NOT NULL;
