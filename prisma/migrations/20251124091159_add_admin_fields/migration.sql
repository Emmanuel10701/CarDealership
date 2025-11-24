-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_listings` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `carName` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `carType` VARCHAR(191) NOT NULL,
    `mileage` INTEGER NOT NULL,
    `transmission` VARCHAR(191) NOT NULL,
    `fuelType` VARCHAR(191) NOT NULL,
    `features` JSON NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `sellerName` VARCHAR(191) NOT NULL,
    `sellerPhone` VARCHAR(191) NOT NULL,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NULL,
    `files` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `car_listings_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `carName` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `carType` VARCHAR(191) NOT NULL,
    `mileage` INTEGER NOT NULL,
    `transmission` VARCHAR(191) NOT NULL,
    `fuelType` VARCHAR(191) NOT NULL,
    `engineSize` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `doors` INTEGER NULL,
    `seats` INTEGER NULL,
    `features` JSON NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `carCondition` VARCHAR(191) NULL DEFAULT 'excellent',
    `serviceHistory` VARCHAR(191) NULL DEFAULT 'full',
    `accidentHistory` VARCHAR(191) NULL DEFAULT 'none',
    `ownershipHistory` VARCHAR(191) NULL,
    `roadTaxStatus` VARCHAR(191) NULL DEFAULT 'current',
    `insuranceStatus` VARCHAR(191) NULL DEFAULT 'comprehensive',
    `sellerName` VARCHAR(191) NOT NULL,
    `sellerPhone` VARCHAR(191) NOT NULL,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `preferredContact` VARCHAR(191) NULL DEFAULT 'phone',
    `priceNegotiable` BOOLEAN NULL DEFAULT true,
    `testDrive` BOOLEAN NULL DEFAULT true,
    `warranty` BOOLEAN NULL DEFAULT false,
    `warrantyMonths` INTEGER NULL,
    `serviceRecords` BOOLEAN NULL DEFAULT true,
    `originalPaint` BOOLEAN NULL DEFAULT true,
    `modifications` VARCHAR(191) NULL DEFAULT 'none',
    `file` VARCHAR(191) NULL,
    `files` JSON NOT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'pending',
    `adminNotes` VARCHAR(191) NULL DEFAULT '',
    `rejectionReason` VARCHAR(191) NULL DEFAULT '',
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `car_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribers` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `subscribers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
