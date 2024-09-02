import { and, between, eq, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getMonthTransactionTotal(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/metrics/month-transaction-total',
      {
        schema: {
          querystring: z.object({
            from: z.string(),
            to: z.string(),
          }),
        },
      },
      async (request) => {
        const { from, to } = request.query

        const userId = await request.getCurrentUserId()

        const income = await db
          .select({
            amount: sum(transactions.value),
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.type, 'INCOME'),
              eq(transactions.userId, userId),
              between(transactions.date, from, to),
            ),
          )

        const outcome = await db
          .select({
            amount: sum(transactions.value),
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.type, 'OUTCOME'),
              eq(transactions.userId, userId),
              between(transactions.date, from, to),
            ),
          )

        return {
          amount: Number(income[0].amount) - Number(outcome[0].amount),
        }
      },
    )
}
