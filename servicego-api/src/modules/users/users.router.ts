import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { updateProfileSchema } from './users.schema.js';
import * as usersService from './users.service.js';

export const usersRouter = Router();

usersRouter.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await usersService.getProfile(req.user!.sub);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

usersRouter.patch('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateProfileSchema.parse(req.body);
    const profile = await usersService.updateProfile(req.user!.sub, input);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});
