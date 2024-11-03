/*
  Warnings:

  - A unique constraint covering the columns `[deliveryPartnerProfileId]` on the table `VendorOrders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VendorOrders_deliveryPartnerProfileId_key" ON "VendorOrders"("deliveryPartnerProfileId");
