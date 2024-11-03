/*
  Warnings:

  - A unique constraint covering the columns `[vendorMenuId]` on the table `VendorProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userCartId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userOrdersId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bussinessAddress` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bussinessName` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VendorOrderStatus" AS ENUM ('Cooking', 'Accepted', 'Finished', 'Cancelled', 'Returned');

-- CreateEnum
CREATE TYPE "OrderPaymentType" AS ENUM ('Prepaid', 'Cash');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DeliveryPartner';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "deliveryPartnerProfileId" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "userCartId" TEXT NOT NULL,
ADD COLUMN     "userOrdersId" TEXT NOT NULL,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "VendorProfile" ADD COLUMN     "activeStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bussinessAddress" TEXT NOT NULL,
ADD COLUMN     "bussinessName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vendorMenuId" TEXT;

-- CreateTable
CREATE TABLE "DeliveryPartnerProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "activeStatus" BOOLEAN NOT NULL DEFAULT false,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "approvedStatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryPartnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrders" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCart" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorMenu" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DishCategory" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorMenuId" TEXT,

    CONSTRAINT "DishCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorDish" (
    "id" TEXT NOT NULL,
    "dishCategoryId" TEXT NOT NULL,
    "dishName" TEXT NOT NULL,
    "dishPrice" TEXT NOT NULL,
    "dishRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dishImage" TEXT,
    "dishDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorOrders" (
    "id" TEXT NOT NULL,
    "vendorProfileId" TEXT NOT NULL,
    "orderStatus" "VendorOrderStatus" NOT NULL,
    "deliveryPartnerProfileId" TEXT NOT NULL,
    "orderPaymentType" "OrderPaymentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorOrders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPartnerProfile_profileId_key" ON "DeliveryPartnerProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProfile_vendorMenuId_key" ON "VendorProfile"("vendorMenuId");

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_vendorMenuId_fkey" FOREIGN KEY ("vendorMenuId") REFERENCES "VendorMenu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPartnerProfile" ADD CONSTRAINT "DeliveryPartnerProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrders" ADD CONSTRAINT "UserOrders_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishCategory" ADD CONSTRAINT "DishCategory_vendorMenuId_fkey" FOREIGN KEY ("vendorMenuId") REFERENCES "VendorMenu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorDish" ADD CONSTRAINT "VendorDish_dishCategoryId_fkey" FOREIGN KEY ("dishCategoryId") REFERENCES "DishCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrders" ADD CONSTRAINT "VendorOrders_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "VendorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrders" ADD CONSTRAINT "VendorOrders_deliveryPartnerProfileId_fkey" FOREIGN KEY ("deliveryPartnerProfileId") REFERENCES "DeliveryPartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
