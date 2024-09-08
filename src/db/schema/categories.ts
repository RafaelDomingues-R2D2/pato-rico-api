import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { reservations } from './reservations'
import { users } from './users'

export const categoryType = pgEnum('category_type', ['INCOME', 'OUTCOME'])

export const categories = pgTable('categories', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: categoryType('type').notNull(),
  goalValue: integer('goal_value').notNull(),

  userId: text('user_id').notNull(),
  reservationId: text('reservation_id'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const categoriesRelations = relations(categories, ({ one }) => ({
  users: one(users, {
    fields: [categories.userId],
    references: [users.id],
    relationName: 'categoriesUser',
  }),

  reservations: one(reservations, {
    fields: [categories.reservationId],
    references: [reservations.id],
    relationName: 'categoriesReservations',
  }),
}))
