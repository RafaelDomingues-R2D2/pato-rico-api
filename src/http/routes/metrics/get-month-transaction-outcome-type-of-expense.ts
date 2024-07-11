import dayjs from 'dayjs'
import { and, eq, gte, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { transactions, typeOfExpenses } from '@/db/schema'
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
      async (request) => {
        const today = dayjs()
        const lastMonth = today.subtract(0, 'month')
        const startOfLastMonth = lastMonth.startOf('month')

        const userId = await request.getCurrentUserId()

        const query = await db
          .select({
            name: typeOfExpenses.name,
            amount: sum(transactions.value),
            goal: typeOfExpenses.goalValue,
          })
          .from(transactions)
          .leftJoin(
            typeOfExpenses,
            eq(typeOfExpenses.id, transactions.typeOfExpenseId),
          )
          .where(
            and(
              gte(transactions.createdAt, startOfLastMonth.toDate()),
              eq(transactions.type, 'OUTCOME'),
              eq(transactions.userId, userId),
            ),
          )
          .groupBy(typeOfExpenses.name, typeOfExpenses.goalValue)

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
