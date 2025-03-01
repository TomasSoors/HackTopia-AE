-- CreateTable
CREATE TABLE `Consultation` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diagnosis` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
