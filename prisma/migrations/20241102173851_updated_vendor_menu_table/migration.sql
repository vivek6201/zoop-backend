-- AlterTable
ALTER TABLE "VendorDish" ADD COLUMN     "vendorMenuId" TEXT;

-- AddForeignKey
ALTER TABLE "VendorDish" ADD CONSTRAINT "VendorDish_vendorMenuId_fkey" FOREIGN KEY ("vendorMenuId") REFERENCES "VendorMenu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
