import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { decimal, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const typeOfExpenses = pgTable('typeOfExpenses', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  goalValue: decimal('goal_value').notNull(),

  userId: text('user_id').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const typeOfExpensesRelations = relations(typeOfExpenses, ({ one }) => ({
  users: one(users, {
    fields: [typeOfExpenses.userId],
    references: [users.id],
    relationName: 'typeOfExpensesUser',
  }),
}))
