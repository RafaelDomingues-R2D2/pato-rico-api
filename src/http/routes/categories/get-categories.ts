import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'

export async function getCategories(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/categories', async () => {
    const categories = await prisma.category.findMany()

    return { categories }
  })
}
