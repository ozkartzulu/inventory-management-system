/*
  Warnings:

  - You are about to drop the column `stock` on the `inventary` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `supplierdetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productsBought` to the `Inventary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productsSold` to the `Inventary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchases` to the `Inventary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sales` to the `Inventary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceOrderId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `supplierdetail` DROP FOREIGN KEY `SupplierDetail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `supplierdetail` DROP FOREIGN KEY `SupplierDetail_supplierId_fkey`;

-- DropForeignKey
ALTER TABLE `supplierdetail` DROP FOREIGN KEY `SupplierDetail_userId_fkey`;

-- AlterTable
ALTER TABLE `inventary` DROP COLUMN `stock`,
    ADD COLUMN `productsBought` INTEGER NOT NULL,
    ADD COLUMN `productsSold` INTEGER NOT NULL,
    ADD COLUMN `purchases` DOUBLE NOT NULL,
    ADD COLUMN `sales` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `customerId`,
    DROP COLUMN `userId`,
    ADD COLUMN `invoiceOrderId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `supplierdetail`;

-- CreateTable
CREATE TABLE `InvoiceOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total` DOUBLE NOT NULL,
    `debt` DOUBLE NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailSales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `productId` INTEGER NOT NULL,
    `invoiceSalesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceSales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total` DOUBLE NOT NULL,
    `debt` DOUBLE NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `supplierId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_invoiceOrderId_fkey` FOREIGN KEY (`invoiceOrderId`) REFERENCES `InvoiceOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceOrder` ADD CONSTRAINT `InvoiceOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceOrder` ADD CONSTRAINT `InvoiceOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailSales` ADD CONSTRAINT `DetailSales_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailSales` ADD CONSTRAINT `DetailSales_invoiceSalesId_fkey` FOREIGN KEY (`invoiceSalesId`) REFERENCES `InvoiceSales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceSales` ADD CONSTRAINT `InvoiceSales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceSales` ADD CONSTRAINT `InvoiceSales_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
