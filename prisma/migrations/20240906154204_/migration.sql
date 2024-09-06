/*
  Warnings:

  - You are about to drop the `_ClassToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ClassToUser` DROP FOREIGN KEY `_ClassToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ClassToUser` DROP FOREIGN KEY `_ClassToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Problem` ADD COLUMN `classId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Submission` MODIFY `problemId` INTEGER NULL;

-- DropTable
DROP TABLE `_ClassToUser`;

-- CreateTable
CREATE TABLE `_UserClass` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserClass_AB_unique`(`A`, `B`),
    INDEX `_UserClass_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClassProblem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ClassProblem_AB_unique`(`A`, `B`),
    INDEX `_ClassProblem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserClass` ADD CONSTRAINT `_UserClass_A_fkey` FOREIGN KEY (`A`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserClass` ADD CONSTRAINT `_UserClass_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassProblem` ADD CONSTRAINT `_ClassProblem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassProblem` ADD CONSTRAINT `_ClassProblem_B_fkey` FOREIGN KEY (`B`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
