import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { categories } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

enum CategoryType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

export async function createCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/categories',
      {
        schema: {
          body: z.object({
            name: z.string(),
            description: z.string(),
            type: z.nativeEnum(CategoryType),
            goalValue: z.number(),
          }),
        },
      },
      async (request, reply) => {
        const { name, description, type, goalValue } = request.body

        const userId = await request.getCurrentUserId()

        const category = await db
          .insert(categories)
          .values({
            name,
            description: description ?? '',
            type,
            goalValue: String(goalValue),
            userId,
          })
          .returning()

        return reply.status(201).send({
          category,
        })
      },
    )
}
