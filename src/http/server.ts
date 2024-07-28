import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { createCategory } from './routes/categories/create-category'
import { getCategories } from './routes/categories/get-categories'
import { getMonthTransactionIncome } from './routes/metrics/get-month-transaction-income'
import { getMonthTransactionOutcome } from './routes/metrics/get-month-transaction-outcome'
import { getMonthTransactionOutcomeCategory } from './routes/metrics/get-month-transaction-outcome-category'
import { getMonthTransactionOutcomeTypeOfExpense } from './routes/metrics/get-month-transaction-outcome-type-of-expense'
import { createTransaction } from './routes/transactions/create-transaction'
import { getTransactions } from './routes/transactions/get-transactions'
import { createTypeOfExpense } from './routes/typesOfExpenses/create-type-of-expense'
import { getTypesOfExpense } from './routes/typesOfExpenses/get-types-of-expenses'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyJwt, { secret: String(process.env.JWT_SECRET) })

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(createCategory)
app.register(getCategories)
app.register(createTypeOfExpense)
app.register(getTypesOfExpense)
app.register(createTransaction)
app.register(getTransactions)
app.register(getMonthTransactionIncome)
app.register(getMonthTransactionOutcome)
app.register(getMonthTransactionOutcomeCategory)
app.register(getMonthTransactionOutcomeTypeOfExpense)

const port = Number(process.env.PORT) || 3333
const address = '0.0.0.0'

app.listen({ port, host: address }).then(() => {
  console.log('HTTP server running!')
})
