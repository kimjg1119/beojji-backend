/*
  Warnings:

  - Added the required column `courseId` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Class` ADD COLUMN `courseId` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
