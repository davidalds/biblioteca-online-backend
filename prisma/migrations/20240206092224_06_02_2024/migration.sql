-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('EMPRESTADO', 'DISPONIVEL');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'DISPONIVEL';
