-- DropForeignKey
ALTER TABLE `brand` DROP FOREIGN KEY `Brand_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `detailsales` DROP FOREIGN KEY `DetailSales_invoiceSalesId_fkey`;

-- DropForeignKey
ALTER TABLE `detailsales` DROP FOREIGN KEY `DetailSales_productId_fkey`;

-- DropForeignKey
ALTER TABLE `inventary` DROP FOREIGN KEY `Inventary_productId_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceorder` DROP FOREIGN KEY `InvoiceOrder_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceorder` DROP FOREIGN KEY `InvoiceOrder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicesales` DROP FOREIGN KEY `InvoiceSales_supplierId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicesales` DROP FOREIGN KEY `InvoiceSales_userId_fkey`;

-- DropForeignKey
ALTER TABLE `model` DROP FOREIGN KEY `Model_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_invoiceOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_brandId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_madeinId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_modelId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `variant` DROP FOREIGN KEY `Variant_categoryId_fkey`;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `dateService` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `debt` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `state` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `brand` ADD CONSTRAINT `Brand_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailsales` ADD CONSTRAINT `DetailSales_invoiceSalesId_fkey` FOREIGN KEY (`invoiceSalesId`) REFERENCES `invoicesales`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailsales` ADD CONSTRAINT `DetailSales_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventary` ADD CONSTRAINT `Inventary_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoiceorder` ADD CONSTRAINT `InvoiceOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoiceorder` ADD CONSTRAINT `InvoiceOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoicesales` ADD CONSTRAINT `InvoiceSales_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoicesales` ADD CONSTRAINT `InvoiceSales_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `model` ADD CONSTRAINT `Model_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_invoiceOrderId_fkey` FOREIGN KEY (`invoiceOrderId`) REFERENCES `invoiceorder`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_madeinId_fkey` FOREIGN KEY (`madeinId`) REFERENCES `madein`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `model`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `variant`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variant` ADD CONSTRAINT `Variant_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
