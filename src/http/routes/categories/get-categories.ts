import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { auth } from '@/http/middlewares/auth'

export async function getCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/categories', async () => {
      const categories = await db.query.categories.findMany()

      return { categories }
    })
}
