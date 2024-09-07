/*
  Warnings:

  - Added the required column `link` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Class` ADD COLUMN `link` VARCHAR(191) NOT NULL,
    ADD COLUMN `term` VARCHAR(191) NOT NULL;
