/*
  Warnings:

  - You are about to drop the column `vendorMenuId` on the `VendorProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorProfileId]` on the table `VendorMenu` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AdminProfile" DROP CONSTRAINT "AdminProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryPartnerProfile" DROP CONSTRAINT "DeliveryPartnerProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "DishCategory" DROP CONSTRAINT "DishCategory_vendorMenuId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCart" DROP CONSTRAINT "UserCart_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrders" DROP CONSTRAINT "UserOrders_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "VendorDish" DROP CONSTRAINT "VendorDish_vendorMenuId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_vendorMenuId_fkey";

-- DropIndex
DROP INDEX "VendorProfile_vendorMenuId_key";

-- AlterTable
ALTER TABLE "VendorMenu" ADD COLUMN     "vendorProfileId" TEXT;

-- AlterTable
ALTER TABLE "VendorProfile" DROP COLUMN "vendorMenuId";

-- CreateIndex
CREATE UNIQUE INDEX "VendorMenu_vendorProfileId_key" ON "VendorMenu"("vendorProfileId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPartnerProfile" ADD CONSTRAINT "DeliveryPartnerProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrders" ADD CONSTRAINT "UserOrders_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorMenu" ADD CONSTRAINT "VendorMenu_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishCategory" ADD CONSTRAINT "DishCategory_vendorMenuId_fkey" FOREIGN KEY ("vendorMenuId") REFERENCES "VendorMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorDish" ADD CONSTRAINT "VendorDish_vendorMenuId_fkey" FOREIGN KEY ("vendorMenuId") REFERENCES "VendorMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
