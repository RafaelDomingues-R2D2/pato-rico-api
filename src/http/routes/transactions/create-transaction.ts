import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

enum TransactionType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

enum PaymentFormEnum {
  CREDIT = 'CREDIT',
  MONEY = 'MONEY',
  DEBIT = 'DEBIT',
  PIX = 'PIX',
}

export async function createTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/transactions',
      {
        schema: {
          body: z.object({
            name: z.string(),
            description: z.string().optional(),
            date: z.string(),
            type: z.nativeEnum(TransactionType),
            value: z.number(),
            paymentForm: z.nativeEnum(PaymentFormEnum),
            categoryId: z.string().uuid(),
            typeOfExpenseId: z.string().uuid(),
          }),
        },
      },

      async (request, reply) => {
        const {
          name,
          description,
          date,
          type,
          value,
          paymentForm,
          categoryId,
          typeOfExpenseId,
        } = request.body

        const userId = await request.getCurrentUserId()

        const transaction = await prisma.transaction.create({
          data: {
            name,
            description: description ?? '',
            date: new Date(date),
            type,
            value,
            paymentForm,
            userId,
            categoryId,
            typeOfExpenseId,
          },
        })

        return reply.status(201).send({
          transaction,
        })
      },
    )
}
