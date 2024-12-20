import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { reservations } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getReservations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/reservations', async (request) => {
      const userId = await request.getCurrentUserId()
      const result = await db
        .select()
        .from(reservations)
        .where(eq(reservations.userId, userId))

      return { reservations: result }
    })
}
