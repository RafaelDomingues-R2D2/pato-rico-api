import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const connection = postgres(String(process.env.DB_URL))

export const db = drizzle(connection, { schema })
