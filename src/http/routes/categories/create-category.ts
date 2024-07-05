import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

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

        const category = await prisma.category.create({
          data: {
            name,
            description,
            type,
            goalValue,
            userId,
          },
        })

        return reply.status(201).send({
          category,
        })
      },
    )
}
