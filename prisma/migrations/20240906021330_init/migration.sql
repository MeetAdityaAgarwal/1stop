-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedAddress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `receiverName` VARCHAR(191) NULL,
    `addressNickname` VARCHAR(191) NULL,
    `receiverPhone` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `zipCode` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,

    INDEX `SavedAddress_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `password` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `stripeSubscriptionId` VARCHAR(191) NULL,
    `stripeSubscriptionStatus` ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid') NULL DEFAULT 'incomplete',

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_id_idx`(`id`),
    INDEX `User_stripeCustomerId_idx`(`stripeCustomerId`),
    INDEX `User_stripeSubscriptionId_idx`(`stripeSubscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `category` ENUM('ACCESSORIES', 'PIPES', 'SWITCHES', 'WIRES', 'LIGHTING') NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    `shippingAddressId` VARCHAR(191) NULL,

    INDEX `Order_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PENDING',

    INDEX `OrderItem_orderId_idx`(`orderId`),
    INDEX `OrderItem_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RazorpayOrder` (
    `id` VARCHAR(191) NOT NULL,
    `razorpayId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `status` ENUM('CREATED', 'FAILED', 'PAID') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RazorpayOrder_razorpayId_key`(`razorpayId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RazorpayPayment` (
    `id` VARCHAR(191) NOT NULL,
    `razorpayId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `status` ENUM('SUCCESS', 'PENDING', 'FAILED') NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RazorpayPayment_razorpayId_key`(`razorpayId`),
    UNIQUE INDEX `RazorpayPayment_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StripeEvent` (
    `id` VARCHAR(191) NOT NULL,
    `api_version` VARCHAR(191) NULL,
    `data` JSON NOT NULL,
    `request` JSON NULL,
    `type` VARCHAR(191) NOT NULL,
    `object` VARCHAR(191) NOT NULL,
    `acount` VARCHAR(191) NULL,
    `livemode` BOOLEAN NOT NULL,
    `pending_webhooks` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StripeCustomer` (
    `id` VARCHAR(191) NOT NULL,
    `object` VARCHAR(191) NOT NULL,
    `address` JSON NULL,
    `balance` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `default_source` VARCHAR(191) NULL,
    `delinquent` BOOLEAN NOT NULL,
    `description` VARCHAR(191) NULL,
    `discount` JSON NULL,
    `email` VARCHAR(191) NULL,
    `invoice_prefix` VARCHAR(191) NOT NULL,
    `invoice_settings` JSON NULL,
    `livemode` BOOLEAN NOT NULL,
    `metadata` JSON NULL,
    `name` VARCHAR(191) NULL,
    `next_invoice_sequence` INTEGER NOT NULL,
    `phone` VARCHAR(191) NULL,
    `preferred_locales` JSON NULL,
    `shipping` JSON NULL,
    `tax_exempt` VARCHAR(191) NOT NULL,
    `test_clock` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StripeSubscription` (
    `id` VARCHAR(191) NOT NULL,
    `object` VARCHAR(191) NOT NULL,
    `application` VARCHAR(191) NULL,
    `application_fee_percent` INTEGER NULL,
    `automatic_tax` JSON NULL,
    `billing_cycle_anchor` INTEGER NOT NULL,
    `billing_thresholds` JSON NULL,
    `cancel_at` DATETIME(3) NULL,
    `cancel_at_period_end` BOOLEAN NOT NULL,
    `canceled_at` DATETIME(3) NULL,
    `collection_method` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `current_period_end` INTEGER NOT NULL,
    `current_period_start` INTEGER NOT NULL,
    `customer` VARCHAR(191) NOT NULL,
    `days_until_due` INTEGER NULL,
    `default_payment_method` VARCHAR(191) NULL,
    `default_source` VARCHAR(191) NULL,
    `default_tax_rates` JSON NULL,
    `description` VARCHAR(191) NULL,
    `discount` JSON NULL,
    `ended_at` DATETIME(3) NULL,
    `items` JSON NOT NULL,
    `latest_invoice` VARCHAR(191) NULL,
    `livemode` BOOLEAN NOT NULL,
    `metadata` JSON NOT NULL,
    `next_pending_invoice_item_invoice` VARCHAR(191) NULL,
    `on_behalf_of` VARCHAR(191) NULL,
    `pause_collection` JSON NULL,
    `payment_settings` JSON NOT NULL,
    `pending_invoice_item_interval` JSON NULL,
    `pending_setup_intent` VARCHAR(191) NULL,
    `pending_update` JSON NULL,
    `schedule` VARCHAR(191) NULL,
    `start_date` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `test_clock` JSON NULL,
    `transfer_data` JSON NULL,
    `trial_end` DATETIME(3) NULL,
    `trial_start` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
