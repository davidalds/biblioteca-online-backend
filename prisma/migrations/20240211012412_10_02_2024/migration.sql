/*
  Warnings:

  - The values [EM_DIA] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('ABERTO', 'ATRASO', 'FECHADO');
ALTER TABLE "Loan" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Loan" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
ALTER TABLE "Loan" ALTER COLUMN "status" SET DEFAULT 'ABERTO';
COMMIT;

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "status" SET DEFAULT 'ABERTO';
