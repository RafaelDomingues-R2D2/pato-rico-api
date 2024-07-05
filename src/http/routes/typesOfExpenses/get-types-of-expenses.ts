import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'

export async function getTypesOfTransactions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/typesOfTransactions', async () => {
      const typesOfTransactions = await prisma.typeOfExpense.findMany()

      return { typesOfTransactions }
    })
}
