import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { typeOfExpenses } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createTypeOfExpense(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/types-of-transactions',
      {
        schema: {
          body: z.object({
            name: z.string(),
            description: z.string(),
            goalValue: z.number(),
          }),
        },
      },
      async (request, reply) => {
        const { name, description, goalValue } = request.body

        const userId = await request.getCurrentUserId()

        const typeOfExpense = await db
          .insert(typeOfExpenses)
          .values({
            name,
            description: description ?? '',
            goalValue: String(goalValue),
            userId,
          })
          .returning()

        return reply.status(201).send({
          typeOfExpense,
        })
      },
    )
}
