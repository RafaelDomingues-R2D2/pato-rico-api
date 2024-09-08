import { and, between, eq, sum } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { categories, transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

interface getMonthTransactionOutcomeCategoryResponse {
  category: string
  amount: number
  fill: string
}
interface ConfigItem {
  label?: string
}

interface configMonthTransactionOutcomeCategoryResponse {
  [key: string]: ConfigItem
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
              eq(transactions.type, 'OUTCOME'),
              eq(transactions.userId, userId),
              between(transactions.date, from, to),
            ),
          )
          .groupBy(categories.name)

        const result: getMonthTransactionOutcomeCategoryResponse[] = []
        const config: configMonthTransactionOutcomeCategoryResponse = {
          [String('amount')]: {
            label: 'amount',
          },
        }

        let count = 1
        query.forEach((q) => {
          result.push({
            category: String(q.category),
            amount: Number(q.amount) / 100,
            fill: `hsl(var(--chart-${count}))`,
          })

          config[String(q.category)] = {
            label: String(q.category),
          }

          count++
        })

        return { result, config }
      },
    )
}
