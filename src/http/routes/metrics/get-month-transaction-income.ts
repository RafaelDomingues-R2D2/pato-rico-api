import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getMonthTransactionIncome(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/metrics/month-transaction-income', async (request) => {
      const today = dayjs()
      const lastMonth = today.subtract(1, 'month')
      const startOfLastMonth = new Date(String(lastMonth.startOf('month')))

      const userId = await request.getCurrentUserId()

      const metrics = await prisma.transaction.aggregate({
        _avg: { value: true },
        where: {
          AND: { createdAt: { gte: startOfLastMonth } },
          type: 'INCOME',
          userId,
        },
      })

      return { metrics }
    })
}
