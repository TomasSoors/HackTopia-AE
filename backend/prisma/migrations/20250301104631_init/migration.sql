/*
  Warnings:

  - You are about to drop the column `createdAt` on the `disease` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `disease` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `disease` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `person` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
