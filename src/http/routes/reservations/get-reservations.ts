import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { auth } from '@/http/middlewares/auth'

export async function getReservations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/reservation', async () => {
      const reservation = await db.query.reservations.findMany()

      return { reservation }
    })
}
