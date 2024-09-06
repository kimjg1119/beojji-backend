/*
  Warnings:

  - Added the required column `code` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Made the column `problemId` on table `Submission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_problemId_fkey`;

-- AlterTable
ALTER TABLE `Submission` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `language` VARCHAR(191) NOT NULL,
    MODIFY `problemId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
