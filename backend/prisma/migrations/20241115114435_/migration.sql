-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_prodId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_userById_fkey`;

-- AddForeignKey
ALTER TABLE `Cartitem` ADD CONSTRAINT `Cartitem_prodId_fkey` FOREIGN KEY (`prodId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cartitem` ADD CONSTRAINT `Cartitem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cartitem` ADD CONSTRAINT `Cartitem_userById_fkey` FOREIGN KEY (`userById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
