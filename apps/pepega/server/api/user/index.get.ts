import { getSessionUser } from '~~/server/utils/user';
import { defineEventHandler } from 'h3';
import type { UserModel } from '~~/shared/models/user';

export default defineEventHandler(async (event): Promise<UserModel> => getSessionUser(event));
