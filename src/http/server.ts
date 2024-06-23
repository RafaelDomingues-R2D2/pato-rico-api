import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { createAccount } from './routes/_errors/auth/create-account'
import { authenticateWithPassword } from './routes/_errors/auth/authenticate-with-password'
import { getProfile } from './routes/_errors/auth/get-profile'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyJwt, { secret: String(process.env.JWT_SECRET) })

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

app.listen({ port: Number(process.env.PORT) || 3333 }).then(() => {
  console.log('HTTP server running!')
})
