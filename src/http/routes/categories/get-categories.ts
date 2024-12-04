import { and, eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { categories, reservations } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/categories',
      {
        schema: {
          querystring: z.object({
            type: z.enum(['INCOME', 'OUTCOME']).optional(),
          }),
        },
      },
      async (request) => {
        const { type } = request.query

        const userId = await request.getCurrentUserId()

        const result = await db
          .select({
            id: categories.id,
            name: categories.name,
            description: categories.description,
            type: categories.type,
            goalValue: categories.goalValue,
            reservationName: reservations.name,
          })
          .from(categories)
          .leftJoin(reservations, eq(reservations.id, categories.reservationId))
          .where(
            and(
              type ? eq(categories.type, type) : undefined,
              eq(categories.userId, userId),
            ),
          )
          .orderBy(categories.name)

        return { categories: result }
      },
    )
}
