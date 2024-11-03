/*
  Warnings:

  - A unique constraint covering the columns `[vendorProfileId]` on the table `VendorOrders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VendorOrders_vendorProfileId_key" ON "VendorOrders"("vendorProfileId");
