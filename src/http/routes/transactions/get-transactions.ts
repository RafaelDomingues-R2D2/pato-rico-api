import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'

export async function getTransactions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/transactions', async () => {
    const transactions = await db.query.transactions.findMany({
      with: { categories: true, typeOfexpenses: true },
    })

    return { transactions }
  })
}
