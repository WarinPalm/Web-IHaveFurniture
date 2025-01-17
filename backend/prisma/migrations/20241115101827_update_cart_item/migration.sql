/*
  Warnings:

  - You are about to drop the column `orderedById` on the `cartitem` table. All the data in the column will be lost.
  - Added the required column `userById` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_orderedById_fkey`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `orderedById`,
    ADD COLUMN `userById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_userById_fkey` FOREIGN KEY (`userById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
