import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { decimal, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const typesOfExpenses = pgTable('typesOfExpenses', {
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

export const typesOfExpensesRelations = relations(
  typesOfExpenses,
  ({ one }) => ({
    users: one(users, {
      fields: [typesOfExpenses.userId],
      references: [users.id],
      relationName: 'typesOfExpensesUser',
    }),
  }),
)
