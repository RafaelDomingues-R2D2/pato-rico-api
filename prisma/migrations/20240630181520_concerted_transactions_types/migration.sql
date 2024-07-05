/*
  Warnings:

  - Added the required column `paymentForm` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionTypeEnum" AS ENUM ('INCOME', 'OUTCOME');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "paymentForm" "PaymentFormEnum" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionTypeEnum" NOT NULL;
