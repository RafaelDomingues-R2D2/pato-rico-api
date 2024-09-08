import { and, between, eq, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { categories, reservations, transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

interface getMonthTransactionOutcomeTypeOfExpenseResponse {
  name: string
  valor: number
  meta: number
}

export async function getMonthTransactionOutcomeTypeOfExpense(
  app: FastifyInstance,
) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/metrics/month-transaction-outcome-reservation',
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

        const query = await db
          .select({
            name: reservations.name,
            amount: sum(transactions.value),
            goal: reservations.goalValue,
          })
          .from(transactions)
          .leftJoin(categories, eq(categories.id, transactions.categoryId))
          .leftJoin(reservations, eq(reservations.id, categories.reservationId))
          .where(
            and(
              eq(transactions.type, 'OUTCOME'),
              eq(transactions.userId, userId),
              between(transactions.date, from, to),
            ),
          )
          .groupBy(reservations.name, reservations.goalValue)

        const result: getMonthTransactionOutcomeTypeOfExpenseResponse[] = []

        query.forEach((q) => {
          result.push({
            name: String(q.name),
            valor: Number(q.amount) / 100,
            meta: Number(q.goal) / 100,
          })
        })

        return result
      },
    )
}
