import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  date,
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { categories } from './categories'
import { typesOfExpenses } from './typesOfExpenses'
import { users } from './users'

export const transactionTypeEnum = pgEnum('transaction_type', [
  'INCOME',
  'OUTCOME',
])

export const paymentFormEnum = pgEnum('transaction_payment_form', [
  'CREDIT',
  'MONEY',
  'DEBIT',
  'PIX',
])

export const transactions = pgTable('transactions', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  date: date('date').notNull(),
  value: decimal('value').notNull(),
  type: transactionTypeEnum('type').notNull(),
  paymentForm: paymentFormEnum('payment_form'),

  userId: text('user_id').notNull(),
  categoryId: text('category_id').notNull(),
  typeOfExpenseId: text('type_of_expense_id').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
    relationName: 'transactionCategory',
  }),
  typeOfexpenses: one(typesOfExpenses, {
    fields: [transactions.typeOfExpenseId],
    references: [typesOfExpenses.id],
    relationName: 'transactionTypeOfExpense',
  }),
  users: one(users, {
    fields: [transactions.userId],
    references: [users.id],
    relationName: 'transactionUser',
  }),
}))
