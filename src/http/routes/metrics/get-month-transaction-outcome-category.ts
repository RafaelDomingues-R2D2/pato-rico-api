import dayjs from 'dayjs'
import { and, between, eq, gte, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { categories, transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

interface getMonthTransactionOutcomeCategoryResponse {
  category: string
  amount: number
}

export async function getMonthTransactionOutcomeCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/metrics/month-transaction-outcome-category',
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

        const today = dayjs()
        const lastMonth = today.subtract(0, 'month')
        const startOfLastMonth = lastMonth.startOf('month')

        const userId = await request.getCurrentUserId()

        const query = await db
          .select({
            category: categories.name,
            amount: sum(transactions.value),
          })
          .from(transactions)
          .leftJoin(categories, eq(categories.id, transactions.categoryId))
          .where(
            and(
              gte(transactions.createdAt, startOfLastMonth.toDate()),
              eq(transactions.type, 'OUTCOME'),
              eq(transactions.userId, userId),
              between(transactions.date, from, to),
            ),
          )
          .groupBy(categories.name)

        const result: getMonthTransactionOutcomeCategoryResponse[] = []

        query.forEach((q) => {
          result.push({
            category: String(q.category),
            amount: Number(q.amount),
          })
        })

        return result
      },
    )
}
