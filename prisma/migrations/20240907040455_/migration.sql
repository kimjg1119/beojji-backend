/*
  Warnings:

  - You are about to drop the column `problemId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `_ClassProblem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classProblemId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_problemId_fkey`;

-- DropForeignKey
ALTER TABLE `_ClassProblem` DROP FOREIGN KEY `_ClassProblem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ClassProblem` DROP FOREIGN KEY `_ClassProblem_B_fkey`;

-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `problemId`,
    ADD COLUMN `classProblemId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_ClassProblem`;

-- CreateTable
CREATE TABLE `ClassProblem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `problemId` INTEGER NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClassProblem_classId_problemId_key`(`classId`, `problemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Submission_userId_classProblemId_idx` ON `Submission`(`userId`, `classProblemId`);

-- AddForeignKey
ALTER TABLE `ClassProblem` ADD CONSTRAINT `ClassProblem_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassProblem` ADD CONSTRAINT `ClassProblem_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_classProblemId_fkey` FOREIGN KEY (`classProblemId`) REFERENCES `ClassProblem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
