/*
  Warnings:

  - You are about to drop the column `name` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residency` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exerciseDate` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grantDate` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grantType` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sharePrice` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalNumberOfShares` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalNumberOfVestedShares` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Residency" AS ENUM ('US', 'IL', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN');

-- CreateEnum
CREATE TYPE "GrantType" AS ENUM ('ISO', 'NSO');

-- CreateEnum
CREATE TYPE "FundingType" AS ENUM ('SEED', 'PRIVATE_EQUITY', 'M_N_A', 'LATE_STAGE_VENTURE', 'IPO', 'EARLY_STAGE_VENTURE');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "residency" "Residency" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EquityGrant" ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD COLUMN     "exerciseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "grantDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "grantType" "GrantType" NOT NULL,
ADD COLUMN     "sharePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalNumberOfShares" INTEGER NOT NULL,
ADD COLUMN     "totalNumberOfVestedShares" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latestFMVPrice" DOUBLE PRECISION NOT NULL,
    "lastFundingType" "FundingType" NOT NULL,
    "lastFundingDate" TIMESTAMP(3) NOT NULL,
    "lastFundingAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EquityGrant" ADD CONSTRAINT "EquityGrant_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquityGrant" ADD CONSTRAINT "EquityGrant_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
