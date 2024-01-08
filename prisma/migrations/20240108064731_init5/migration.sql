/*
  Warnings:

  - Added the required column `vestingPeriod` to the `EquityGrant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EquityGrant" ADD COLUMN     "vestingPeriod" INTEGER NOT NULL;
