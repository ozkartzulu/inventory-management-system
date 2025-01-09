-- AlterTable
ALTER TABLE `invoiceorder` ADD COLUMN `state` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `invoicesales` ADD COLUMN `state` BOOLEAN NOT NULL DEFAULT true;
