import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const reservations = pgTable('reservations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  goalValue: integer('goal_value').notNull(),

  userId: text('user_id').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const reservationsRelations = relations(reservations, ({ one }) => ({
  users: one(users, {
    fields: [reservations.userId],
    references: [users.id],
    relationName: 'reservationsUser',
  }),
}))
