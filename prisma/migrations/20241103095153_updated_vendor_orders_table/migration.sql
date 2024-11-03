/*
  Warnings:

  - Added the required column `orderDetail` to the `VendorOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VendorOrders" ADD COLUMN     "orderDetail" JSONB NOT NULL;
