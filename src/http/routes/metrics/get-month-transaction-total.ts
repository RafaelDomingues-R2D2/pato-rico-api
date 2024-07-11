import dayjs from 'dayjs'
import { and, eq, gte, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getMonthTransactionTotal(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/metrics/month-transaction-total', async (request) => {
      const today = dayjs()
      const lastMonth = today.subtract(0, 'month')
      const startOfLastMonth = lastMonth.startOf('month')

      const userId = await request.getCurrentUserId()

      const income = await db
        .select({
          amount: sum(transactions.value),
        })
        .from(transactions)
        .where(
          and(
            gte(transactions.createdAt, startOfLastMonth.toDate()),
            eq(transactions.type, 'INCOME'),
            eq(transactions.userId, userId),
          ),
        )

      const outcome = await db
        .select({
          amount: sum(transactions.value),
        })
        .from(transactions)
        .where(
          and(
            gte(transactions.createdAt, startOfLastMonth.toDate()),
            eq(transactions.type, 'OUTCOME'),
            eq(transactions.userId, userId),
          ),
        )

      return {
        amount: Number(income[0].amount) - Number(outcome[0].amount),
      }
    })
}
