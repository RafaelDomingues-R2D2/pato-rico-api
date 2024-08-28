import { and, between, count, eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { categories, transactions, typesOfExpenses } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getTransactions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transactions',
      {
        schema: {
          querystring: z.object({
            initialDate: z.string().optional(),
            endDate: z.string().optional(),
            pageIndex: z.string(),
          }),
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const { initialDate, endDate, pageIndex } = request.query

        const baseQuery = db
          .select({
            id: transactions.id,
            name: transactions.name,
            description: transactions.description,
            date: transactions.date,
            value: transactions.value,
            type: transactions.type,
            paymentForm: transactions.paymentForm,
            category: categories.name,
            typeOfExpense: typesOfExpenses.name,
            typeOfExpenseGoalValue: typesOfExpenses.goalValue,
          })
          .from(transactions)
          .leftJoin(categories, eq(categories.id, transactions.categoryId))
          .leftJoin(
            typesOfExpenses,
            eq(typesOfExpenses.id, transactions.typeOfExpenseId),
          )
          .where(
            and(
              initialDate && endDate
                ? between(transactions.date, initialDate, endDate)
                : undefined,
              eq(transactions.userId, userId),
            ),
          )

        const [transactionsCount] = await db
          .select({ count: count() })
          .from(baseQuery.as('baseQuery'))

        const allTransactions = await baseQuery
          .offset(Number(pageIndex) * 10)
          .limit(10)
          .orderBy(transactions.date)

        const result = {
          transactions: allTransactions,
          meta: {
            pageIndex,
            perPage: 10,
            totalCount: transactionsCount.count,
          },
        }

        return result
      },
    )
}
