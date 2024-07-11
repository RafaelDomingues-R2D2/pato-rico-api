import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'

export async function getCategories(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/categories', async () => {
    const categories = await db.query.categories.findMany()

    return { categories }
  })
}
