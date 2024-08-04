ALTER TABLE "typeOfExpenses" RENAME TO "typesOfExpenses";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "payment_form" DROP NOT NULL;