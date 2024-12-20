import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { reservations } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createReservation(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/reservations',
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

        const reservation = await db
          .insert(reservations)
          .values({
            name,
            description: description ?? '',
            goalValue,
            userId,
          })
          .returning()

        return reply.status(201).send({
          reservation,
        })
      },
    )
}
