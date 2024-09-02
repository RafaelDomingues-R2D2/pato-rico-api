import { and, between, eq, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getMonthTransactionOutcome(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/metrics/month-transaction-outcome',
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

        const transactionsPerMonth = await db
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

        return { amount: transactionsPerMonth[0].amount ?? 0 }
      },
    )
}
