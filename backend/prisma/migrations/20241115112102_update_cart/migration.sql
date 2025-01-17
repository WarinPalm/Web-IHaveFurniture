/*
  Warnings:

  - You are about to drop the column `orderById` on the `order` table. All the data in the column will be lost.
  - Added the required column `userById` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_orderById_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `orderById`,
    ADD COLUMN `userById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userById_fkey` FOREIGN KEY (`userById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
