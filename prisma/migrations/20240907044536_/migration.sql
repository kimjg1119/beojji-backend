/*
  Warnings:

  - Added the required column `link` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Problem` ADD COLUMN `link` VARCHAR(191) NOT NULL;
