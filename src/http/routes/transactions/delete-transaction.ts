import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { transactions } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

interface Params {
  id: string
}

export async function deleteTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete<{ Params: Params }>('/transactions/:id', async (params, reply) => {
      const { id } = params.params
      console.log('id ', id)
      console.log('params ', params)

      await db.delete(transactions).where(eq(transactions.id, id))

      return reply.status(201).send()
    })
}
