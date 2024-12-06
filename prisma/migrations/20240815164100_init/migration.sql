/*
  Warnings:

  - You are about to drop the column `categoryId` on the `madein` table. All the data in the column will be lost.
  - Added the required column `madeinId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `madein` DROP FOREIGN KEY `Madein_categoryId_fkey`;

-- AlterTable
ALTER TABLE `madein` DROP COLUMN `categoryId`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `madeinId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_madeinId_fkey` FOREIGN KEY (`madeinId`) REFERENCES `Madein`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
