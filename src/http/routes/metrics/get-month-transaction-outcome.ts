import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getMonthTransactionOutcome(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/metrics/month-transaction-outcome', async (request) => {
      const today = dayjs()
      const lastMonth = today.subtract(0, 'month')
      const startOfLastMonth = new Date(String(lastMonth.startOf('month')))

      const userId = await request.getCurrentUserId()
      console.log('startOfLastMonth ', startOfLastMonth)
      const metrics = await prisma.transaction.aggregate({
        _avg: { value: true },
        where: {
          AND: { createdAt: { gte: startOfLastMonth } },
          type: 'OUTCOME',
          userId,
        },
      })

      return { metrics }
    })
}
