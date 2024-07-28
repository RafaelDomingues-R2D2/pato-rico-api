import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

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
            paymentForm: z.nativeEnum(PaymentFormEnum).optional(),
            categoryId: z.string(),
            typeOfExpenseId: z.string(),
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

        const transaction = await db
          .insert(transactions)
          .values({
            name,
            description,
            date,
            type,
            value: String(value),
            paymentForm,
            userId,
            categoryId,
            typeOfExpenseId,
          })
          .returning()

        return reply.status(201).send({
          transaction,
        })
      },
    )
}
