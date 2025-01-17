/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `stock` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`;
