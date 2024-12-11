import { sql } from 'drizzle-orm';
import { pgTable, uuid } from 'drizzle-orm/pg-core';

/**
 * Users table
 */

export const users = pgTable('users', {
	id: 
		uuid()
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
});
