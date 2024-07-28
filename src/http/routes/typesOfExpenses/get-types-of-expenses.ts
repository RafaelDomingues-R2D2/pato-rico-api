import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'

export async function getTypesOfExpense(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/types-of-expense', async () => {
    const typesOfTransactions = await db.query.typeOfExpenses.findMany()

    return { typesOfTransactions }
  })
}
