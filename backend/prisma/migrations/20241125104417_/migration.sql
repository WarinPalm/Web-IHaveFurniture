-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `Cartitem_prodId_fkey`;

-- AddForeignKey
ALTER TABLE `Cartitem` ADD CONSTRAINT `Cartitem_prodId_fkey` FOREIGN KEY (`prodId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
