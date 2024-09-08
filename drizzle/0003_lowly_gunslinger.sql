ALTER TABLE "typesOfExpenses" RENAME TO "reservations";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "type_of_expense_id" TO "reservation_id";