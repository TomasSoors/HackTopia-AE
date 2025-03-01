-- CreateTable
CREATE TABLE `Person` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `heartRate` INTEGER NOT NULL,
    `bloodPressure` VARCHAR(191) NOT NULL,
    `breathRate` INTEGER NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `bloodType` VARCHAR(191) NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `height` DOUBLE NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `isMedicalPractitioner` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Person_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disease` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `symptoms` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `infectious` BOOLEAN NOT NULL,
    `isAcute` BOOLEAN NOT NULL,
    `duration` INTEGER NOT NULL,
    `incubationPeriod` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonDisease` (
    `personId` VARCHAR(191) NOT NULL,
    `diseaseId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`personId`, `diseaseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonDisease` ADD CONSTRAINT `PersonDisease_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonDisease` ADD CONSTRAINT `PersonDisease_diseaseId_fkey` FOREIGN KEY (`diseaseId`) REFERENCES `Disease`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
