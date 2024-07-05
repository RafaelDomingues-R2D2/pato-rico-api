import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function createTypeOfExpense(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/typesOfExpenses',
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

        const typeOfExpense = await prisma.typeOfExpense.create({
          data: {
            name,
            description,
            goalValue,
            userId,
          },
        })

        return reply.status(201).send({
          typeOfExpense,
        })
      },
    )
}
