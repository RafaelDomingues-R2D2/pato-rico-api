import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { auth } from '@/http/middlewares/auth'

export async function getTypesOfExpense(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/types-of-expense', async () => {
      const typesOfExpense = await db.query.typesOfExpenses.findMany()

      return { typesOfExpense }
    })
}
