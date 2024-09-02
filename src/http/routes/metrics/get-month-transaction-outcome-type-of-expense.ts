import { and, between, eq, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { transactions, typesOfExpenses } from '@/db/schema'
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
      '/metrics/month-transaction-outcome-type-of-expense',
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
            name: typesOfExpenses.name,
            amount: sum(transactions.value),
            goal: typesOfExpenses.goalValue,
          })
          .from(transactions)
          .leftJoin(
            typesOfExpenses,
            eq(typesOfExpenses.id, transactions.typeOfExpenseId),
          )
          .where(
            and(
              eq(transactions.type, 'OUTCOME'),
              eq(transactions.userId, userId),
              between(transactions.date, from, to),
            ),
          )
          .groupBy(typesOfExpenses.name, typesOfExpenses.goalValue)

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
