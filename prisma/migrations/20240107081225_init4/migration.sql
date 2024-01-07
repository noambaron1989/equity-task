-- DropForeignKey
ALTER TABLE "EquityGrant" DROP CONSTRAINT "EquityGrant_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "EquityGrant" ADD CONSTRAINT "EquityGrant_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
